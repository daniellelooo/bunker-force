import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { isAdminRequest, unauthorizedResponse } from "@/lib/auth";

function mapOrder(row: Record<string, unknown>) {
  return {
    id: row.id,
    createdAt: row.created_at,
    status: row.status,
    customer: row.customer,
    items: row.items,
    subtotal: row.subtotal,
    tax: row.tax,
    total: row.total,
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminRequest(request))) return unauthorizedResponse();
  const { id } = await params;

  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return Response.json({ error: "Pedido no encontrado" }, { status: 404 });
  }

  return Response.json(mapOrder(data));
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminRequest(request))) return unauthorizedResponse();
  const { id } = await params;
  const { status: newStatus } = await request.json();

  // Leer el pedido actual antes de modificarlo
  const { data: currentOrder, error: fetchError } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError || !currentOrder) {
    return Response.json({ error: "Pedido no encontrado" }, { status: 404 });
  }

  // Al cancelar un pedido que no estaba cancelado → restaurar stock
  if (newStatus === "cancelled" && currentOrder.status !== "cancelled") {
    const items = currentOrder.items as Array<{
      productId: string;
      selectedSize: string;
      selectedColor?: string;
      quantity: number;
    }>;

    // Agrupar ítems por producto
    const productMap = new Map<string, Map<string, number>>();
    for (const item of items) {
      if (!productMap.has(item.productId)) productMap.set(item.productId, new Map());
      const clientKey = item.selectedColor
        ? `${item.selectedSize}:${item.selectedColor}`
        : item.selectedSize;
      const prev = productMap.get(item.productId)!.get(clientKey) ?? 0;
      productMap.get(item.productId)!.set(clientKey, prev + item.quantity);
    }

    for (const [productId, variants] of productMap) {
      const { data: product } = await supabaseAdmin
        .from("products")
        .select("size_stock, available_colors")
        .eq("id", productId)
        .single();

      if (!product?.size_stock) continue;

      const currentStock = product.size_stock as Record<string, number>;
      // Mismo criterio que el API de creación de pedidos: 1 color → clave "TALLA", varios → "TALLA:COLOR"
      const isMultiColor =
        Array.isArray(product.available_colors) && product.available_colors.length > 1;
      const newStock = { ...currentStock };

      for (const [clientKey, qty] of variants) {
        const resolvedKey =
          !isMultiColor && clientKey.includes(":") ? clientKey.split(":")[0] : clientKey;
        newStock[resolvedKey] = (newStock[resolvedKey] ?? 0) + qty;
      }

      const total = Object.values(newStock).reduce((a, v) => a + v, 0);
      const newProductStatus =
        total === 0 ? "out-of-stock" : total <= 5 ? "low-stock" : "available";

      await supabaseAdmin
        .from("products")
        .update({ size_stock: newStock, stock: total || null, status: newProductStatus })
        .eq("id", productId);
    }
  }

  // Actualizar estado del pedido
  const { data, error } = await supabaseAdmin
    .from("orders")
    .update({ status: newStatus })
    .eq("id", id)
    .select()
    .single();

  if (error || !data) {
    return Response.json({ error: "Pedido no encontrado" }, { status: 404 });
  }

  return Response.json(mapOrder(data));
}
