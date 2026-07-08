import { Search } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function LibraryPage() {
  return (
    <>
      <PageHeader
        title="Bibliothèque"
        description="Tous les documents générés ou importés, avec recherche, filtres, favoris et exports."
      />
      <Card className="p-5">
        <div className="flex items-center gap-2 rounded-lg border border-[var(--border)] px-3">
          <Search className="h-4 w-4 text-[var(--muted)]" aria-hidden />
          <Input className="border-0 px-0 focus:ring-0" placeholder="Rechercher dans les documents..." />
        </div>
      </Card>
    </>
  );
}
