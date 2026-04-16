import { createHmac, timingSafeEqual } from 'crypto';

const secret = () => "dev-secret-change-me";
const SESSION_TTL_MS = 24 * 60 * 60 * 1e3;
function createSessionToken(username) {
  const payload = `${username}:${Date.now()}`;
  const sig = createHmac("sha256", secret()).update(payload).digest("hex");
  return Buffer.from(`${payload}:${sig}`).toString("base64url");
}
function verifySessionToken(token) {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const lastColon = decoded.lastIndexOf(":");
    const payload = decoded.slice(0, lastColon);
    const sig = decoded.slice(lastColon + 1);
    const expected = createHmac("sha256", secret()).update(payload).digest("hex");
    if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
    const parts = payload.split(":");
    const timestamp = Number(parts[1]);
    if (Date.now() - timestamp > SESSION_TTL_MS) return null;
    return parts[0];
  } catch {
    return null;
  }
}
function isValidCredentials(username, password) {
  return false;
}

export { createSessionToken as c, isValidCredentials as i, verifySessionToken as v };
