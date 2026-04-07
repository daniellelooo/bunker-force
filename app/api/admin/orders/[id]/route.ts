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
  const { status } = await request.json();

  const { data, error } = await supabaseAdmin
    .from("orders")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error || !data) {
    return Response.json({ error: "Pedido no encontrado" }, { status: 404 });
  }

  return Response.json(mapOrder(data));
}
