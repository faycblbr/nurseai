import { aiPrompts, type PromptKey } from "@/features/ai/prompts";
import { getOpenAIClient } from "@/server/ai/client";

type GenerateMarkdownInput = {
  promptKey: PromptKey;
  userContent: string;
};

export async function generateMarkdown({ promptKey, userContent }: GenerateMarkdownInput) {
  const client = getOpenAIClient();
  const prompt = aiPrompts[promptKey];

  const response = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    temperature: 0.3,
    messages: [
      { role: "system", content: `${prompt.system}\nVersion prompt: ${prompt.version}` },
      { role: "user", content: userContent }
    ]
  });

  return response.choices[0]?.message.content ?? "";
}
