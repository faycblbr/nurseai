import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { env } from "@/lib/env";
import { createSupabaseAdminClient } from "@/server/supabase/admin";
import {
  stripeId,
  stripeSubscriptionPeriodEnd,
  syncStripeSubscription
} from "@/server/billing/subscription";
import { getStripeClient } from "@/server/stripe/client";

export const runtime = "nodejs";

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const subscriptionId = stripeId(session.subscription);
  const customerId = stripeId(session.customer);
  const userId = session.client_reference_id ?? session.metadata?.supabase_user_id ?? null;

  if (!userId || !customerId) {
    return;
  }

  if (!subscriptionId) {
    await createSupabaseAdminClient().from("subscriptions").upsert(
      {
        user_id: userId,
        stripe_customer_id: customerId,
        ai_monthly_quota: env.AI_MONTHLY_QUOTA,
        updated_at: new Date().toISOString()
      },
      { onConflict: "user_id" }
    );
    return;
  }

  const subscription = await getStripeClient().subscriptions.retrieve(subscriptionId);
  await syncStripeSubscription(subscription, userId);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const admin = createSupabaseAdminClient();
  const periodEnd = stripeSubscriptionPeriodEnd(subscription);

  await admin
    .from("subscriptions")
    .update({
      status: "canceled",
      current_period_end: periodEnd,
      updated_at: new Date().toISOString()
    })
    .eq("stripe_subscription_id", subscription.id);
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = stripeId(invoice.customer);

  if (!customerId) {
    return;
  }

  await createSupabaseAdminClient()
    .from("subscriptions")
    .update({
      status: "past_due",
      updated_at: new Date().toISOString()
    })
    .eq("stripe_customer_id", customerId);
}

export async function POST(request: Request) {
  if (!env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing Stripe webhook secret." }, { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });
  }

  const rawBody = await request.text();
  let event: Stripe.Event;

  try {
    event = getStripeClient().webhooks.constructEvent(rawBody, signature, env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return NextResponse.json({ error: "Invalid Stripe signature." }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
      break;
    case "customer.subscription.created":
    case "customer.subscription.updated":
      await syncStripeSubscription(event.data.object as Stripe.Subscription);
      break;
    case "customer.subscription.deleted":
      await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
      break;
    case "invoice.payment_failed":
      await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
      break;
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
