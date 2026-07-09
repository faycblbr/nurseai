"use client";

import { useMemo, useRef, useState } from "react";
import { FileText, UploadCloud } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { requestAIGeneration } from "@/lib/ai/client";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type InsertBuilder = {
  insert: (payload: Record<string, unknown>) => Promise<{ error: { message: string } | null }>;
};

type GenericInsertClient = {
  from: (table: string) => InsertBuilder;
};

export function RevisionGenerator() {
  const [course, setCourse] = useState("");
  const [generated, setGenerated] = useState(false);
  const [selectedFile, setSelectedFile] = useState("");
  const [fileMessage, setFileMessage] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const [generatedMarkdown, setGeneratedMarkdown] = useState("");
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

    setCourse(`Fichier sélectionné: ${file.name}\n\nColle ici l'extrait important du cours pour générer une fiche guidée.`);
    setFileMessage("Fichier sélectionné. Pour PDF/Word, colle l'extrait utile le temps que l'extraction serveur soit activée.");
  }

  async function generateCard() {
    setSaveMessage("");
    const canGenerate = course.trim().length > 20;
    setGenerated(canGenerate);

    if (!canGenerate) {
      setSaveMessage("Ajoute au moins quelques lignes de cours avant de générer.");
      return;
    }

    const summary = `Résumé guidé: ce cours semble tourner autour de ${
      keywords.join(", ") || "notions clés à identifier"
    }. Commence par isoler les définitions, risques, surveillances IDE et points à rechercher toi-même.`;
    let finalSummary = summary;
    let aiNotice = "";

    setGeneratedMarkdown("Génération en cours...");

    try {
      const aiResult = await requestAIGeneration(
        "revision-card",
        `Source: ${selectedFile || "texte collé"}

Cours:
${course}`
      );
      finalSummary = aiResult.markdown;
      aiNotice =
        aiResult.remaining === null
          ? ""
          : `IA utilisée. Il te reste ${aiResult.remaining} génération(s) ce mois-ci.`;
    } catch (error) {
      aiNotice = error instanceof Error ? error.message : "IA indisponible, fiche guidée générée localement.";
    }

    setGeneratedMarkdown(finalSummary);

    try {
      const supabase = createSupabaseBrowserClient();
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) {
        setSaveMessage("Fiche générée. Connecte-toi pour la sauvegarder.");
        return;
      }

      const db = supabase as unknown as GenericInsertClient;
      const { error } = await db.from("revision_cards").insert({
        user_id: user.id,
        title: selectedFile || course.trim().slice(0, 72) || "Fiche de cours",
        summary_markdown: finalSummary,
        flashcards: keywords.map((keyword) => ({ recto: keyword, verso: "À compléter avec ton cours" })),
        quiz: keywords.slice(0, 3).map((keyword) => ({ question: `Explique ${keyword} avec tes mots.`, answer: "À vérifier dans le cours" })),
        mindmap: { center: selectedFile || "Cours importé", branches: keywords }
      });

      setSaveMessage(
        error
          ? "Fiche générée, mais sauvegarde Supabase impossible."
          : [aiNotice, "Fiche sauvegardée dans ton espace."].filter(Boolean).join(" ")
      );
    } catch {
      setSaveMessage("Fiche générée. Sauvegarde indisponible sur cet environnement.");
    }
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
            void generateCard();
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
          {saveMessage ? (
            <p className="mt-3 rounded-lg bg-[var(--surface)] px-3 py-2 text-sm font-semibold text-[var(--muted)]">
              {saveMessage}
            </p>
          ) : null}
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
              <pre className="mt-3 whitespace-pre-wrap text-sm leading-6">
                {generatedMarkdown ||
                  `Ce cours semble tourner autour de: ${keywords.join(", ") || "notions clés à identifier"}. Commence par isoler les définitions, les risques et les surveillances IDE.`}
              </pre>
            </section>
            <section className="grid gap-3 sm:grid-cols-2">
              {["3 idées essentielles", "Questions à te poser", "À chercher toi-même", "Mini quiz"].map((item) => (
                <div key={item} className="rounded-lg border border-[var(--border)] bg-[var(--glass)] p-4">
                  <p className="font-bold">{item}</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                    À compléter avec ton cours puis à vérifier avec ton formateur ou ton tuteur.
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
