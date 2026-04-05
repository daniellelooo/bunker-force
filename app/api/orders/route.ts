import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import type { Order } from "@/lib/types";
import { validateOrder } from "@/lib/validation";

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
  const items = b.items as Order["items"];

  // Verificar stock y decrementar atómicamente
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
    const { data: row } = await supabaseAdmin
      .from("products")
      .select("size_stock, name")
      .eq("id", productId)
      .single();

    if (!row?.size_stock) continue; // producto sin stock configurado: se ignora

    const currentStock = row.size_stock as Record<string, number>;
    const newStock = { ...currentStock };

    for (const [key, qty] of variants) {
      const available = currentStock[key] ?? 0;
      if (available < qty) {
        const size = key.split(":")[0];
        return Response.json(
          { error: `Stock insuficiente: "${row.name}" talla ${size} — solo quedan ${available} ${available === 1 ? "unidad" : "unidades"}.` },
          { status: 409 }
        );
      }
      newStock[key] = available - qty;
    }

    const total = Object.values(newStock).reduce((a, v) => a + v, 0);
    const newStatus = total === 0 ? "out-of-stock" : total <= 5 ? "low-stock" : "available";

    await supabaseAdmin
      .from("products")
      .update({ size_stock: newStock, stock: total || null, status: newStatus })
      .eq("id", productId);
  }

  const order: Order = {
    id: `BF-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: "pending",
    customer: b.customer as Order["customer"],
    items: b.items as Order["items"],
    subtotal: b.subtotal as number,
    tax: b.tax as number,
    total: b.total as number,
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

  return Response.json(order, { status: 201 });
}
