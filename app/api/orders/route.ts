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
