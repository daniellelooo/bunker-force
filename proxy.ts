import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, createSessionToken, SESSION_MAX_AGE } from "@/lib/session";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rutas públicas del admin: login page y el endpoint de autenticación
  if (pathname === "/admin/login" || pathname === "/api/admin/auth") {
    return NextResponse.next();
  }

  const token = request.cookies.get("admin_token")?.value;
  const secret = process.env.ADMIN_SECRET_TOKEN;

  if (!secret) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const isValid = !!token && (await verifySessionToken(token, secret));

  if (!isValid) {
    if (pathname.startsWith("/api/admin/")) {
      return Response.json({ error: "No autorizado" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // Sesión válida: renovar cookie (ventana deslizante de 8h)
  const response = NextResponse.next();
  const newToken = await createSessionToken(secret);
  response.cookies.set("admin_token", newToken, {
    httpOnly: true,
    path: "/",
    maxAge: SESSION_MAX_AGE,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
