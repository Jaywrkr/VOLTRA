// @ts-nocheck
// Minimal signed-cookie session — no JWT/session-store dependency needed for
// a single-user personal app. Token = base64(payload) + "." + HMAC-SHA256 hex.
import { createHmac, timingSafeEqual } from "node:crypto";

const COOKIE_NAME = "voltra_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 180; // 180 days — this is a personal device, not a shared kiosk

function secret() {
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error("AUTH_SECRET is not set");
  return s;
}

function sign(payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const mac = createHmac("sha256", secret()).update(body).digest("base64url");
  return `${body}.${mac}`;
}

function verify(token) {
  if (!token || !token.includes(".")) return null;
  const [body, mac] = token.split(".");
  const expected = createHmac("sha256", secret()).update(body).digest("base64url");
  const a = Buffer.from(mac);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString());
    if (payload.exp && Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

export function isConfigured() {
  return !!process.env.AUTH_PIN && !!process.env.AUTH_SECRET;
}

export function pinMatches(pin) {
  const expected = process.env.AUTH_PIN || "";
  const a = Buffer.from(String(pin || ""));
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function makeSessionCookie() {
  const token = sign({ exp: Date.now() + MAX_AGE_SECONDS * 1000 });
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${MAX_AGE_SECONDS}`;
}

export function clearSessionCookie() {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

function parseCookies(header) {
  const out = {};
  (header || "").split(";").forEach((part) => {
    const i = part.indexOf("=");
    if (i === -1) return;
    out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  });
  return out;
}

export function isAuthenticated(request) {
  if (!isConfigured()) return false;
  const cookies = parseCookies(request.headers.get("cookie"));
  return !!verify(cookies[COOKIE_NAME]);
}
