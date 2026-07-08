import OpenAI from "openai";
import { env } from "@/lib/env";

let openai: OpenAI | null = null;

export function getOpenAIClient() {
  if (!env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is missing.");
  }

  openai ??= new OpenAI({
    apiKey: env.OPENAI_API_KEY
  });

  return openai;
}
