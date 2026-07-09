import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";
import { getRequestAppUrl } from "@/lib/app-url";
import { createSupabaseServerClient } from "@/server/supabase/server";
import { getStripeClient } from "@/server/stripe/client";
import { stripeId, syncStripeSubscription } from "@/server/billing/subscription";

export const runtime = "nodejs";

function redirectToActivation(appUrl: string, message: string, isError = false) {
  const key = isError ? "error" : "message";
  return NextResponse.redirect(
    `${appUrl}/activation?${key}=${encodeURIComponent(message)}`,
    { status: 303 }
  );
}

export async function GET(request: NextRequest) {
  const appUrl = getRequestAppUrl(request);
  const sessionId = request.nextUrl.searchParams.get("session_id");

  if (!sessionId) {
    return redirectToActivation(appUrl, "Session Stripe introuvable.", true);
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(`${appUrl}/connexion?next=/activation`, { status: 303 });
  }

  try {
    const stripe = getStripeClient();
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const sessionUserId = session.client_reference_id ?? session.metadata?.supabase_user_id ?? null;

    if (sessionUserId !== user.id) {
      return redirectToActivation(appUrl, "Cette session Stripe ne correspond pas à ton compte.", true);
    }

    const subscriptionId = stripeId(session.subscription as Stripe.Checkout.Session["subscription"]);

    if (!subscriptionId) {
      return redirectToActivation(appUrl, "Stripe n'a pas encore créé l'abonnement. Réessaie dans quelques secondes.", true);
    }

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    await syncStripeSubscription(subscription, user.id);

    return NextResponse.redirect(
      `${appUrl}/dashboard?message=${encodeURIComponent("Essai gratuit activé.")}`,
      { status: 303 }
    );
  } catch {
    return redirectToActivation(appUrl, "Impossible de confirmer l'activation Stripe.", true);
  }
}
