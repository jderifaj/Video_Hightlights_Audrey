import { createHmac, timingSafeEqual } from 'crypto';

const secret = () => import.meta.env.SESSION_SECRET ?? 'dev-secret-change-me';
const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

/** Create a signed, base64url-encoded session token. */
export function createSessionToken(username: string): string {
  const payload = `${username}:${Date.now()}`;
  const sig = createHmac('sha256', secret()).update(payload).digest('hex');
  return Buffer.from(`${payload}:${sig}`).toString('base64url');
}

/** Return the username if the token is valid and unexpired, otherwise null. */
export function verifySessionToken(token: string): string | null {
  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf8');
    const lastColon = decoded.lastIndexOf(':');
    const payload = decoded.slice(0, lastColon);
    const sig = decoded.slice(lastColon + 1);
    const expected = createHmac('sha256', secret()).update(payload).digest('hex');
    if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
    const parts = payload.split(':');
    const timestamp = Number(parts[1]);
    if (Date.now() - timestamp > SESSION_TTL_MS) return null;
    return parts[0]; // username
  } catch {
    return null;
  }
}

/** Timing-safe credential check against ADMIN_USERNAME / ADMIN_PASSWORD env vars. */
export function isValidCredentials(username: string, password: string): boolean {
  const validUser = import.meta.env.ADMIN_USERNAME ?? '';
  const validPass = import.meta.env.ADMIN_PASSWORD ?? '';
  if (!validUser || !validPass) return false;
  // Hash both sides so timingSafeEqual always compares equal-length buffers
  const hash = (s: string) => createHmac('sha256', secret()).update(s).digest('hex');
  const a = Buffer.from(hash(username + ':' + password));
  const b = Buffer.from(hash(validUser + ':' + validPass));
  return timingSafeEqual(a, b);
}
