import { aiPrompts, type PromptKey } from "@/features/ai/prompts";
import { getOpenAIClient } from "@/server/ai/client";

type GenerateMarkdownInput = {
  promptKey: PromptKey;
  userContent: string;
};

export async function generateMarkdown({ promptKey, userContent }: GenerateMarkdownInput) {
  const client = getOpenAIClient();
  const prompt = aiPrompts[promptKey];

  const response = await client.responses.create({
    model: process.env.OPENAI_MODEL ?? "gpt-4.1-mini",
    temperature: 0.3,
    instructions: `${prompt.system}

Règles NurseAI:
- Réponds en français.
- Reste pédagogique: guide l'étudiant sans remplacer son raisonnement.
- Ne pose jamais de diagnostic médical certain.
- Si des données patient identifiantes apparaissent, rappelle de les anonymiser.
- Structure la réponse en Markdown clair.

Version prompt: ${prompt.version}`,
    input: userContent
  });

  return response.output_text ?? "";
}
