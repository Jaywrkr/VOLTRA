// @ts-nocheck
import { isConfigured, pinMatches, makeSessionCookie } from "../_auth.js";

export async function POST(request) {
  if (!isConfigured()) {
    return Response.json({ error: "Sync no está configurado en este deployment." }, { status: 501 });
  }
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Body inválido." }, { status: 400 });
  }
  if (!pinMatches(body?.pin)) {
    return Response.json({ error: "PIN incorrecto." }, { status: 401 });
  }
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json", "Set-Cookie": makeSessionCookie() },
  });
}
