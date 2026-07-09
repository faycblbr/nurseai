"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppLogo } from "@/components/app/app-logo";
import { appNavigation } from "@/config/navigation";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden min-h-screen w-72 border-r border-[var(--border)] bg-[var(--glass)] px-4 py-5 shadow-[18px_0_55px_var(--shadow-soft)] backdrop-blur-2xl lg:block">
      <div className="mb-7 flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--glass-strong)] p-2 shadow-sm">
        <AppLogo />
      </div>
      <nav className="space-y-1">
        {appNavigation.map((item) => {
          const Icon = item.icon;
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold text-[var(--muted)] transition",
                "hover:bg-[var(--glass-strong)] hover:text-[var(--foreground)] hover:shadow-sm",
                active &&
                  "bg-[var(--foreground)] text-[var(--background)] shadow-lg shadow-[color:var(--shadow-soft)] hover:bg-[var(--foreground)] hover:text-[var(--background)]"
              )}
            >
              <Icon className="h-4 w-4" aria-hidden />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mesh-surface mt-8 rounded-lg border border-[var(--border)] p-4 shadow-lg shadow-[color:var(--shadow-soft)]">
        <Badge>Plan Early Access</Badge>
        <p className="mt-3 text-sm font-bold">Assistant clinique activé</p>
        <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
          Démarches, transmissions et calculs réunis dans une expérience pensée pour le stage.
        </p>
      </div>
    </aside>
  );
}
