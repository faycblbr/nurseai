"use client";

import { useMemo, useRef, useState } from "react";
import { FileText, UploadCloud } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export function RevisionGenerator() {
  const [course, setCourse] = useState("");
  const [generated, setGenerated] = useState(false);
  const [selectedFile, setSelectedFile] = useState("");
  const [fileMessage, setFileMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const keywords = useMemo(() => {
    return course
      .split(/\s+/)
      .map((word) => word.replace(/[^\p{L}]/gu, ""))
      .filter((word) => word.length > 6)
      .slice(0, 6);
  }, [course]);

  async function handleFile(file: File | undefined) {
    if (!file) {
      return;
    }

    setSelectedFile(file.name);
    setGenerated(false);

    const extension = file.name.split(".").pop()?.toLowerCase();

    if (extension === "txt" || extension === "md") {
      const text = await file.text();
      setCourse(text);
      setFileMessage("Cours texte chargé. Tu peux corriger l'extrait puis générer la fiche.");
      return;
    }

    setCourse(
      `Fichier sélectionné: ${file.name}\n\nPour l'instant, colle ici un extrait du cours pour générer la fiche. L'extraction automatique PDF/DOCX sera branchée côté serveur avec l'IA.`
    );
    setFileMessage("Fichier sélectionné. La fenêtre de ton ordinateur fonctionne bien.");
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
      <Card className="p-5">
        <h2 className="text-lg font-black">Importer un cours</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
          Colle un extrait de cours. NurseAI génère une fiche pédagogique sans tout donner: résumé, questions et points à chercher.
        </p>
        <input
          ref={inputRef}
          id="course-file-input"
          className="sr-only"
          type="file"
          accept=".txt,.md,.pdf,.doc,.docx"
          onChange={(event) => void handleFile(event.target.files?.[0])}
        />
        <div className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--glass)] p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-black">Fichier de cours</p>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {selectedFile || "PDF, Word, Markdown ou texte"}
              </p>
            </div>
            <Button type="button" variant="secondary" onClick={() => inputRef.current?.click()}>
              <FileText className="h-4 w-4" aria-hidden />
              Choisir un fichier
            </Button>
          </div>
          {fileMessage ? (
            <p className="mt-3 rounded-lg bg-[var(--surface)] px-3 py-2 text-sm text-[var(--muted)]">
              {fileMessage}
            </p>
          ) : null}
        </div>
        <form
          id="revision-import"
          onSubmit={(event) => {
            event.preventDefault();
            setGenerated(course.trim().length > 20);
          }}
        >
          <Textarea
            className="mt-4 min-h-56"
            value={course}
            onChange={(event) => setCourse(event.target.value)}
            placeholder="Colle ici ton cours de cardiologie, pharmacologie, anatomie..."
          />
          <Button className="mt-4 w-full" type="submit">
            <UploadCloud className="h-4 w-4" aria-hidden />
            Importer et générer
          </Button>
        </form>
      </Card>
      <Card className="p-5">
        <h2 className="text-lg font-black">Fiche générée</h2>
        {!generated ? (
          <div className="mt-4 rounded-lg border border-dashed border-[var(--border)] p-6 text-center text-sm text-[var(--muted)]">
            Ajoute un cours puis clique sur Importer.
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            <section className="rounded-lg bg-[var(--surface)] p-4">
              <Badge>Résumé guidé</Badge>
              <p className="mt-3 text-sm leading-6">
                Ce cours semble tourner autour de: {keywords.join(", ") || "notions clés à identifier"}. Commence par isoler les définitions, les risques et les surveillances IDE.
              </p>
            </section>
            <section className="grid gap-3 sm:grid-cols-2">
              {["3 idées essentielles", "Questions à te poser", "À chercher toi-même", "Mini quiz"].map((item) => (
                <div key={item} className="rounded-lg border border-[var(--border)] bg-[var(--glass)] p-4">
                  <p className="font-bold">{item}</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                    Contenu prêt à être enrichi par l&apos;IA OpenAI dès que la clé API est ajoutée.
                  </p>
                </div>
              ))}
            </section>
          </div>
        )}
      </Card>
    </div>
  );
}
