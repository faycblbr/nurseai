import { NextResponse } from "next/server";
import { z } from "zod";
import { generateMarkdown } from "@/server/ai/generate";
import { createSupabaseServerClient } from "@/server/supabase/server";
import { getAiAccess, incrementAiUsage } from "@/server/billing/subscription";

export const runtime = "nodejs";

const requestSchema = z.object({
  promptKey: z.enum(["care-plan", "targeted-transmission", "revision-card"]),
  content: z.string().trim().min(20).max(12000)
});

const sensitivePatterns = [
  /\b\d{13}\b/u,
  /\b[\w.%+-]+@[\w.-]+\.[a-z]{2,}\b/iu,
  /\b(?:0|\+33\s?)[1-9](?:[\s.-]?\d{2}){4}\b/u
];

function containsObviousPersonalData(content: string) {
  return sensitivePatterns.some((pattern) => pattern.test(content));
}

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Connecte-toi pour utiliser l'IA." }, { status: 401 });
  }

  const payload = requestSchema.safeParse(await request.json().catch(() => null));

  if (!payload.success) {
    return NextResponse.json(
      { error: "Ajoute un contenu plus précis, sans dépasser la limite de texte." },
      { status: 400 }
    );
  }

  if (containsObviousPersonalData(payload.data.content)) {
    return NextResponse.json(
      {
        error:
          "Retire les données identifiantes avant d'envoyer à l'IA: email, téléphone, numéro patient ou numéro de sécurité sociale."
      },
      { status: 400 }
    );
  }

  const access = await getAiAccess(user.id);

  if (!access.allowed) {
    return NextResponse.json({ error: access.message }, { status: access.status });
  }

  try {
    const markdown = await generateMarkdown({
      promptKey: payload.data.promptKey,
      userContent: payload.data.content
    });

    const usage = await incrementAiUsage(user.id);

    return NextResponse.json({
      markdown,
      remaining: Math.max(access.subscription.ai_monthly_quota - usage, 0)
    });
  } catch {
    return NextResponse.json(
      { error: "L'IA n'a pas répondu correctement. Réessaie dans quelques instants." },
      { status: 502 }
    );
  }
}
