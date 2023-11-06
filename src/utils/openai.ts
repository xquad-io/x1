import type { RequestEventBase } from "@builder.io/qwik-city";
import { OpenAI } from "openai";

let cached: OpenAI | null = null;
export function createOpenAI(req: RequestEventBase) {
  if (cached) {
    return cached;
  }
  cached = new OpenAI({ apiKey: req.env.get("OPENAI_API_KEY") });
  return cached;
}
