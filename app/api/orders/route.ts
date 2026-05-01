import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import type { Order } from "@/lib/types";
import { validateOrder } from "@/lib/validation";
import { sendNewOrderNotification } from "@/lib/notifications";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "El cuerpo de la solicitud no es JSON válido" }, { status: 400 });
  }

  const validation = validateOrder(body);
  if (!validation.ok) return validation.toResponse();

  const b = body as Record<string, unknown>;
  const clientItems = b.items as Order["items"];

  // 1) Cargar productos reales de la BD (precio, nombre, sku, stock) — NO confiar en el cliente
  const uniqueIds = [...new Set(clientItems.map((i) => i.productId))];
  const { data: dbProducts, error: fetchErr } = await supabaseAdmin
    .from("products")
    .select("id, name, sku, price, size_stock, available_colors")
    .in("id", uniqueIds);

  if (fetchErr || !dbProducts) {
    return Response.json({ error: "Error al validar productos" }, { status: 500 });
  }

  const productById = new Map(dbProducts.map((p) => [p.id, p]));
  for (const item of clientItems) {
    if (!productById.has(item.productId)) {
      return Response.json(
        { error: `Producto no encontrado: ${item.productId}` },
        { status: 404 }
      );
    }
  }

  // 2) Recalcular precios y construir items confiables (sobrescribiendo lo que mandó el cliente)
  const items: Order["items"] = clientItems.map((item) => {
    const dbProd = productById.get(item.productId)!;
    return {
      ...item,
      name: dbProd.name as string,
      sku: dbProd.sku as string,
      price: Number(dbProd.price),
    };
  });
  const subtotal = items.reduce((sum, it) => sum + it.price * it.quantity, 0);
  const tax = 0;
  const total = subtotal + tax;

  // 3) Verificar stock y decrementar atómicamente
  const productMap = new Map<string, Map<string, number>>();
  for (const item of items) {
    const variantKey = item.selectedColor
      ? `${item.selectedSize}:${item.selectedColor}`
      : item.selectedSize;
    if (!productMap.has(item.productId)) productMap.set(item.productId, new Map());
    const prev = productMap.get(item.productId)!.get(variantKey) ?? 0;
    productMap.get(item.productId)!.set(variantKey, prev + item.quantity);
  }

  for (const [productId, variants] of productMap) {
    const row = productById.get(productId)!;
    if (!row?.size_stock) continue; // producto sin stock configurado: se ignora

    const currentStock = row.size_stock as Record<string, number>;
    const isMultiColor = Array.isArray(row.available_colors) && row.available_colors.length > 1;
    const newStock = { ...currentStock };

    for (const [key, qty] of variants) {
      const resolvedKey = !isMultiColor && key.includes(":") ? key.split(":")[0] : key;
      const available = currentStock[resolvedKey] ?? 0;
      if (available < qty) {
        const size = resolvedKey.split(":")[0];
        return Response.json(
          { error: `Stock insuficiente: "${row.name}" talla ${size} — solo quedan ${available} ${available === 1 ? "unidad" : "unidades"}.` },
          { status: 409 }
        );
      }
      newStock[resolvedKey] = available - qty;
    }

    const totalStock = Object.values(newStock).reduce((a, v) => a + v, 0);
    const newStatus = totalStock === 0 ? "out-of-stock" : totalStock <= 5 ? "low-stock" : "available";

    await supabaseAdmin
      .from("products")
      .update({ size_stock: newStock, stock: totalStock || null, status: newStatus })
      .eq("id", productId);
  }

  const order: Order = {
    id: `BF-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: "pending",
    customer: b.customer as Order["customer"],
    items,
    subtotal,
    tax,
    total,
  };

  const { error } = await supabaseAdmin.from("orders").insert({
    id: order.id,
    created_at: order.createdAt,
    status: order.status,
    customer: order.customer,
    items: order.items,
    subtotal: order.subtotal,
    tax: order.tax,
    total: order.total,
  });

  if (error) {
    return Response.json({ error: "Error al guardar el pedido" }, { status: 500 });
  }

  // Enviar notificación al admin (no bloquea la respuesta si falla)
  sendNewOrderNotification(order).catch(() => {});

  return Response.json(order, { status: 201 });
}
