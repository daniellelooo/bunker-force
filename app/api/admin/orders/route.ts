import { readFileSync } from "fs";
import { join } from "path";
import type { Order } from "@/lib/types";

const ordersPath = join(process.cwd(), "data", "orders.json");

export async function GET() {
  try {
    const orders: Order[] = JSON.parse(readFileSync(ordersPath, "utf-8"));
    return Response.json([...orders].reverse());
  } catch {
    return Response.json([]);
  }
}
