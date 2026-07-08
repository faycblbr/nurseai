import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <Link href="/" className="text-sm font-semibold text-[var(--primary)]">Retour</Link>
      <Card className="mt-5 p-6">
        <ShieldCheck className="h-8 w-8 text-[var(--primary)]" aria-hidden />
        <h1 className="mt-4 text-3xl font-black">Confidentialité</h1>
        <div className="mt-5 space-y-4 text-sm leading-7 text-[var(--muted)]">
          <p>
            NurseAI est conçu pour les étudiants infirmiers. Les utilisateurs ne doivent jamais saisir de nom, prénom, date de naissance, adresse, numéro patient ou donnée directement identifiable.
          </p>
          <p>
            Les données de compte, préférences, documents pédagogiques et historiques d&apos;utilisation sont stockés dans Supabase avec des règles d&apos;accès par utilisateur.
          </p>
          <p>
            Les exports RGPD sont disponibles depuis les paramètres. La suppression de compte passe par une demande confirmée afin d&apos;éviter tout effacement accidentel.
          </p>
          <p>
            En production, cette page devra être complétée avec l&apos;identité juridique de l&apos;éditeur, le contact DPO/RGPD, les durées de conservation et les sous-traitants exacts.
          </p>
        </div>
      </Card>
    </main>
  );
}
