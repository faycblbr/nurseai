import { NextResponse } from "next/server";
import type { Route } from "next";
import { env } from "@/lib/env";
import { createSupabaseAdminClient } from "@/server/supabase/admin";
import { createSupabaseServerClient } from "@/server/supabase/server";
import { getStripeClient } from "@/server/stripe/client";

export const runtime = "nodejs";

function redirectToSettings(message: string, isError = false) {
  const key = isError ? "error" : "message";
  return NextResponse.redirect(
    `${env.NEXT_PUBLIC_APP_URL}/parametres?${key}=${encodeURIComponent(message)}`,
    { status: 303 }
  );
}

export async function POST() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(`${env.NEXT_PUBLIC_APP_URL}/connexion` as Route, { status: 303 });
  }

  const admin = createSupabaseAdminClient();
  const { data: subscription } = await admin
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!subscription?.stripe_customer_id) {
    return redirectToSettings("Active d'abord l'essai gratuit pour gérer l'abonnement.", true);
  }

  try {
    const portal = await getStripeClient().billingPortal.sessions.create({
      customer: subscription.stripe_customer_id,
      return_url: `${env.NEXT_PUBLIC_APP_URL}/parametres`
    });

    return NextResponse.redirect(portal.url, { status: 303 });
  } catch {
    return redirectToSettings("Le portail Stripe doit être activé dans ton tableau de bord Stripe.", true);
  }
}
