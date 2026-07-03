// @ts-nocheck
import { isConfigured, isAuthenticated } from "../_auth.js";

export async function GET(request) {
  const configured = isConfigured();
  const authenticated = configured && isAuthenticated(request);
  return Response.json({ configured, authenticated });
}
