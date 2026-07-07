// @ts-nocheck
import { isConfigured, isAuthenticated } from "./_auth.js";
import { sql, ensureSchema } from "./_db.js";

function unauthorized() {
  return Response.json({ error: "No autenticado." }, { status: 401 });
}

export async function GET(request) {
  if (!isConfigured() || !isAuthenticated(request)) return unauthorized();
  await ensureSchema();
  const rows = await sql`SELECT key, value, updated_at FROM voltra_data`;
  const data = {};
  const updatedAt = {};
  for (const row of rows) { data[row.key] = row.value; updatedAt[row.key] = row.updated_at; }
  return Response.json({ data, updatedAt });
}

export async function POST(request) {
  if (!isConfigured() || !isAuthenticated(request)) return unauthorized();
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Body inválido." }, { status: 400 });
  }
  const data = body?.data;
  if (!data || typeof data !== "object") {
    return Response.json({ error: "Falta 'data'." }, { status: 400 });
  }
  await ensureSchema();
  const entries = Object.entries(data);
  for (const [key, value] of entries) {
    await sql`
      INSERT INTO voltra_data (key, value, updated_at)
      VALUES (${key}, ${JSON.stringify(value)}, now())
      ON CONFLICT (key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
    `;
  }
  return Response.json({ ok: true, synced: entries.length });
}
