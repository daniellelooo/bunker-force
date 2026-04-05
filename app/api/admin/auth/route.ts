import { NextRequest } from "next/server";
import { validateAuth } from "@/lib/validation";
import { checkRateLimit, resetRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  // Rate limiting por IP
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
  const adminPassword = process.env.ADMIN_PASSWORD?.trim();
  const secretToken = process.env.ADMIN_SECRET_TOKEN?.trim();

  if (!adminPassword || !secretToken) {
    return Response.json({ error: "Configuración del servidor incorrecta" }, { status: 500 });
  }

  if (!password || password.trim() !== adminPassword) {
    return Response.json(
      {
        error: "Contraseña incorrecta",
        attemptsRemaining: limit.remaining,
      },
      { status: 401 }
    );
  }

  // Login correcto → resetear contador
  resetRateLimit(ip);

  const maxAge = 60 * 60 * 24 * 7; // 7 días
  const cookieValue = `admin_token=${secretToken}; HttpOnly; Path=/; Max-Age=${maxAge}; SameSite=Lax`;

  return Response.json(
    { success: true },
    {
      status: 200,
      headers: { "Set-Cookie": cookieValue },
    }
  );
}
