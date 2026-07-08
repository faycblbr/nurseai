import Link from "next/link";
import { Card } from "@/components/ui/card";

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <Link href="/" className="text-sm font-semibold text-[var(--primary)]">Retour</Link>
      <Card className="mt-5 p-6">
        <h1 className="text-3xl font-black">Conditions d&apos;utilisation</h1>
        <div className="mt-5 space-y-4 text-sm leading-7 text-[var(--muted)]">
          <p>
            NurseAI est un outil pédagogique d&apos;aide à la révision et à la structuration du raisonnement infirmier. Il ne remplace pas un formateur, un professionnel de santé, un protocole local ou une décision médicale.
          </p>
          <p>
            L&apos;utilisateur reste responsable de vérifier les calculs, contenus, surveillances et propositions générées avant toute utilisation dans un contexte réel.
          </p>
          <p>
            Les contenus patients doivent être anonymisés. Tout usage impliquant des données identifiantes de patients est interdit dans l&apos;application.
          </p>
          <p>
            En production, ces conditions devront être validées juridiquement avant publication App Store, Play Store ou abonnement payant.
          </p>
        </div>
      </Card>
    </main>
  );
}
