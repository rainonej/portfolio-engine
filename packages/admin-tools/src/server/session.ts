/**
 * Signed session cookie for GitHub-backed admin (same model as professional_site).
 */

const SESSION_MAX_AGE_MS = 24 * 60 * 60 * 1000;

export function parseCookies(header: string | null): Record<string, string> {
  if (!header) return {};
  return Object.fromEntries(
    header.split(';').map((c) => {
      const eq = c.indexOf('=');
      return eq === -1
        ? [c.trim(), '']
        : [c.slice(0, eq).trim(), c.slice(eq + 1).trim()];
    }),
  );
}

function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

async function hmacHex(data: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export interface SessionData {
  login: string;
  accessToken: string;
}

export async function verifySession(token: string, secret: string): Promise<SessionData | null> {
  const lastDot = token.lastIndexOf('.');
  if (lastDot === -1) return null;

  const payload = token.slice(0, lastDot);
  const sig = token.slice(lastDot + 1);

  const expectedHex = await hmacHex(payload, secret);
  if (!timingSafeEqualHex(sig, expectedHex)) return null;

  const parts = payload.split('.');
  if (parts.length < 3) return null;

  const login = parts[0];
  const issuedAt = parseInt(parts[1], 10);
  const accessToken = parts.slice(2).join('.');

  if (!login || Number.isNaN(issuedAt) || !accessToken) return null;
  if (Date.now() - issuedAt > SESSION_MAX_AGE_MS) return null;

  return { login, accessToken };
}

export async function buildSessionToken(
  login: string,
  issuedAt: number,
  accessToken: string,
  secret: string,
): Promise<string> {
  const payload = `${login}.${issuedAt}.${accessToken}`;
  const sig = await hmacHex(payload, secret);
  return `${payload}.${sig}`;
}

export function sessionCookieFlags(): string {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `HttpOnly${secure}; SameSite=Lax; Path=/`;
}
