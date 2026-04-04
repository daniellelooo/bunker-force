import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return Response.json([], { status: 200 });

  const orders = (data ?? []).map((row) => ({
    id: row.id,
    createdAt: row.created_at,
    status: row.status,
    customer: row.customer,
    items: row.items,
    subtotal: row.subtotal,
    tax: row.tax,
    total: row.total,
  }));

  return Response.json(orders);
}
