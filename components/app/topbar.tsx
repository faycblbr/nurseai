import { Bell, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { AppLogo } from "@/components/app/app-logo";
import { TopbarSearch } from "@/components/app/topbar-search";
import { Button } from "@/components/ui/button";
import { priorityActions } from "@/config/navigation";
import { signOutAction } from "@/features/auth/actions";

export function Topbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--glass)] px-4 py-3 backdrop-blur-2xl sm:px-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
        <TopbarSearch />
        <div className="flex min-w-0 flex-1 items-center gap-2 md:hidden">
          <AppLogo size="sm" />
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 xl:flex">
            {priorityActions.map((action) => (
              <Link key={action.href} href={action.href}>
                <Button variant="secondary" size="sm">
                  {action.label}
                </Button>
              </Link>
            ))}
          </div>
          <Link href="/soins" className="hidden sm:block">
            <Button size="sm">
              <Sparkles className="h-4 w-4" aria-hidden />
              Générer
            </Button>
          </Link>
          <Link href="/parametres">
            <Button variant="ghost" size="icon" aria-label="Conformité et confidentialité">
              <ShieldCheck className="h-4 w-4" aria-hidden />
            </Button>
          </Link>
          <Link href="/agenda">
            <Button variant="ghost" size="icon" aria-label="Notifications">
              <Bell className="h-4 w-4" aria-hidden />
            </Button>
          </Link>
          <form action={signOutAction} className="hidden md:block">
            <Button variant="secondary" size="sm">Sortir</Button>
          </form>
        </div>
      </div>
    </header>
  );
}
