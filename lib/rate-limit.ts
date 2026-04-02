// Rate limiting en memoria — sin dependencias externas
// Se reinicia con el servidor, suficiente para una tienda pequeña

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutos

interface Attempt {
  count: number;
  firstAttempt: number;
}

const store = new Map<string, Attempt>();

export function checkRateLimit(ip: string): { allowed: boolean; remaining: number; retryAfterMs: number } {
  const now = Date.now();
  const entry = store.get(ip);

  // Sin intentos previos o ventana expirada → limpiar y permitir
  if (!entry || now - entry.firstAttempt > WINDOW_MS) {
    store.set(ip, { count: 1, firstAttempt: now });
    return { allowed: true, remaining: MAX_ATTEMPTS - 1, retryAfterMs: 0 };
  }

  // Dentro de la ventana
  if (entry.count >= MAX_ATTEMPTS) {
    const retryAfterMs = WINDOW_MS - (now - entry.firstAttempt);
    return { allowed: false, remaining: 0, retryAfterMs };
  }

  entry.count += 1;
  return { allowed: true, remaining: MAX_ATTEMPTS - entry.count, retryAfterMs: 0 };
}

export function resetRateLimit(ip: string) {
  store.delete(ip);
}
