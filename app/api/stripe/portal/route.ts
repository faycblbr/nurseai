import { NextResponse } from "next/server";
import { getRequestAppUrl } from "@/lib/app-url";
import { createSupabaseAdminClient } from "@/server/supabase/admin";
import { createSupabaseServerClient } from "@/server/supabase/server";
import { getStripeClient } from "@/server/stripe/client";

export const runtime = "nodejs";

function redirectToSettings(appUrl: string, message: string, isError = false) {
  const key = isError ? "error" : "message";
  return NextResponse.redirect(
    `${appUrl}/parametres?${key}=${encodeURIComponent(message)}`,
    { status: 303 }
  );
}

async function createPortal(request: Request) {
  const appUrl = getRequestAppUrl(request);

  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(`${appUrl}/connexion?next=/activation`, { status: 303 });
  }

  const admin = createSupabaseAdminClient();
  const { data: subscription } = await admin
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!subscription?.stripe_customer_id) {
    return NextResponse.redirect(
      `${appUrl}/activation?error=${encodeURIComponent("Active d'abord l'essai gratuit pour gérer l'abonnement.")}`,
      { status: 303 }
    );
  }

  try {
    const portal = await getStripeClient().billingPortal.sessions.create({
      customer: subscription.stripe_customer_id,
      return_url: `${appUrl}/parametres`
    });

    return NextResponse.redirect(portal.url, { status: 303 });
  } catch {
    return redirectToSettings(appUrl, "Le portail Stripe doit être activé dans ton tableau de bord Stripe.", true);
  }
}

export async function GET(request: Request) {
  return createPortal(request);
}

export async function POST(request: Request) {
  return createPortal(request);
}
