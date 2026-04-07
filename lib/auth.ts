import { NextRequest } from "next/server";
import { verifySessionToken } from "@/lib/session";

export async function isAdminRequest(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get("admin_token")?.value;
  const secret = process.env.ADMIN_SECRET_TOKEN;
  if (!token || !secret) return false;
  return verifySessionToken(token, secret);
}

export function unauthorizedResponse() {
  return Response.json({ error: "No autorizado" }, { status: 401 });
}
