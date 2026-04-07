// JWT firmado con HMAC-SHA256 usando Web Crypto API (compatible con Edge y Node).
// El secreto en .env es la llave de firma — nunca viaja al cliente.
// Cada token es único (jti aleatorio) y tiene expiración embebida.

const ALG = { name: 'HMAC', hash: 'SHA-256' } as const;
export const SESSION_MAX_AGE = 8 * 60 * 60; // 8 horas en segundos

function toBase64url(data: ArrayBuffer | Uint8Array): string {
  const bytes = data instanceof Uint8Array ? data : new Uint8Array(data);
  let binary = '';
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function fromBase64url(str: string): Uint8Array {
  const b64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function encodeSegment(obj: object): string {
  const bytes = new TextEncoder().encode(JSON.stringify(obj));
  return toBase64url(bytes);
}

async function importKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    ALG,
    false,
    ['sign', 'verify']
  );
}

/** Genera un JWT firmado con id único y expiración de SESSION_MAX_AGE. */
export async function createSessionToken(secret: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const jtiBytes = new Uint8Array(16);
  crypto.getRandomValues(jtiBytes);
  const jti = Array.from(jtiBytes, (b) => b.toString(16).padStart(2, '0')).join('');

  const header = encodeSegment({ alg: 'HS256', typ: 'JWT' });
  const payload = encodeSegment({ iat: now, exp: now + SESSION_MAX_AGE, jti });
  const unsigned = `${header}.${payload}`;

  const key = await importKey(secret);
  const sig = await crypto.subtle.sign(ALG, key, new TextEncoder().encode(unsigned));

  return `${unsigned}.${toBase64url(sig)}`;
}

/** Verifica firma y expiración. Retorna false ante cualquier anomalía. */
export async function verifySessionToken(token: string, secret: string): Promise<boolean> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    const [header, payload, sig] = parts;

    const key = await importKey(secret);
    const data = new TextEncoder().encode(`${header}.${payload}`);
    const valid = await crypto.subtle.verify(ALG, key, fromBase64url(sig), data);
    if (!valid) return false;

    const claims = JSON.parse(new TextDecoder().decode(fromBase64url(payload)));
    return Math.floor(Date.now() / 1000) < claims.exp;
  } catch {
    return false;
  }
}
