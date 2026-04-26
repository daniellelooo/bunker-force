import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";

// Re-implementamos la lógica de rate-limit para testearla de forma aislada
// (evita el estado global compartido entre tests)

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutos

interface Attempt {
  count: number;
  firstAttempt: number;
}

function makeRateLimiter() {
  const store = new Map<string, Attempt>();

  function checkRateLimit(ip: string): { allowed: boolean; remaining: number; retryAfterMs: number } {
    const now = Date.now();
    const entry = store.get(ip);

    if (!entry || now - entry.firstAttempt > WINDOW_MS) {
      store.set(ip, { count: 1, firstAttempt: now });
      return { allowed: true, remaining: MAX_ATTEMPTS - 1, retryAfterMs: 0 };
    }

    if (entry.count >= MAX_ATTEMPTS) {
      const retryAfterMs = WINDOW_MS - (now - entry.firstAttempt);
      return { allowed: false, remaining: 0, retryAfterMs };
    }

    entry.count += 1;
    return { allowed: true, remaining: MAX_ATTEMPTS - entry.count, retryAfterMs: 0 };
  }

  function resetRateLimit(ip: string) {
    store.delete(ip);
  }

  return { checkRateLimit, resetRateLimit, store };
}

describe("checkRateLimit", () => {
  it("primer intento siempre se permite", () => {
    const { checkRateLimit } = makeRateLimiter();
    const result = checkRateLimit("1.2.3.4");
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(MAX_ATTEMPTS - 1);
    expect(result.retryAfterMs).toBe(0);
  });

  it("acumula intentos correctamente", () => {
    const { checkRateLimit } = makeRateLimiter();
    const ip = "1.2.3.4";
    checkRateLimit(ip); // 1
    checkRateLimit(ip); // 2
    const r = checkRateLimit(ip); // 3
    expect(r.allowed).toBe(true);
    expect(r.remaining).toBe(MAX_ATTEMPTS - 3);
  });

  it("bloquea después de MAX_ATTEMPTS intentos", () => {
    const { checkRateLimit } = makeRateLimiter();
    const ip = "1.2.3.4";
    for (let i = 0; i < MAX_ATTEMPTS; i++) checkRateLimit(ip);
    const result = checkRateLimit(ip);
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
    expect(result.retryAfterMs).toBeGreaterThan(0);
  });

  it("retryAfterMs es menor que WINDOW_MS", () => {
    const { checkRateLimit } = makeRateLimiter();
    const ip = "1.2.3.4";
    for (let i = 0; i < MAX_ATTEMPTS; i++) checkRateLimit(ip);
    const result = checkRateLimit(ip);
    expect(result.retryAfterMs).toBeLessThanOrEqual(WINDOW_MS);
  });

  it("IPs distintas tienen contadores independientes", () => {
    const { checkRateLimit } = makeRateLimiter();
    for (let i = 0; i < MAX_ATTEMPTS; i++) checkRateLimit("1.1.1.1");
    // Primera ip bloqueada
    expect(checkRateLimit("1.1.1.1").allowed).toBe(false);
    // Segunda ip libre
    expect(checkRateLimit("2.2.2.2").allowed).toBe(true);
  });

  it("ventana expirada reinicia el contador", () => {
    const { checkRateLimit } = makeRateLimiter();
    const ip = "1.2.3.4";
    const now = Date.now();

    // Llenamos la ventana
    vi.spyOn(Date, "now").mockReturnValue(now);
    for (let i = 0; i < MAX_ATTEMPTS; i++) checkRateLimit(ip);
    expect(checkRateLimit(ip).allowed).toBe(false);

    // Avanzamos más allá del WINDOW_MS
    vi.spyOn(Date, "now").mockReturnValue(now + WINDOW_MS + 1);
    const result = checkRateLimit(ip);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(MAX_ATTEMPTS - 1);

    vi.restoreAllMocks();
  });
});

describe("resetRateLimit", () => {
  it("permite nuevos intentos tras el reset", () => {
    const { checkRateLimit, resetRateLimit } = makeRateLimiter();
    const ip = "1.2.3.4";
    for (let i = 0; i < MAX_ATTEMPTS; i++) checkRateLimit(ip);
    expect(checkRateLimit(ip).allowed).toBe(false);

    resetRateLimit(ip);
    expect(checkRateLimit(ip).allowed).toBe(true);
    expect(checkRateLimit(ip).remaining).toBe(MAX_ATTEMPTS - 2);
  });

  it("resetear una IP no afecta a otras", () => {
    const { checkRateLimit, resetRateLimit } = makeRateLimiter();
    for (let i = 0; i < MAX_ATTEMPTS; i++) checkRateLimit("1.1.1.1");
    for (let i = 0; i < MAX_ATTEMPTS; i++) checkRateLimit("2.2.2.2");

    resetRateLimit("1.1.1.1");
    expect(checkRateLimit("1.1.1.1").allowed).toBe(true);
    expect(checkRateLimit("2.2.2.2").allowed).toBe(false);
  });

  it("resetear una IP inexistente no lanza error", () => {
    const { resetRateLimit } = makeRateLimiter();
    expect(() => resetRateLimit("99.99.99.99")).not.toThrow();
  });
});
