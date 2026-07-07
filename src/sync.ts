// @ts-nocheck
// Cloud sync client. Talks to /api/* (only present once the Vercel project
// has a Postgres DB + AUTH_PIN/AUTH_SECRET configured). Every call degrades
// silently to "cloud unavailable" on network failure or a missing backend —
// localStorage stays the source of truth locally either way.
let syncEnabled = false;
let pending = {};
let flushTimer = null;

export function setSyncEnabled(v) {
  syncEnabled = v;
}

export function queueSync(key, value) {
  if (!syncEnabled) return;
  pending[key] = value;
  if (flushTimer) return;
  flushTimer = setTimeout(flush, 1000);
}

// Best-effort synchronous-ish flush for when the tab is closing or going to
// background — sendBeacon keeps working as the page is torn down, unlike
// fetch(), which browsers can and do cancel mid-flight on unload. Without
// this, a save made right before closing the tab could still be sitting in
// `pending` when the debounced flush() never gets to run, so the next time
// the app opens and pulls from the cloud, that change looks like it never
// happened.
export function flushNow() {
  if (!syncEnabled || Object.keys(pending).length === 0) return;
  if (flushTimer) { clearTimeout(flushTimer); flushTimer = null; }
  const batch = pending;
  pending = {};
  try {
    const blob = new Blob([JSON.stringify({ data: batch })], { type: "application/json" });
    const sent = navigator.sendBeacon && navigator.sendBeacon("/api/sync", blob);
    if (!sent) pending = { ...batch, ...pending };
  } catch {
    pending = { ...batch, ...pending };
  }
}

async function flush() {
  flushTimer = null;
  const batch = pending;
  pending = {};
  if (Object.keys(batch).length === 0) return;
  try {
    await fetch("/api/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ data: batch }),
    });
  } catch {
    // Offline or backend unavailable — put it back instead of silently
    // dropping it, so the next queued write (or the next flush) retries it.
    pending = { ...batch, ...pending };
    if (!flushTimer) flushTimer = setTimeout(flush, 4000);
  }
}

export async function pullSync() {
  try {
    const res = await fetch("/api/sync", { credentials: "include" });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function authStatus() {
  try {
    const res = await fetch("/api/auth/status", { credentials: "include" });
    if (!res.ok) return { configured: false, authenticated: false };
    return await res.json();
  } catch {
    return { configured: false, authenticated: false };
  }
}

export async function authLogin(pin) {
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ pin }),
    });
    if (res.ok) return { ok: true };
    const body = await res.json().catch(() => ({}));
    return { ok: false, error: body.error || "No se pudo conectar." };
  } catch {
    return { ok: false, error: "Sin conexión." };
  }
}

export async function authLogout() {
  try {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
  } catch {
    // Nothing to do — cookie will just expire on its own if this fails.
  }
}
