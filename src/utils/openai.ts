import type { RequestEventBase } from "@builder.io/qwik-city";
import 'openai/shims/web'
import { OpenAI, } from "openai";
// import fetchAdapter from "@vespaiach/axios-fetch-adapter";

let cached: OpenAI | null = null;
export function createOpenAI(req: RequestEventBase) {
  if (cached) {
    return cached;
  }
  // const configuration = new Configuration({
  //   apiKey: env.OPENAI_API_KEY,
  //   baseOptions: {
  //     adapter: fetchAdapter
  //   }
  // });

  console.log(req.env.get("OPENAI_API_KEY"))
  cached = new OpenAI({ apiKey: req.env.get("OPENAI_API_KEY") });
  return cached;
}
