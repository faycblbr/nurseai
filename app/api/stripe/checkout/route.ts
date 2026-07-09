import { NextResponse } from "next/server";
import type { Route } from "next";
import { env } from "@/lib/env";
import { createSupabaseAdminClient } from "@/server/supabase/admin";
import { createSupabaseServerClient } from "@/server/supabase/server";
import { getStripeClient } from "@/server/stripe/client";
import { isBillingConfigured } from "@/server/billing/subscription";

export const runtime = "nodejs";

function redirectToActivation(message: string, isError = false) {
  const key = isError ? "error" : "message";
  return NextResponse.redirect(
    `${env.NEXT_PUBLIC_APP_URL}/activation?${key}=${encodeURIComponent(message)}`,
    { status: 303 }
  );
}

async function createCheckout() {
  if (!isBillingConfigured()) {
    return redirectToActivation("Stripe n'est pas complètement configuré dans Vercel.", true);
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(`${env.NEXT_PUBLIC_APP_URL}/connexion?next=/activation` as Route, { status: 303 });
  }

  const admin = createSupabaseAdminClient();
  const stripe = getStripeClient();

  const { data: existingSubscription } = await admin
    .from("subscriptions")
    .select("stripe_customer_id, stripe_subscription_id, status")
    .eq("user_id", user.id)
    .maybeSingle();

  if (
    existingSubscription?.stripe_customer_id &&
    existingSubscription.stripe_subscription_id &&
    (existingSubscription.status === "trialing" || existingSubscription.status === "active")
  ) {
    return NextResponse.redirect(`${env.NEXT_PUBLIC_APP_URL}/dashboard?message=${encodeURIComponent("Ton accès Premium est déjà actif.")}`, { status: 303 });
  }

  const { data: profile } = await admin
    .from("profiles")
    .select("first_name, last_name")
    .eq("id", user.id)
    .maybeSingle();

  const name = [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") || undefined;
  let customerId = existingSubscription?.stripe_customer_id ?? null;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email ?? undefined,
      name,
      metadata: {
        supabase_user_id: user.id
      }
    });
    customerId = customer.id;

    await admin.from("subscriptions").upsert(
      {
        user_id: user.id,
        stripe_customer_id: customerId,
        status: "canceled",
        ai_monthly_quota: env.AI_MONTHLY_QUOTA,
        updated_at: new Date().toISOString()
      },
      { onConflict: "user_id" }
    );
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    client_reference_id: user.id,
    metadata: {
      supabase_user_id: user.id
    },
    line_items: [
      {
        price: env.STRIPE_PRICE_ID,
        quantity: 1
      }
    ],
    subscription_data: {
      trial_period_days: 30,
      metadata: {
        supabase_user_id: user.id
      }
    },
    allow_promotion_codes: true,
    billing_address_collection: "auto",
    payment_method_collection: "always",
    customer_update: {
      address: "auto",
      name: "auto"
    },
    custom_text: {
      submit: {
        message: "Essai gratuit 30 jours, puis 7 €/mois. Annulation possible depuis ton espace abonnement."
      }
    },
    locale: "fr",
    success_url: `${env.NEXT_PUBLIC_APP_URL}/api/stripe/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${env.NEXT_PUBLIC_APP_URL}/activation?error=${encodeURIComponent("Activation annulée.")}`
  });

  if (!session.url) {
    return redirectToActivation("Impossible d'ouvrir Stripe Checkout.", true);
  }

  return NextResponse.redirect(session.url, { status: 303 });
}

export async function GET() {
  return createCheckout();
}

export async function POST() {
  return createCheckout();
}
