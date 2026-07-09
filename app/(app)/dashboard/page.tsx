import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileText,
  Flame,
  HeartPulse,
  Pill,
  Sparkles,
  Target,
  TrendingUp
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/app/stat-card";
import { createSupabaseServerClient } from "@/server/supabase/server";

type DashboardProfile = {
  first_name: string | null;
  study_year: string | null;
  ifsi: string | null;
};

const onboardingModules = [
  { title: "Démarche de soins", text: "Recueil, 14 besoins, diagnostics, actions et évaluation.", icon: HeartPulse, href: "/soins" },
  { title: "Calculs de doses", text: "Chrono, correction automatique et explication détaillée.", icon: Pill, href: "/doses" },
  { title: "Fiches IA", text: "Résumé, flashcards, quiz et mnémotechniques depuis tes cours.", icon: FileText, href: "/fiches" }
] as const;

async function getCount(table: "care_plans" | "transmissions" | "revision_cards" | "documents") {
  const supabase = await createSupabaseServerClient();
  const { count } = await supabase.from(table).select("id", { count: "exact", head: true });
  return count ?? 0;
}

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  let profile: DashboardProfile | null = null;

  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("first_name, study_year, ifsi")
      .eq("id", user.id)
      .maybeSingle();

    profile = data as DashboardProfile | null;
  }

  const [carePlansCount, transmissionsCount, revisionCardsCount, documentsCount] = await Promise.all([
    getCount("care_plans"),
    getCount("transmissions"),
    getCount("revision_cards"),
    getCount("documents")
  ]);

  const firstName = profile?.first_name ?? user?.email?.split("@")[0] ?? "Bienvenue";
  const totalDocuments = carePlansCount + transmissionsCount + revisionCardsCount + documentsCount;

  return (
    <div className="space-y-6">
      <section className="mesh-surface overflow-hidden rounded-lg border border-[var(--border)] p-5 shadow-2xl shadow-[color:var(--shadow-soft)] sm:p-7">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge>
                <Sparkles className="mr-1 h-3 w-3" aria-hidden />
                Assistant IA IFSI
              </Badge>
              <Badge>Stage-ready</Badge>
            </div>
            <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-normal text-[var(--foreground)] sm:text-5xl">
              {firstName}, construis ton espace IFSI en quelques minutes.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--muted)]">
              Ton compte est prêt. Commence par créer ta première démarche de soins, importer un cours ou lancer un entraînement de calculs de doses.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/soins">
                <Button size="lg" className="w-full sm:w-auto">
                  <Sparkles className="h-4 w-4" aria-hidden />
                  Créer une démarche
                </Button>
              </Link>
              <Link href="/doses">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  S&apos;entraîner aux doses
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Button>
              </Link>
            </div>
          </div>
          <div className="rounded-lg border border-[var(--border)] bg-[var(--glass)] p-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--muted)]">
                  Session recommandée
                </p>
                <p className="mt-1 text-lg font-bold">Configurer ton espace</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--mint)] text-[var(--mint-strong)]">
                <CheckCircle2 className="h-6 w-6" aria-hidden />
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {[
                "Compléter ton profil étudiant",
                "Créer ta première démarche de soins",
                "Importer ton premier cours"
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-lg bg-[var(--background)] px-3 py-3">
                  <CheckCircle2 className="h-4 w-4 text-[var(--success)]" aria-hidden />
                  <span className="text-sm font-semibold">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Progression" value="0%" detail="Elle démarre quand tu crées tes premiers contenus." icon={Target} tone="aqua" />
        <StatCard label="Streak" value="0 jour" detail="Ton rythme sera calculé après tes sessions." icon={Flame} tone="peach" />
        <StatCard label="Travail" value="0h00" detail="Le temps de travail sera suivi automatiquement." icon={Clock3} tone="green" />
        <StatCard label="Documents" value={`${totalDocuments}`} detail="Tes démarches, transmissions et fiches apparaîtront ici." icon={FileText} tone="violet" />
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
        <Card className="p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-black">Priorités intelligentes</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">Le bon effort, au bon moment.</p>
            </div>
            <Badge>IA pédagogique</Badge>
          </div>
          <div className="mt-5 rounded-lg border border-dashed border-[var(--border)] bg-[var(--glass)] p-6 text-center">
            <Sparkles className="mx-auto h-8 w-8 text-[var(--primary)]" aria-hidden />
            <h3 className="mt-3 text-lg font-black">Aucune priorité pour l&apos;instant</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--muted)]">
              Dès que tu crées des documents ou des exercices, NurseAI te proposera les prochaines actions utiles.
            </p>
            <Link href="/soins">
              <Button className="mt-4">Créer ma première démarche</Button>
            </Link>
          </div>
        </Card>

        <Card className="p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black">Derniers documents</h2>
            <TrendingUp className="h-5 w-5 text-[var(--primary)]" aria-hidden />
          </div>
          <div className="mt-4 rounded-lg border border-dashed border-[var(--border)] bg-[var(--glass)] p-6 text-center">
            <FileText className="mx-auto h-8 w-8 text-[var(--muted)]" aria-hidden />
            <h3 className="mt-3 text-base font-black">Aucun document</h3>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              Tes exports et documents IA apparaîtront ici.
            </p>
          </div>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {onboardingModules.map((module) => {
          const Icon = module.icon;
          return (
            <Link key={module.title} href={module.href} className="block">
              <Card className="group h-full p-5 transition hover:-translate-y-0.5 hover:shadow-xl">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--foreground)] text-white">
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <h3 className="mt-5 text-lg font-black">{module.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{module.text}</p>
                <div className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[var(--primary)]">
                  Ouvrir le module
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden />
                </div>
              </Card>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
