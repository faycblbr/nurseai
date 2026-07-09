"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Command, Search } from "lucide-react";

export function TopbarSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();
    router.push(trimmed ? `/bibliotheque?q=${encodeURIComponent(trimmed)}` : "/bibliotheque");
  }

  return (
    <form
      onSubmit={submitSearch}
      className="hidden h-11 min-w-0 flex-1 items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--glass-strong)] px-3 text-sm font-medium text-[var(--muted)] shadow-sm md:flex"
    >
      <Search className="h-4 w-4" aria-hidden />
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        className="min-w-0 flex-1 bg-transparent text-[var(--foreground)] outline-none placeholder:text-[var(--muted)]"
        placeholder="Rechercher une UE, un document, une fiche..."
        aria-label="Rechercher dans NurseAI"
      />
      <button
        type="submit"
        className="inline-flex items-center gap-1 rounded-md border border-[var(--border)] bg-[var(--background)] px-2 py-1 text-[11px] font-bold text-[var(--muted)] transition hover:text-[var(--foreground)]"
        aria-label="Lancer la recherche"
      >
        <Command className="h-3 w-3" aria-hidden /> K
      </button>
    </form>
  );
}
