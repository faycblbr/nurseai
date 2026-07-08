import { UploadCloud } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { RevisionGenerator } from "@/components/features/revision-generator";

export default function RevisionCardsPage() {
  return (
    <>
      <PageHeader
        title="Générateur de fiches"
        description="Import de PDF, cours ou texte pour produire résumé, flashcards, quiz, mnémotechniques et carte mentale."
        action={
          <label
            htmlFor="course-file-input"
            className="inline-flex h-10 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-4 text-sm font-medium text-white shadow-lg shadow-[color:var(--ring)] transition hover:bg-[var(--primary-dark)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2"
          >
            <UploadCloud className="h-4 w-4" aria-hidden />
            Importer
          </label>
        }
      />
      <RevisionGenerator />
    </>
  );
}
