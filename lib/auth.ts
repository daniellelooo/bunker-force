import { NextRequest } from "next/server";

export function isAdminRequest(request: NextRequest): boolean {
  const token = request.cookies.get("admin_token")?.value;
  const secret = process.env.ADMIN_SECRET_TOKEN;
  return !!token && !!secret && token === secret;
}

export function unauthorizedResponse() {
  return Response.json({ error: "No autorizado" }, { status: 401 });
}
