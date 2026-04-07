import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { isAdminRequest, unauthorizedResponse } from "@/lib/auth";

// Endpoint ligero: solo devuelve el conteo de pedidos pendientes.
// Usa head:true para que Supabase no traiga filas, solo el COUNT.
export async function GET(request: NextRequest) {
  if (!(await isAdminRequest(request))) return unauthorizedResponse();

  const { count, error } = await supabaseAdmin
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("status", "pending");

  if (error) return Response.json({ count: 0 });
  return Response.json({ count: count ?? 0 });
}
