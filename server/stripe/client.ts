import Stripe from "stripe";
import { env } from "@/lib/env";

let stripe: Stripe | null = null;

export function getStripeClient() {
  if (!env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is missing.");
  }

  stripe ??= new Stripe(env.STRIPE_SECRET_KEY, {
    appInfo: {
      name: "NurseAI",
      version: "0.1.0"
    }
  });

  return stripe;
}
