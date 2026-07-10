import {
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  Clock3,
  CreditCard,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  WandSparkles
} from "lucide-react";
import { redirect } from "next/navigation";
import { AppLogo } from "@/components/app/app-logo";
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
  "Démarches de soins guidées, structurées comme en IFSI",
  "Calculs de doses avec correction pas à pas",
  "Fiches de cours, quiz et préparation de stage",
  "Assistant IA pour t'aider à synthétiser sans faire à ta place",
  "Données isolées par compte, export RGPD et sécurité renforcée"
];

const proofPoints = [
  {
    title: "Tu gagnes du temps",
    text: "Moins de pages à trier, plus de priorités claires pour réviser.",
    icon: Clock3
  },
  {
    title: "Tu progresses vraiment",
    text: "L'app te guide sans donner 100% des réponses à recopier.",
    icon: BookOpenCheck
  },
  {
    title: "Tu prépares tes stages",
    text: "Cardio, médicaments, surveillances, signes d'alerte et objectifs.",
    icon: WandSparkles
  }
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
          <AppLogo size="md" />
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
                Essai Premium offert 30 jours
              </Badge>
              <Badge>Carte sécurisée par Stripe</Badge>
            </div>

            <h1 className="mt-6 max-w-3xl text-4xl font-black tracking-normal text-[var(--foreground)] sm:text-5xl lg:text-6xl">
              Transforme tes cours IFSI en fiches, quiz et plans de stage en quelques minutes.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--muted)] sm:text-lg">
              Démarre ton mois d&apos;essai pour tester NurseAI en conditions réelles: démarches de soins,
              calculs de doses, fiches, quiz et préparation de stage. Tu gardes le contrôle: 30 jours offerts,
              puis 4,99 €/mois seulement si tu continues.
            </p>

            <AuthFeedback error={params?.error} message={params?.message} />

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              {stripeReady ? (
                <a
                  href="/api/stripe/checkout"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-5 text-base font-semibold text-white shadow-lg shadow-[color:var(--ring)] transition hover:bg-[var(--primary-dark)]"
                >
                  <CreditCard className="h-4 w-4" aria-hidden />
                  Démarrer mon mois gratuit
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
                Voir l&apos;aperçu avant
              </a>
            </div>

            <div className="mt-5 flex flex-wrap gap-4 text-sm font-semibold text-[var(--muted)]">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[var(--success)]" aria-hidden />
                Carte gérée par Stripe
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--success)]" aria-hidden />
                Résiliation possible
              </span>
              <span className="inline-flex items-center gap-2">
                <LockKeyhole className="h-4 w-4 text-[var(--success)]" aria-hidden />
                Fonctionnalités verrouillées en aperçu
              </span>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {proofPoints.map((point) => {
                const Icon = point.icon;

                return (
                  <div key={point.title} className="rounded-lg border border-[var(--border)] bg-[var(--glass)] p-4">
                    <Icon className="h-5 w-5 text-[var(--primary)]" aria-hidden />
                    <p className="mt-3 text-sm font-black">{point.title}</p>
                    <p className="mt-1 text-xs leading-5 text-[var(--muted)]">{point.text}</p>
                  </div>
                );
              })}
            </div>
          </section>

          <Card className="p-5 shadow-2xl shadow-[color:var(--shadow-soft)] sm:p-6">
            <div className="mesh-surface rounded-lg border border-[var(--border)] p-4">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--muted)]">
                Ton accès d&apos;essai
              </p>
              <p className="mt-2 text-3xl font-black">30 jours pour tout tester</p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                L&apos;aperçu permet de visiter l&apos;app. Le mois gratuit débloque les actions, l&apos;IA et
                la sauvegarde pour travailler vraiment.
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
              Aujourd&apos;hui: <span className="font-bold text-[var(--foreground)]">0 € pendant 30 jours</span>. Ensuite:{" "}
              <span className="font-bold text-[var(--foreground)]">4,99 €/mois</span>. IA incluse:{" "}
              <span className="font-bold text-[var(--foreground)]">{env.AI_MONTHLY_QUOTA} générations/mois</span>.
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
