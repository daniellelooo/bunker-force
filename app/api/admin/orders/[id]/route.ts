import { NextRequest } from "next/server";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import type { Order } from "@/lib/types";

const ordersPath = join(process.cwd(), "data", "orders.json");

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { status } = await request.json();

  let orders: Order[] = [];
  try {
    orders = JSON.parse(readFileSync(ordersPath, "utf-8"));
  } catch {
    return Response.json({ error: "No se pudo leer orders" }, { status: 500 });
  }

  const index = orders.findIndex((o) => o.id === id);
  if (index === -1) {
    return Response.json({ error: "Pedido no encontrado" }, { status: 404 });
  }

  orders[index].status = status;
  writeFileSync(ordersPath, JSON.stringify(orders, null, 2), "utf-8");

  return Response.json(orders[index]);
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  let orders: Order[] = [];
  try {
    orders = JSON.parse(readFileSync(ordersPath, "utf-8"));
  } catch {
    return Response.json({ error: "No se pudo leer orders" }, { status: 500 });
  }

  const order = orders.find((o) => o.id === id);
  if (!order) {
    return Response.json({ error: "Pedido no encontrado" }, { status: 404 });
  }

  return Response.json(order);
}
