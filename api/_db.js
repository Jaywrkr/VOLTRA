// @ts-nocheck
// Shared Postgres access for the API routes. Uses Neon's HTTP driver instead
// of a pooled TCP connection since each request may hit a fresh serverless
// instance — no pool to exhaust or warm up.
import { neon } from "@neondatabase/serverless";

let sqlClient = null;
let schemaReady = null;

export function sql(strings, ...values) {
  if (!sqlClient) {
    if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
    sqlClient = neon(process.env.DATABASE_URL);
  }
  return sqlClient(strings, ...values);
}

export async function ensureSchema() {
  if (!schemaReady) {
    schemaReady = sql`
      CREATE TABLE IF NOT EXISTS voltra_data (
        key TEXT PRIMARY KEY,
        value JSONB NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `;
  }
  await schemaReady;
}
