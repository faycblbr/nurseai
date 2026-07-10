import { NextResponse } from "next/server";
import { z } from "zod";
import { generateNativeQuiz } from "@/server/ai/generate-quiz";

export const runtime = "nodejs";

const requestSchema = z.object({
  focus: z.string().trim().max(80).default("revision IFSI generale"),
  count: z.coerce.number().int().min(4).max(8).default(6)
});

const sensitivePatterns = [
  /\b\d{13}\b/u,
  /\b[\w.%+-]+@[\w.-]+\.[a-z]{2,}\b/iu,
  /\b(?:0|\+33\s?)[1-9](?:[\s.-]?\d{2}){4}\b/u
];

const rateBuckets = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 24;

function containsObviousPersonalData(content: string) {
  return sensitivePatterns.some((pattern) => pattern.test(content));
}

function clientKey(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "anonymous"
  );
}

function isRateLimited(key: string) {
  const now = Date.now();
  const bucket = rateBuckets.get(key);

  if (!bucket || bucket.resetAt < now) {
    rateBuckets.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  bucket.count += 1;
  return bucket.count > RATE_LIMIT_MAX;
}

async function buildResponse(request: Request, rawPayload: unknown) {
  const key = clientKey(request);

  if (isRateLimited(key)) {
    return NextResponse.json(
      { error: "Trop de quiz generes en peu de temps. Reessaie dans une minute." },
      { status: 429 }
    );
  }

  const payload = requestSchema.safeParse(rawPayload);

  if (!payload.success) {
    return NextResponse.json({ error: "Choisis un theme de quiz plus court." }, { status: 400 });
  }

  if (containsObviousPersonalData(payload.data.focus)) {
    return NextResponse.json(
      { error: "Retire toute donnee personnelle ou patient avant d'utiliser le quiz IA." },
      { status: 400 }
    );
  }

  const quiz = await generateNativeQuiz(payload.data);
  return NextResponse.json(quiz, {
    headers: {
      "Cache-Control": "no-store"
    }
  });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  return buildResponse(request, {
    focus: url.searchParams.get("focus") ?? "revision IFSI generale",
    count: Number(url.searchParams.get("count") ?? 6)
  });
}

export async function POST(request: Request) {
  return buildResponse(request, await request.json().catch(() => null));
}
