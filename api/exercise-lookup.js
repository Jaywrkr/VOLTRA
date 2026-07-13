// @ts-nocheck
// Exercise name -> category + description lookup, so adding a custom
// exercise can start from "just say the name" instead of filling every
// field by hand. Gated behind the same session cookie as /api/sync.
import Anthropic from "@anthropic-ai/sdk";
import { isConfigured, isAuthenticated } from "./_auth.js";
import { extractJson } from "./_ai.js";

const CATEGORIES = ["Piernas", "Espalda", "Bíceps", "Hombros", "Tríceps", "Pecho", "Core", "Cardio"];

const SYSTEM_PROMPT = `Eres un entrenador de kettlebell/hipertrofia que identifica un ejercicio a partir de su nombre (que puede venir de dictado por voz, con errores de transcripción, o estar en spanglish/jerga de gimnasio).
Responde ÚNICAMENTE con un objeto JSON, sin texto adicional, con esta forma exacta:
{"name": string, "category": string, "description": string}
"name" es el nombre del ejercicio ya limpio/corregido. "category" DEBE ser exactamente una de estas opciones: ${CATEGORIES.join(", ")} (el grupo muscular principal que trabaja). "description" es 1-2 frases explicando cómo se hace y en qué enfocarse, en español, tono directo. Si el nombre no corresponde a ningún ejercicio reconocible, responde {"error": "no reconozco ese ejercicio"}.`;

function unauthorized() {
  return Response.json({ error: "No autenticado." }, { status: 401 });
}

export async function POST(request) {
  if (!isConfigured() || !isAuthenticated(request)) return unauthorized();
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: "Identificación de ejercicios no está configurada en este deployment." }, { status: 501 });
  }
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Body inválido." }, { status: 400 });
  }
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  if (!name) return Response.json({ error: "Falta el nombre del ejercicio." }, { status: 400 });

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  let message;
  try {
    message = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 300,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: [{ type: "text", text: `Identifica este ejercicio: "${name}"` }] }],
    });
  } catch (err) {
    return Response.json({ error: "No se pudo contactar al servicio de identificación." }, { status: 502 });
  }

  const raw = message.content.find((b) => b.type === "text")?.text || "";
  let parsed;
  try {
    parsed = extractJson(raw);
  } catch {
    return Response.json({ error: "Respuesta inesperada del modelo." }, { status: 502 });
  }
  if (parsed.error) return Response.json({ error: parsed.error }, { status: 422 });

  return Response.json({
    name: String(parsed.name || name).slice(0, 80),
    category: CATEGORIES.includes(parsed.category) ? parsed.category : CATEGORIES[0],
    description: String(parsed.description || "").slice(0, 400),
  });
}
