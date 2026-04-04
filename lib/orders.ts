import { supabaseAdmin } from "@/lib/supabase";
import type { Order } from "@/lib/types";

export async function adminGetAllOrders(): Promise<Order[]> {
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => ({
    id: row.id as string,
    createdAt: row.created_at as string,
    status: row.status as Order["status"],
    customer: row.customer as Order["customer"],
    items: row.items as Order["items"],
    subtotal: row.subtotal as number,
    tax: row.tax as number,
    total: row.total as number,
  }));
}
