import { CreditCard, Download, ShieldCheck, Sparkles, Trash2 } from "lucide-react";
import Link from "next/link";
import { AuthFeedback } from "@/components/auth/auth-feedback";
import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Json } from "@/lib/supabase/database.types";
import { env } from "@/lib/env";
import { createSupabaseServerClient } from "@/server/supabase/server";
import {
  requestAccountDeletionAction,
  updatePreferencesAction,
  updateProfileAction
} from "@/features/settings/actions";

type SettingsPageProps = {
  searchParams?: Promise<{
    error?: string;
    message?: string;
  }>;
};

type SettingsProfile = {
  first_name: string | null;
  last_name: string | null;
  cohort: string | null;
  study_year: "1" | "2" | "3" | null;
  ifsi: string | null;
};

type UserSettings = {
  email_notifications: boolean;
  push_notifications: boolean;
  privacy: Json;
};

type UserSubscription = {
  status: "trialing" | "active" | "past_due" | "canceled" | "unpaid";
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  ai_monthly_quota: number;
  ai_monthly_usage: number;
  current_period_end: string | null;
};

function privacyValue(privacy: Json | undefined, key: string, fallback = false) {
  if (!privacy || typeof privacy !== "object" || Array.isArray(privacy)) {
    return fallback;
  }

  return Boolean(privacy[key]);
}

function SwitchRow({
  name,
  title,
  description,
  defaultChecked
}: {
  name: string;
  title: string;
  description: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-start justify-between gap-4 rounded-lg border border-[var(--border)] bg-[var(--glass)] p-4">
      <span>
        <span className="block text-sm font-black">{title}</span>
        <span className="mt-1 block text-sm leading-6 text-[var(--muted)]">{description}</span>
      </span>
      <input
        name={name}
        type="checkbox"
        defaultChecked={defaultChecked}
        className="mt-1 h-5 w-5 rounded border-[var(--border)] accent-[var(--primary)]"
      />
    </label>
  );
}

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const params = await searchParams;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  let profile: SettingsProfile | null = null;
  let settings: UserSettings | null = null;
  let subscription: UserSubscription | null = null;

  if (user) {
    const profileResult = await supabase
      .from("profiles")
      .select("first_name, last_name, cohort, study_year, ifsi")
      .eq("id", user.id)
      .maybeSingle();

    const settingsResult = await supabase
      .from("settings")
      .select("email_notifications, push_notifications, privacy")
      .eq("user_id", user.id)
      .maybeSingle();

    const subscriptionResult = await supabase
      .from("subscriptions")
      .select("status, stripe_customer_id, stripe_subscription_id, ai_monthly_quota, ai_monthly_usage, current_period_end")
      .eq("user_id", user.id)
      .maybeSingle();

    profile = profileResult.data as SettingsProfile | null;
    settings = settingsResult.data as UserSettings | null;
    subscription = subscriptionResult.data as UserSubscription | null;
  }

  const privacy = settings?.privacy;
  const aiUsage = subscription
    ? `${subscription.ai_monthly_usage}/${subscription.ai_monthly_quota}`
    : `0/${env.AI_MONTHLY_QUOTA}`;
  const stripeReady = Boolean(env.STRIPE_SECRET_KEY && env.STRIPE_PRICE_ID && env.STRIPE_WEBHOOK_SECRET);
  const hasStripeSubscription = Boolean(subscription?.stripe_subscription_id);
  const canManageSubscription = Boolean(subscription?.stripe_customer_id);
  const subscriptionBadge = hasStripeSubscription ? subscription?.status ?? "trialing" : "essai à activer";

  return (
    <>
      <PageHeader
        title="Paramètres"
        description="Compte, préférences pédagogiques, notifications, confidentialité RGPD et abonnement."
        action={
          <Link
            href="/api/me/export"
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--glass)] px-4 text-sm font-medium text-[var(--foreground)] shadow-sm transition hover:bg-[var(--surface)]"
          >
            <Download className="h-4 w-4" aria-hidden />
            Export RGPD
          </Link>
        }
      />

      <AuthFeedback error={params?.error} message={params?.message} />

      <div className="mt-5 grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-black">Profil étudiant</h2>
              <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
                Ces infos personnalisent les fiches, stages et objectifs sans exposer de données patient.
              </p>
            </div>
            <Badge>Compte</Badge>
          </div>

          <form action={updateProfileAction} className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold">
              Prénom
              <Input className="mt-1" name="firstName" defaultValue={profile?.first_name ?? ""} autoComplete="given-name" />
            </label>
            <label className="text-sm font-semibold">
              Nom
              <Input className="mt-1" name="lastName" defaultValue={profile?.last_name ?? ""} autoComplete="family-name" />
            </label>
            <label className="text-sm font-semibold">
              IFSI
              <Input className="mt-1" name="ifsi" defaultValue={profile?.ifsi ?? ""} placeholder="Ex: IFSI Lyon Sud" />
            </label>
            <label className="text-sm font-semibold">
              Promotion
              <Input className="mt-1" name="cohort" defaultValue={profile?.cohort ?? ""} placeholder="Ex: Promo 2026" />
            </label>
            <label className="text-sm font-semibold sm:col-span-2">
              Année IFSI
              <select
                name="studyYear"
                defaultValue={profile?.study_year ?? ""}
                className="mt-1 h-11 w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--ring)]"
              >
                <option value="">Non renseignée</option>
                <option value="1">1re année</option>
                <option value="2">2e année</option>
                <option value="3">3e année</option>
              </select>
            </label>
            <Button className="sm:col-span-2">Enregistrer le profil</Button>
          </form>
        </Card>

        <Card className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-black">Abonnement et quotas</h2>
              <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
                30 jours gratuits, puis 4,99 €/mois. Paiement sécurisé par Stripe, clés et cartes jamais stockées dans NurseAI.
              </p>
            </div>
            <Badge>{subscriptionBadge}</Badge>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-[var(--surface)] p-4">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--muted)]">Usage IA</p>
              <p className="mt-2 text-3xl font-black">{aiUsage}</p>
            </div>
            <div className="rounded-lg bg-[var(--surface)] p-4">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--muted)]">Période</p>
              <p className="mt-2 text-sm font-bold">
                {subscription?.current_period_end
                  ? new Intl.DateTimeFormat("fr-FR").format(new Date(subscription.current_period_end))
                  : hasStripeSubscription
                    ? "En attente Stripe"
                    : "Non activée"}
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-lg border border-[var(--border)] bg-[var(--glass)] p-4">
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-[var(--surface)] text-[var(--primary)]">
                {hasStripeSubscription ? <CreditCard className="h-5 w-5" aria-hidden /> : <Sparkles className="h-5 w-5" aria-hidden />}
              </div>
              <div>
                <p className="text-sm font-black">
                  {hasStripeSubscription ? "Abonnement actif côté Stripe" : "Active ton essai gratuit"}
                </p>
                <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
                  {hasStripeSubscription
                    ? "Tu peux modifier ta carte, télécharger tes factures ou annuler depuis le portail sécurisé Stripe."
                    : "L'essai débloque l'IA réelle pendant 30 jours. Ensuite, Stripe facture 4,99 €/mois si tu gardes l'abonnement."}
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {stripeReady && !hasStripeSubscription ? (
                <a
                  href="/api/stripe/checkout"
                  className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-4 text-sm font-medium text-white shadow-lg shadow-[color:var(--ring)] transition hover:bg-[var(--primary-dark)]"
                >
                  <Sparkles className="h-4 w-4" aria-hidden />
                  Activer l&apos;essai 30 jours
                </a>
              ) : (
                <Button className="w-full" disabled>
                  <Sparkles className="h-4 w-4" aria-hidden />
                  Activer l&apos;essai 30 jours
                </Button>
              )}
              {stripeReady && canManageSubscription ? (
                <a
                  href="/api/stripe/portal"
                  className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--glass)] px-4 text-sm font-medium text-[var(--foreground)] shadow-sm transition hover:bg-[var(--surface)]"
                >
                  <CreditCard className="h-4 w-4" aria-hidden />
                  Gérer l&apos;abonnement
                </a>
              ) : (
                <Button className="w-full" variant="secondary" disabled>
                  <CreditCard className="h-4 w-4" aria-hidden />
                  Gérer l&apos;abonnement
                </Button>
              )}
            </div>

            {!stripeReady ? (
              <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-800">
                Stripe n&apos;est pas complet dans Vercel: ajoute STRIPE_SECRET_KEY, STRIPE_PRICE_ID et STRIPE_WEBHOOK_SECRET.
              </p>
            ) : null}
          </div>
        </Card>
      </div>

      <form action={updatePreferencesAction} className="mt-4 grid gap-4 xl:grid-cols-2">
        <Card className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-black">Notifications</h2>
              <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
                Choisis comment NurseAI te relance pour les stages, révisions et calculs.
              </p>
            </div>
            <Badge>Rythme</Badge>
          </div>
          <div className="mt-5 space-y-3">
            <SwitchRow
              name="emailNotifications"
              title="Emails utiles"
              description="Rappels de révision, objectifs de stage et sécurité du compte."
              defaultChecked={settings?.email_notifications ?? true}
            />
            <SwitchRow
              name="pushNotifications"
              title="Notifications mobile"
              description="Prévu pour l'application iOS/Android quand le wrapper mobile sera branché."
              defaultChecked={settings?.push_notifications ?? false}
            />
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-black">Pédagogie et IA</h2>
              <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
                Le bon équilibre: guider l&apos;étudiant sans lui donner tout le raisonnement prémâché.
              </p>
            </div>
            <Badge>IFSI</Badge>
          </div>
          <div className="mt-5 space-y-3">
            <SwitchRow
              name="guidedLearning"
              title="Mode guidé"
              description="L'app pose des questions et donne des pistes avant de générer une correction complète."
              defaultChecked={privacyValue(privacy, "guided_learning", true)}
            />
            <SwitchRow
              name="strictCorrectionMode"
              title="Correction exigeante"
              description="Les calculs de dose et démarches signalent les oublis importants plus fermement."
              defaultChecked={privacyValue(privacy, "strict_correction_mode", true)}
            />
            <SwitchRow
              name="anonymizationReminder"
              title="Rappel d'anonymisation"
              description="Afficher les alertes pour éviter noms, dates de naissance, adresses ou numéros patient."
              defaultChecked={privacyValue(privacy, "anonymization_reminder", true)}
            />
          </div>
        </Card>

        <Card className="p-5 xl:col-span-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-black">Confidentialité RGPD</h2>
              <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
                Les données patient doivent rester anonymisées. Les exports et suppressions doivent être explicites.
              </p>
            </div>
            <ShieldCheck className="h-6 w-6 text-[var(--success)]" aria-hidden />
          </div>
          <div className="mt-5 grid gap-3 lg:grid-cols-2">
            <SwitchRow
              name="analyticsConsent"
              title="Mesure produit anonymisée"
              description="Autoriser uniquement des statistiques agrégées pour améliorer l'application."
              defaultChecked={privacyValue(privacy, "analytics_consent", false)}
            />
            <SwitchRow
              name="aiTrainingOptIn"
              title="Réutilisation pour entraînement IA"
              description="Désactivé par défaut. Les contenus personnels ne doivent pas servir à entraîner un modèle sans accord clair."
              defaultChecked={privacyValue(privacy, "ai_training_opt_in", false)}
            />
          </div>
          <Button className="mt-5 w-full">Enregistrer les préférences</Button>
        </Card>
      </form>

      <Card className="mt-4 border-red-100 bg-red-50/50 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-black text-red-900">Zone sensible</h2>
            <p className="mt-1 text-sm leading-6 text-red-700">
              L&apos;export télécharge tes données. La suppression est enregistrée comme demande, sans effacement automatique brutal.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/api/me/export"
              className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-red-200 bg-[var(--glass)] px-4 text-sm font-medium text-red-800 shadow-sm transition hover:bg-red-50"
            >
              <Download className="h-4 w-4" aria-hidden />
              Télécharger mes données
            </Link>
            <form action={requestAccountDeletionAction}>
              <Button variant="danger">
                <Trash2 className="h-4 w-4" aria-hidden />
                Demander suppression
              </Button>
            </form>
          </div>
        </div>
      </Card>
    </>
  );
}
