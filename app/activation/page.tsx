import { ArrowRight, CheckCircle2, CreditCard, ShieldCheck, Sparkles } from "lucide-react";
import { redirect } from "next/navigation";
import { AuthFeedback } from "@/components/auth/auth-feedback";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { env } from "@/lib/env";
import { getBillingAccess, isBillingConfigured } from "@/server/billing/subscription";
import { createSupabaseServerClient } from "@/server/supabase/server";
import { signOutAction } from "@/features/auth/actions";

type ActivationPageProps = {
  searchParams?: Promise<{
    error?: string;
    message?: string;
  }>;
};

const premiumFeatures = [
  "Démarches de soins guidées",
  "Calculs de doses interactifs",
  "Fiches, quiz et préparation de stage",
  "IA OpenAI sécurisée côté serveur",
  "Export RGPD et données isolées par compte"
];

export default async function ActivationPage({ searchParams }: ActivationPageProps) {
  const params = await searchParams;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/connexion?next=/activation");
  }

  const billing = await getBillingAccess(user.id);

  if (billing.allowed) {
    redirect("/dashboard");
  }

  const stripeReady = isBillingConfigured();

  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-6xl flex-col justify-center">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-lg bg-[var(--foreground)] text-xl font-black text-[var(--background)]">
              N
            </div>
            <div>
              <p className="text-lg font-black">NurseAI</p>
              <p className="text-sm text-[var(--muted)]">Assistant IFSI premium</p>
            </div>
          </div>
          <form action={signOutAction}>
            <button className="rounded-lg border border-[var(--border)] bg-[var(--glass)] px-4 py-2 text-sm font-semibold">
              Sortir
            </button>
          </form>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <section>
            <div className="flex flex-wrap gap-2">
              <Badge>
                <Sparkles className="mr-1 h-3 w-3" aria-hidden />
                30 jours gratuits
              </Badge>
              <Badge>Puis 7 €/mois</Badge>
            </div>

            <h1 className="mt-6 max-w-3xl text-4xl font-black tracking-normal text-[var(--foreground)] sm:text-5xl lg:text-6xl">
              Active ton essai pour lancer NurseAI.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--muted)] sm:text-lg">
              L&apos;application se débloque après activation Stripe avec carte bancaire. Tu profites de toutes les fonctionnalités pendant 1 mois, puis l&apos;abonnement passe à 7 €/mois.
            </p>

            <AuthFeedback error={params?.error} message={params?.message} />

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              {stripeReady ? (
                <a
                  href="/api/stripe/checkout"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-5 text-base font-semibold text-white shadow-lg shadow-[color:var(--ring)] transition hover:bg-[var(--primary-dark)]"
                >
                  <CreditCard className="h-4 w-4" aria-hidden />
                  Activer l&apos;essai 30 jours
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </a>
              ) : (
                <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
                  Stripe n&apos;est pas complet dans Vercel. Vérifie STRIPE_SECRET_KEY, STRIPE_PRICE_ID et STRIPE_WEBHOOK_SECRET.
                </div>
              )}
              <a
                href="/dashboard?preview=1"
                className="inline-flex h-12 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--glass)] px-5 text-base font-semibold text-[var(--foreground)] shadow-sm transition hover:bg-[var(--surface)]"
              >
                Voir l&apos;aperçu
              </a>
            </div>

            <div className="mt-5 flex flex-wrap gap-4 text-sm font-semibold text-[var(--muted)]">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[var(--success)]" aria-hidden />
                Carte gérée par Stripe
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--success)]" aria-hidden />
                Annulation possible
              </span>
            </div>
          </section>

          <Card className="p-5 shadow-2xl shadow-[color:var(--shadow-soft)] sm:p-6">
            <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--muted)]">
                Accès Premium
              </p>
              <p className="mt-2 text-3xl font-black">1 mois complet</p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                Aucun accès aux fonctionnalités tant que l&apos;essai n&apos;est pas activé. C&apos;est volontaire pour protéger ton modèle économique.
              </p>
            </div>

            <div className="mt-5 space-y-3">
              {premiumFeatures.map((feature) => (
                <div key={feature} className="flex items-start gap-3 rounded-lg bg-[var(--glass)] px-3 py-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--success)]" aria-hidden />
                  <span className="text-sm font-semibold">{feature}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-lg bg-[var(--background)] p-4 text-sm leading-6 text-[var(--muted)]">
              Prix configuré: <span className="font-bold text-[var(--foreground)]">7 €/mois</span>. Quota IA:{" "}
              <span className="font-bold text-[var(--foreground)]">{env.AI_MONTHLY_QUOTA} générations/mois</span>.
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
