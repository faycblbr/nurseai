import type Stripe from "stripe";
import type { Database } from "@/lib/supabase/database.types";
import { env } from "@/lib/env";
import { createSupabaseAdminClient } from "@/server/supabase/admin";

type SubscriptionRow = Database["public"]["Tables"]["subscriptions"]["Row"];
type SubscriptionStatus = SubscriptionRow["status"];

type AiAccess =
  | { allowed: true; subscription: SubscriptionRow; remaining: number }
  | { allowed: false; status: number; message: string; subscription?: SubscriptionRow | null };

const ACTIVE_STATUSES = new Set<SubscriptionStatus>(["trialing", "active"]);

export function isBillingConfigured() {
  return Boolean(env.STRIPE_SECRET_KEY && env.STRIPE_PRICE_ID && env.STRIPE_WEBHOOK_SECRET);
}

export function stripeId(value: string | { id?: string } | null | undefined) {
  if (!value) {
    return null;
  }

  return typeof value === "string" ? value : value.id ?? null;
}

export function mapStripeStatus(status: Stripe.Subscription.Status): SubscriptionStatus {
  if (status === "trialing" || status === "active" || status === "past_due" || status === "canceled" || status === "unpaid") {
    return status;
  }

  if (status === "incomplete" || status === "paused") {
    return "past_due";
  }

  return "canceled";
}

function epochToIso(value: unknown) {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    return null;
  }

  return new Date(value * 1000).toISOString();
}

export function stripeSubscriptionPeriodEnd(subscription: Stripe.Subscription) {
  const rawSubscription = subscription as unknown as Record<string, unknown>;
  const firstItem = subscription.items.data[0] as unknown as Record<string, unknown> | undefined;

  return (
    epochToIso(rawSubscription.current_period_end) ??
    epochToIso(firstItem?.current_period_end) ??
    epochToIso(subscription.trial_end) ??
    epochToIso(subscription.cancel_at)
  );
}

async function findUserIdByCustomer(customerId: string) {
  const admin = createSupabaseAdminClient();
  const { data } = await admin
    .from("subscriptions")
    .select("user_id")
    .eq("stripe_customer_id", customerId)
    .maybeSingle();

  return data?.user_id ?? null;
}

export async function syncStripeSubscription(subscription: Stripe.Subscription, fallbackUserId?: string | null) {
  const customerId = stripeId(subscription.customer);
  const userId =
    subscription.metadata.supabase_user_id ??
    subscription.metadata.user_id ??
    fallbackUserId ??
    (customerId ? await findUserIdByCustomer(customerId) : null);

  if (!userId || !customerId) {
    return;
  }

  const admin = createSupabaseAdminClient();
  const periodEnd = stripeSubscriptionPeriodEnd(subscription);
  const { data: existing } = await admin
    .from("subscriptions")
    .select("current_period_end")
    .eq("user_id", userId)
    .maybeSingle();

  const payload: Database["public"]["Tables"]["subscriptions"]["Update"] & { user_id: string } = {
    user_id: userId,
    stripe_customer_id: customerId,
    stripe_subscription_id: subscription.id,
    status: mapStripeStatus(subscription.status),
    current_period_end: periodEnd,
    ai_monthly_quota: env.AI_MONTHLY_QUOTA,
    updated_at: new Date().toISOString()
  };

  if (periodEnd && existing?.current_period_end && existing.current_period_end !== periodEnd) {
    payload.ai_monthly_usage = 0;
  }

  await admin.from("subscriptions").upsert(payload, { onConflict: "user_id" });
}

export async function getAiAccess(userId: string): Promise<AiAccess> {
  if (!env.OPENAI_API_KEY) {
    return {
      allowed: false,
      status: 503,
      message: "L'IA n'est pas encore configurée. Ajoute OPENAI_API_KEY dans Vercel."
    };
  }

  if (process.env.NODE_ENV === "production" && !isBillingConfigured()) {
    return {
      allowed: false,
      status: 503,
      message: "Le paiement n'est pas complètement configuré. Ajoute Stripe dans Vercel avant d'activer l'IA."
    };
  }

  const admin = createSupabaseAdminClient();
  const { data: subscription, error } = await admin
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    return {
      allowed: false,
      status: 500,
      message: "Impossible de vérifier l'abonnement."
    };
  }

  if (!subscription?.stripe_subscription_id && isBillingConfigured()) {
    return {
      allowed: false,
      status: 402,
      message: "Active l'essai gratuit de 30 jours dans Paramètres pour utiliser l'IA.",
      subscription
    };
  }

  if (!subscription) {
    return {
      allowed: false,
      status: 402,
      message: "Aucun abonnement trouvé. Active l'essai gratuit dans Paramètres."
    };
  }

  if (!ACTIVE_STATUSES.has(subscription.status)) {
    return {
      allowed: false,
      status: 402,
      message: "Ton abonnement n'est pas actif. Va dans Paramètres pour le gérer.",
      subscription
    };
  }

  const remaining = Math.max(subscription.ai_monthly_quota - subscription.ai_monthly_usage, 0);

  if (remaining <= 0) {
    return {
      allowed: false,
      status: 429,
      message: "Quota IA mensuel atteint. Le quota se renouvelle à la prochaine période.",
      subscription
    };
  }

  return {
    allowed: true,
    subscription,
    remaining
  };
}

export async function incrementAiUsage(userId: string) {
  const admin = createSupabaseAdminClient();
  const { data: subscription, error } = await admin
    .from("subscriptions")
    .select("ai_monthly_usage")
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !subscription) {
    throw new Error("Unable to update AI usage.");
  }

  const nextUsage = subscription.ai_monthly_usage + 1;
  await admin
    .from("subscriptions")
    .update({
      ai_monthly_usage: nextUsage,
      updated_at: new Date().toISOString()
    })
    .eq("user_id", userId);

  return nextUsage;
}
