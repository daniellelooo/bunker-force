import { NextRequest } from "next/server";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import type { Order } from "@/lib/types";
import { validateOrder } from "@/lib/validation";

const ordersPath = join(process.cwd(), "data", "orders.json");

function getOrders(): Order[] {
  try {
    return JSON.parse(readFileSync(ordersPath, "utf-8"));
  } catch {
    return [];
  }
}

function saveOrders(orders: Order[]) {
  writeFileSync(ordersPath, JSON.stringify(orders, null, 2), "utf-8");
}

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
  const orders = getOrders();

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

  orders.push(order);
  saveOrders(orders);

  return Response.json(order, { status: 201 });
}
