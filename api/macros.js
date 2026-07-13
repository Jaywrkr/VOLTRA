// @ts-nocheck
// Photo -> macros estimation. Gated behind the same session cookie as
// /api/sync so a stray/shared link can't rack up API usage — this is a
// personal app, not a public tool.
import Anthropic from "@anthropic-ai/sdk";
import { isConfigured, isAuthenticated } from "./_auth.js";

const SYSTEM_PROMPT = `Eres un nutriólogo que estima macros de una foto de comida.
Responde ÚNICAMENTE con un objeto JSON, sin texto adicional, con esta forma exacta:
{"name": string, "kcal": number, "protein": number, "carbs": number, "fat": number}
Todos los valores numéricos son para la porción completa mostrada en la foto, en gramos (excepto kcal). Si no puedes identificar comida en la imagen, responde {"error": "no se reconoce comida en la foto"}.`;

function unauthorized() {
  return Response.json({ error: "No autenticado." }, { status: 401 });
}

export async function POST(request) {
  if (!isConfigured() || !isAuthenticated(request)) return unauthorized();
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: "Estimación por foto no está configurada en este deployment." }, { status: 501 });
  }
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Body inválido." }, { status: 400 });
  }
  const image = body?.image; // data URL: "data:image/jpeg;base64,...."
  const match = typeof image === "string" && image.match(/^data:(image\/\w+);base64,(.+)$/);
  if (!match) return Response.json({ error: "Falta imagen válida." }, { status: 400 });
  const [, mediaType, base64Data] = match;

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  let message;
  try {
    message = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 300,
      system: SYSTEM_PROMPT,
      messages: [{
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: mediaType, data: base64Data } },
          { type: "text", text: "Estima los macros de esta comida." },
        ],
      }],
    });
  } catch (err) {
    return Response.json({ error: "No se pudo contactar al servicio de estimación." }, { status: 502 });
  }

  const text = message.content.find((b) => b.type === "text")?.text || "";
  let parsed;
  try {
    parsed = JSON.parse(text.trim());
  } catch {
    return Response.json({ error: "Respuesta inesperada del modelo." }, { status: 502 });
  }
  if (parsed.error) return Response.json({ error: parsed.error }, { status: 422 });

  return Response.json({
    name: String(parsed.name || "").slice(0, 80),
    kcal: Math.max(0, Number(parsed.kcal) || 0),
    protein: Math.max(0, Number(parsed.protein) || 0),
    carbs: Math.max(0, Number(parsed.carbs) || 0),
    fat: Math.max(0, Number(parsed.fat) || 0),
  });
}
