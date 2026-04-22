import { NextRequest } from "next/server";
import { validateAuth } from "@/lib/validation";
import { checkRateLimit, resetRateLimit } from "@/lib/rate-limit";
import { createSessionToken, SESSION_MAX_AGE } from "@/lib/session";
import { verifyPassword } from "@/lib/admin-password";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const limit = checkRateLimit(ip);

  if (!limit.allowed) {
    const minutes = Math.ceil(limit.retryAfterMs / 60000);
    return Response.json(
      { error: `Demasiados intentos. Intenta de nuevo en ${minutes} minuto${minutes !== 1 ? "s" : ""}.` },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "El cuerpo de la solicitud no es JSON válido" }, { status: 400 });
  }

  const validation = validateAuth(body);
  if (!validation.ok) return validation.toResponse();

  const { password } = body as { password: string };
  const secretToken = process.env.ADMIN_SECRET_TOKEN?.trim();

  if (!secretToken) {
    return Response.json({ error: "Configuración del servidor incorrecta" }, { status: 500 });
  }

  // Verificar contraseña: primero consulta el hash en DB, si no existe usa la variable de entorno
  let passwordValid = false;

  const { data } = await supabaseAdmin
    .from("admin_config")
    .select("value")
    .eq("key", "password_hash")
    .single();

  if (data?.value) {
    passwordValid = await verifyPassword(password, data.value);
  } else {
    const adminPassword = process.env.ADMIN_PASSWORD?.trim();
    if (!adminPassword) {
      return Response.json({ error: "Configuración del servidor incorrecta" }, { status: 500 });
    }
    passwordValid = password.trim() === adminPassword;
  }

  if (!passwordValid) {
    return Response.json(
      { error: "Contraseña incorrecta", attemptsRemaining: limit.remaining },
      { status: 401 }
    );
  }

  resetRateLimit(ip);
  console.log(`[admin] login exitoso desde IP: ${ip} — ${new Date().toISOString()}`);

  const token = await createSessionToken(secretToken);
  const isProduction = process.env.NODE_ENV === "production";
  const cookieValue = [
    `admin_token=${token}`,
    "HttpOnly",
    "Path=/",
    `Max-Age=${SESSION_MAX_AGE}`,
    "SameSite=Lax",
    ...(isProduction ? ["Secure"] : []),
  ].join("; ");

  return Response.json(
    { success: true },
    { status: 200, headers: { "Set-Cookie": cookieValue } }
  );
}
