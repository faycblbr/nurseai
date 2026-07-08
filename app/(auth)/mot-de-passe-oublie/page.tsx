import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AuthFeedback } from "@/components/auth/auth-feedback";
import { resetPasswordAction } from "@/features/auth/actions";

type ForgotPasswordPageProps = {
  searchParams?: Promise<{
    error?: string;
    message?: string;
  }>;
};

export default async function ForgotPasswordPage({ searchParams }: ForgotPasswordPageProps) {
  const params = await searchParams;

  return (
    <Card className="p-6">
      <h1 className="text-2xl font-semibold">Réinitialisation</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">Reçois un lien sécurisé pour définir un nouveau mot de passe.</p>
      <AuthFeedback error={params?.error} message={params?.message} />
      <form action={resetPasswordAction} className="mt-6 space-y-4">
        <Input name="email" type="email" placeholder="Email" autoComplete="email" required />
        <Button className="w-full">Envoyer le lien</Button>
      </form>
    </Card>
  );
}
