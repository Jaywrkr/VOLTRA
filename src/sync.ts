// @ts-nocheck
// Cloud sync client. Talks to /api/* (only present once the Vercel project
// has a Postgres DB + AUTH_PIN/AUTH_SECRET configured). Every call degrades
// silently to "cloud unavailable" on network failure or a missing backend —
// localStorage stays the source of truth locally either way.
let syncEnabled = false;
let pending = {};
let flushTimer = null;
// Exposed via getSyncMeta() so the UI can show "you're actually saved" —
// lastSyncedAt is the last time a push to the server is known to have
// succeeded (or, for flushNow's sendBeacon, was at least handed off).
let lastSyncedAt = null;
let lastError = null;

export function setSyncEnabled(v) {
  syncEnabled = v;
  if (!v) { pending = {}; lastSyncedAt = null; lastError = null; if (flushTimer) { clearTimeout(flushTimer); flushTimer = null; } }
}

export function getSyncMeta() {
  return { pendingCount: Object.keys(pending).length, lastSyncedAt, lastError };
}

export function queueSync(key, value) {
  if (!syncEnabled) return;
  pending[key] = value;
  if (flushTimer) return;
  flushTimer = setTimeout(flush, 1000);
}

async function push(batch) {
  const res = await fetch("/api/sync", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ data: batch }),
  });
  if (!res.ok) throw new Error(`sync failed: ${res.status}`);
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
    if (sent) lastSyncedAt = Date.now();
    else pending = { ...batch, ...pending };
  } catch {
    pending = { ...batch, ...pending };
  }
}

// Manual "guardar ahora" — cancels the debounce and pushes immediately,
// awaited so a button in the UI can show real success/failure instead of
// firing blind like flushNow (which can't know if sendBeacon landed).
export async function forceSync() {
  if (!syncEnabled) return { ok: false, error: "Sincronización no conectada." };
  if (flushTimer) { clearTimeout(flushTimer); flushTimer = null; }
  const batch = pending;
  pending = {};
  if (Object.keys(batch).length === 0) {
    if (lastSyncedAt == null) lastSyncedAt = Date.now();
    return { ok: true, noop: true };
  }
  try {
    await push(batch);
    lastSyncedAt = Date.now();
    lastError = null;
    return { ok: true };
  } catch {
    pending = { ...batch, ...pending };
    lastError = "No se pudo guardar.";
    return { ok: false, error: "No se pudo guardar — revisa tu conexión." };
  }
}

async function flush() {
  flushTimer = null;
  const batch = pending;
  pending = {};
  if (Object.keys(batch).length === 0) return;
  try {
    await push(batch);
    lastSyncedAt = Date.now();
    lastError = null;
  } catch {
    // Offline or backend unavailable — put it back instead of silently
    // dropping it, so the next queued write (or the next flush) retries it.
    pending = { ...batch, ...pending };
    lastError = "No se pudo guardar — reintentando.";
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
