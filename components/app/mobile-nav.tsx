"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { appNavigation } from "@/config/navigation";
import { cn } from "@/lib/utils";

const mobileItems = [
  appNavigation[0],
  appNavigation[1],
  appNavigation[3],
  appNavigation[4],
  appNavigation[9]
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-[var(--border)] bg-[var(--card)]/95 px-2 py-2 backdrop-blur lg:hidden">
      {mobileItems.map((item) => {
        const Icon = item.icon;
        const active = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex h-12 flex-col items-center justify-center gap-1 rounded-lg text-[10px] font-medium text-[var(--muted)]",
              active && "bg-[var(--surface)] text-[var(--primary)]"
            )}
          >
            <Icon className="h-4 w-4" aria-hidden />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
