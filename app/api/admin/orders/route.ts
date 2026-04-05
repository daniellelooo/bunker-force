import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { isAdminRequest, unauthorizedResponse } from "@/lib/auth";

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) return unauthorizedResponse();
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
