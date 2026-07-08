import { Bell, Command, Search, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { priorityActions } from "@/config/navigation";
import { signOutAction } from "@/features/auth/actions";

export function Topbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--glass)] px-4 py-3 backdrop-blur-2xl sm:px-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
        <div className="hidden h-11 min-w-0 flex-1 items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--glass-strong)] px-3 text-sm font-medium text-[var(--muted)] shadow-sm md:flex">
          <Search className="h-4 w-4" aria-hidden />
          Rechercher une UE, un patient, une fiche...
          <span className="ml-auto inline-flex items-center gap-1 rounded-md border border-[var(--border)] bg-[var(--background)] px-2 py-1 text-[11px]">
            <Command className="h-3 w-3" aria-hidden /> K
          </span>
        </div>
        <div className="flex min-w-0 flex-1 items-center gap-2 md:hidden">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--foreground)] font-bold text-[var(--background)] shadow-lg shadow-[color:var(--shadow-soft)]">
            N
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold">NurseAI</p>
            <p className="truncate text-xs text-[var(--muted)]">Assistant IFSI</p>
          </div>
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
