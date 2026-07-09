import type { PromptKey } from "@/features/ai/prompts";

type GenerateAIResponse = {
  markdown?: string;
  remaining?: number;
  error?: string;
};

export async function requestAIGeneration(promptKey: PromptKey, content: string) {
  const response = await fetch("/api/ai/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ promptKey, content })
  });

  const payload = (await response.json().catch(() => ({}))) as GenerateAIResponse;

  if (!response.ok || !payload.markdown) {
    throw new Error(payload.error ?? "IA indisponible pour le moment.");
  }

  return {
    markdown: payload.markdown,
    remaining: payload.remaining ?? null
  };
}
