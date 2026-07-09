import { MobileNav } from "@/components/app/mobile-nav";
import { Sidebar } from "@/components/app/sidebar";
import { Topbar } from "@/components/app/topbar";
import { PremiumProvider } from "@/components/billing/premium-provider";
import { createSupabaseServerClient } from "@/server/supabase/server";
import { getBillingAccess } from "@/server/billing/subscription";
import { redirect } from "next/navigation";

export default async function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/connexion");
  }

  const billing = await getBillingAccess(user.id);

  return (
    <PremiumProvider active={billing.allowed}>
      <div className="min-h-screen lg:flex">
        <Sidebar />
        <div className="min-w-0 flex-1 pb-20 lg:pb-0">
          <Topbar />
          {!billing.allowed ? (
            <div className="border-b border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm font-semibold text-[var(--foreground)] sm:px-6">
              Mode aperçu actif. Les fonctionnalités premium sont bloquées tant que l&apos;essai gratuit n&apos;est pas activé.
              <a href="/activation" className="ml-2 text-[var(--primary)] underline underline-offset-4">
                Activer l&apos;essai
              </a>
            </div>
          ) : null}
          <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
            {children}
          </main>
        </div>
        <MobileNav />
      </div>
    </PremiumProvider>
  );
}
