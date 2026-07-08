import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AuthFeedback } from "@/components/auth/auth-feedback";
import { signInAction } from "@/features/auth/actions";

type SignInPageProps = {
  searchParams?: Promise<{
    error?: string;
    message?: string;
  }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const params = await searchParams;

  return (
    <Card className="p-6">
      <h1 className="text-2xl font-semibold">Connexion</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">Retrouve tes démarches, fiches et sessions d&apos;entraînement.</p>
      <AuthFeedback error={params?.error} message={params?.message} />
      <form action={signInAction} className="mt-6 space-y-4">
        <Input name="email" type="email" placeholder="Email" autoComplete="email" required />
        <Input name="password" type="password" placeholder="Mot de passe" autoComplete="current-password" required />
        <Button className="w-full">Se connecter</Button>
      </form>
      <div className="mt-4 flex justify-between text-sm">
        <Link href="/mot-de-passe-oublie" className="text-[var(--primary)]">Mot de passe oublié</Link>
        <Link href="/inscription" className="text-[var(--primary)]">Créer un compte</Link>
      </div>
    </Card>
  );
}
