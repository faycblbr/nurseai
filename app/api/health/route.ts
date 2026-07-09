import { NextResponse } from "next/server";
import { env } from "@/lib/env";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    app: "NurseAI",
    timestamp: new Date().toISOString(),
    checks: {
      supabaseUrl: Boolean(env.NEXT_PUBLIC_SUPABASE_URL),
      supabaseAnonKey: Boolean(env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
      openaiConfigured: Boolean(env.OPENAI_API_KEY),
      openaiModel: env.OPENAI_MODEL,
      stripeConfigured: Boolean(env.STRIPE_SECRET_KEY),
      stripePriceConfigured: Boolean(env.STRIPE_PRICE_ID),
      stripeWebhookConfigured: Boolean(env.STRIPE_WEBHOOK_SECRET),
      aiMonthlyQuota: env.AI_MONTHLY_QUOTA
    }
  });
}
