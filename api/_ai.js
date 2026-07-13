// @ts-nocheck
// Shared helper for the Claude-backed routes (macros, exercise-lookup).
// Haiku mostly obeys "respond with only JSON", but will sometimes wrap it
// in a ```json fence or add a stray sentence before/after — pulling out
// the first {...} block is more robust than a strict JSON.parse on the
// raw text.
export function extractJson(raw) {
  const text = String(raw || "").trim();
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end < start) throw new Error("No JSON object found in response");
  return JSON.parse(text.slice(start, end + 1));
}
