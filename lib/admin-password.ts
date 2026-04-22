const ITERATIONS = 100_000;
const KEY_LENGTH = 32;

function toBase64(buf: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buf)));
}

function fromBase64(str: string): Uint8Array {
  return Uint8Array.from(atob(str), (c) => c.charCodeAt(0));
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16)) as Uint8Array<ArrayBuffer>;
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, hash: "SHA-256", iterations: ITERATIONS },
    keyMaterial,
    KEY_LENGTH * 8
  );
  return `${toBase64(salt.buffer as ArrayBuffer)}:${toBase64(bits)}`;
}

export async function verifyPassword(
  password: string,
  stored: string
): Promise<boolean> {
  const [saltB64, hashB64] = stored.split(":");
  if (!saltB64 || !hashB64) return false;
  const salt = fromBase64(saltB64) as Uint8Array<ArrayBuffer>;
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, hash: "SHA-256", iterations: ITERATIONS },
    keyMaterial,
    KEY_LENGTH * 8
  );
  return toBase64(bits) === hashB64;
}
