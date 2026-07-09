"use client";

import { useMemo, useState } from "react";
import { Download, FileText, Search, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const starterDocuments = [
  {
    title: "Démarches de soins",
    type: "Module",
    description: "Tes démarches sauvegardées apparaîtront ici dès la première génération.",
    href: "/soins"
  },
  {
    title: "Fiches de cours",
    type: "Fiches",
    description: "Importe un cours texte, PDF ou Word puis transforme-le en fiche guidée.",
    href: "/fiches"
  },
  {
    title: "Préparation de stage",
    type: "Stage",
    description: "Cardiologie, gériatrie, pneumologie et prochains services personnalisés.",
    href: "/stages"
  }
];

type LibraryBrowserProps = {
  initialQuery?: string;
};

export function LibraryBrowser({ initialQuery = "" }: LibraryBrowserProps) {
  const [query, setQuery] = useState(initialQuery);
  const filteredDocuments = useMemo(() => {
    const normalized = query.toLowerCase().trim();
    if (!normalized) {
      return starterDocuments;
    }

    return starterDocuments.filter((document) =>
      `${document.title} ${document.type} ${document.description}`.toLowerCase().includes(normalized)
    );
  }, [query]);

  return (
    <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
      <Card className="p-5">
        <div className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--glass)] px-3">
          <Search className="h-4 w-4 text-[var(--muted)]" aria-hidden />
          <Input
            className="border-0 bg-transparent px-0 focus:ring-0"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Rechercher dans les documents..."
          />
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-3 lg:grid-cols-1">
          {["Tout", "Fiches", "Stages"].map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setQuery(filter === "Tout" ? "" : filter)}
              className="rounded-lg border border-[var(--border)] bg-[var(--glass)] px-3 py-2 text-left text-sm font-bold transition hover:bg-[var(--surface)]"
            >
              {filter}
            </button>
          ))}
        </div>
        <a href="/api/me/export" className="mt-4 block">
          <Button variant="secondary" className="w-full">
            <Download className="h-4 w-4" aria-hidden />
            Exporter mes données
          </Button>
        </a>
      </Card>

      <div className="grid gap-3">
        {filteredDocuments.length === 0 ? (
          <Card className="p-8 text-center">
            <Search className="mx-auto h-8 w-8 text-[var(--muted)]" aria-hidden />
            <h2 className="mt-3 text-lg font-black">Aucun résultat</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              Essaie un mot comme fiche, stage, démarche ou calcul.
            </p>
          </Card>
        ) : (
          filteredDocuments.map((document) => (
            <a key={document.title} href={document.href} className="block">
              <Card className="group p-5 transition hover:-translate-y-0.5 hover:shadow-xl">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex gap-3">
                    <div className="grid h-11 w-11 place-items-center rounded-lg bg-[var(--foreground)] text-[var(--background)]">
                      <FileText className="h-5 w-5" aria-hidden />
                    </div>
                    <div>
                      <Badge>{document.type}</Badge>
                      <h2 className="mt-2 text-lg font-black">{document.title}</h2>
                      <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{document.description}</p>
                    </div>
                  </div>
                  <Star className="h-5 w-5 text-[var(--gold)] opacity-70 transition group-hover:opacity-100" aria-hidden />
                </div>
              </Card>
            </a>
          ))
        )}
      </div>
    </div>
  );
}
