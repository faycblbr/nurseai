import { z } from "zod";
import { env } from "@/lib/env";
import { getOpenAIClient } from "@/server/ai/client";
import { safeQuizQuestionBank, selectFallbackQuiz, type SafeQuizQuestion } from "@/server/quiz/question-bank";

export type NativeQuizQuestion = {
  id: string;
  semester: string;
  title: string;
  answers: string[];
  correctIndex: number;
  explanation: string;
  reference: string;
};

export type NativeQuizPayload = {
  source: "openai-selected-curated-bank" | "local-curated-bank";
  sourceLabel: string;
  disclaimer: string;
  tariffLabel: "4,99 € / mois";
  questions: NativeQuizQuestion[];
};

const selectionSchema = z.object({
  selectedIds: z.array(z.string()).min(1).max(8)
});

function toNativeQuestion(question: SafeQuizQuestion): NativeQuizQuestion {
  return {
    id: question.id,
    semester: question.semester,
    title: question.prompt,
    answers: question.choices,
    correctIndex: question.answer,
    explanation: question.explanation,
    reference: question.reference
  };
}

function buildPayload(
  source: NativeQuizPayload["source"],
  questions: SafeQuizQuestion[],
  sourceLabel: string
): NativeQuizPayload {
  return {
    source,
    sourceLabel,
    disclaimer:
      "Quiz pédagogique IFSI. Les questions viennent d'une banque vérifiée NurseAI; aucune donnée patient ne doit être saisie.",
    tariffLabel: "4,99 € / mois",
    questions: questions.map(toNativeQuestion)
  };
}

function extractJson(text: string) {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/iu);
  return fenced?.[1] ?? trimmed;
}

function fallbackQuiz(focus: string, count: number) {
  return buildPayload("local-curated-bank", selectFallbackQuiz(focus, count), "Banque IFSI sécurisée");
}

export async function generateNativeQuiz({ focus, count }: { focus: string; count: number }) {
  const safeCount = Math.min(Math.max(count, 4), 8);
  const cleanFocus = focus.trim() || "révision IFSI générale";

  if (!env.OPENAI_API_KEY) {
    return fallbackQuiz(cleanFocus, safeCount);
  }

  try {
    const client = getOpenAIClient();
    const bankSummary = safeQuizQuestionBank
      .map(
        (question) =>
          `- ${question.id} | ${question.semester} | ${question.theme} | tags: ${question.tags.join(", ")}`
      )
      .join("\n");

    const response = await client.responses.create({
      model: env.OPENAI_MODEL,
      temperature: 0.1,
      instructions: `Tu es un routeur de quiz pour NurseAI.
Tu ne dois JAMAIS créer de question, de réponse, de correction ou de fait médical.
Tu sélectionnes uniquement des identifiants existants dans la banque fournie.
Retourne uniquement du JSON valide au format: {"selectedIds":["id-1","id-2"]}.
Objectif: choisir un parcours pertinent, varié, et pédagogique pour un étudiant IFSI en France.`,
      input: `Focus demandé: ${cleanFocus}
Nombre de questions: ${safeCount}

Banque autorisée:
${bankSummary}`
    });

    const parsed = selectionSchema.safeParse(JSON.parse(extractJson(response.output_text ?? "")));

    if (!parsed.success) {
      return fallbackQuiz(cleanFocus, safeCount);
    }

    const selected = parsed.data.selectedIds
      .map((id) => safeQuizQuestionBank.find((question) => question.id === id))
      .filter((question): question is SafeQuizQuestion => Boolean(question));

    const uniqueSelected = Array.from(new Map(selected.map((question) => [question.id, question])).values()).slice(
      0,
      safeCount
    );

    if (uniqueSelected.length < Math.min(4, safeCount)) {
      return fallbackQuiz(cleanFocus, safeCount);
    }

    return buildPayload("openai-selected-curated-bank", uniqueSelected, "IA + banque vérifiée");
  } catch {
    return fallbackQuiz(cleanFocus, safeCount);
  }
}
