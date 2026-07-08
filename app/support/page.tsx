import Link from "next/link";
import { Mail } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function SupportPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <Link href="/" className="text-sm font-semibold text-[var(--primary)]">Retour</Link>
      <Card className="mt-5 p-6">
        <Mail className="h-8 w-8 text-[var(--primary)]" aria-hidden />
        <h1 className="mt-4 text-3xl font-black">Support</h1>
        <p className="mt-5 text-sm leading-7 text-[var(--muted)]">
          Pour une publication publique, ajoute ici l&apos;email officiel de support, les délais de réponse et les liens vers la politique de confidentialité. Apple demande un support accessible et cohérent avec la fiche App Store.
        </p>
      </Card>
    </main>
  );
}
