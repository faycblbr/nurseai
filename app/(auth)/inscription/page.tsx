import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AuthFeedback } from "@/components/auth/auth-feedback";
import { signUpAction } from "@/features/auth/actions";

type SignUpPageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const params = await searchParams;

  return (
    <Card className="p-6">
      <h1 className="text-2xl font-semibold">Inscription</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">Crée ton espace IFSI personnalisé.</p>
      <AuthFeedback error={params?.error} />
      <form action={signUpAction} className="mt-6 space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <Input name="firstName" placeholder="Prénom" autoComplete="given-name" required />
          <Input name="lastName" placeholder="Nom" autoComplete="family-name" required />
        </div>
        <Input name="email" type="email" placeholder="Email" autoComplete="email" required />
        <Input name="password" type="password" placeholder="Mot de passe" autoComplete="new-password" required />
        <Input name="studyYear" inputMode="numeric" placeholder="Année IFSI: 1, 2 ou 3" required />
        <Button className="w-full">Créer le compte</Button>
      </form>
      <p className="mt-4 text-sm text-[var(--muted)]">
        Déjà inscrit ? <Link href="/connexion" className="text-[var(--primary)]">Connexion</Link>
      </p>
    </Card>
  );
}
