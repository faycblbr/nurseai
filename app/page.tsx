import {
  ArrowRight,
  BookOpenCheck,
  Calculator,
  CheckCircle2,
  FileText,
  HeartPulse,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { AppLogo } from "@/components/app/app-logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const modules = [
  {
    title: "Démarches de soins",
    text: "Recueil guidé, constantes, traitements, surveillances IDE et raisonnement structuré.",
    icon: HeartPulse
  },
  {
    title: "Calculs de doses",
    text: "Exercices interactifs, correction progressive et entraînement sans réponse toute faite.",
    icon: Calculator
  },
  {
    title: "Fiches de cours",
    text: "Résumé, questions, points à chercher et préparation ciblée pour les stages.",
    icon: FileText
  }
] as const;

export default function HomePage() {
  return (
    <main className="min-h-screen px-4 py-5 sm:px-6">
      <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--glass)] px-3 py-3 backdrop-blur-2xl">
        <Link href="/" className="flex items-center gap-3">
          <AppLogo size="sm" />
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/connexion">
            <Button variant="ghost" size="sm">Connexion</Button>
          </Link>
          <Link href="/inscription">
            <Button size="sm">Créer un compte</Button>
          </Link>
        </div>
      </nav>

      <section className="mx-auto grid max-w-7xl gap-7 py-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:py-16">
        <div>
          <div className="flex flex-wrap gap-2">
            <Badge>
              <Sparkles className="mr-1 h-3 w-3" aria-hidden />
              Pensé pour les étudiants infirmiers
            </Badge>
            <Badge>RGPD-ready</Badge>
          </div>
          <h1 className="mt-6 max-w-3xl text-4xl font-black tracking-normal text-[var(--foreground)] sm:text-6xl">
            L&apos;app IFSI qui t&apos;aide à comprendre, pas juste recopier.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--muted)]">
            Démarches de soins, calculs de doses, fiches de cours, quiz et préparation de stage dans une interface premium, guidée et pensée pour le mobile.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link href="/inscription">
              <Button size="lg" className="w-full sm:w-auto">
                Commencer maintenant
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Button>
            </Link>
            <Link href="/connexion">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                J&apos;ai déjà un compte
              </Button>
            </Link>
          </div>
          <div className="mt-6 flex flex-wrap gap-4 text-sm font-semibold text-[var(--muted)]">
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[var(--success)]" aria-hidden />
              Données patient anonymisées
            </span>
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[var(--success)]" aria-hidden />
              Compte sécurisé Supabase
            </span>
          </div>
        </div>

        <div className="mesh-surface rounded-lg border border-[var(--border)] p-4 shadow-2xl shadow-[color:var(--shadow-soft)] sm:p-5">
          <div className="rounded-lg border border-[var(--border)] bg-[var(--glass)] p-4 backdrop-blur-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--muted)]">
                  Session recommandée
                </p>
                <h2 className="mt-1 text-xl font-black">Stage cardiologie</h2>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--foreground)] text-[var(--background)]">
                <BookOpenCheck className="h-6 w-6" aria-hidden />
              </div>
            </div>
            <div className="mt-5 grid gap-3">
              {[
                "Revoir schéma du coeur et circulation",
                "Identifier familles de médicaments fréquentes",
                "Préparer surveillances IDE et signes d'alerte"
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-lg bg-[var(--card)]/80 px-3 py-3">
                  <CheckCircle2 className="h-4 w-4 text-[var(--success)]" aria-hidden />
                  <span className="text-sm font-semibold">{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-lg bg-[var(--surface)] p-4">
              <p className="text-sm font-black">Mode guidé</p>
              <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
                NurseAI donne les bonnes pistes, puis laisse l&apos;étudiant chercher et compléter son raisonnement.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 pb-10 md:grid-cols-3">
        {modules.map((module) => {
          const Icon = module.icon;
          return (
            <Card key={module.title} className="p-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--foreground)] text-[var(--background)]">
                <Icon className="h-5 w-5" aria-hidden />
              </div>
              <h2 className="mt-5 text-lg font-black">{module.title}</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{module.text}</p>
            </Card>
          );
        })}
      </section>

      <footer className="mx-auto flex max-w-7xl flex-col gap-3 border-t border-[var(--border)] py-6 text-sm text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
        <span className="inline-flex items-center gap-2">
          <ShieldCheck className="h-4 w-4" aria-hidden />
          NurseAI ne remplace pas l&apos;encadrement pédagogique ou médical.
        </span>
        <div className="flex gap-4">
          <Link href="/confidentialite">Confidentialité</Link>
          <Link href="/conditions">Conditions</Link>
          <Link href="/support">Support</Link>
        </div>
      </footer>
    </main>
  );
}
