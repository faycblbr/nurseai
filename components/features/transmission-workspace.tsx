"use client";

import { useState } from "react";
import { ClipboardCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { requestAIGeneration } from "@/lib/ai/client";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { getPremiumLockMessage, usePremium } from "@/components/billing/premium-provider";

type InsertBuilder = {
  insert: (payload: Record<string, unknown>) => Promise<{ error: { message: string } | null }>;
};

type GenericInsertClient = {
  from: (table: string) => InsertBuilder;
};

export function TransmissionWorkspace() {
  const premium = usePremium();
  const [target, setTarget] = useState("");
  const [service, setService] = useState("");
  const [urgency, setUrgency] = useState("");
  const [situation, setSituation] = useState("");
  const [output, setOutput] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  async function prepare() {
    setSaveMessage("");

    if (!premium.active) {
      setOutput(getPremiumLockMessage("préparer et sauvegarder une transmission ciblée"));
      setSaveMessage("Active l'essai gratuit pour débloquer les transmissions IA.");
      return;
    }

    if (!situation.trim()) {
      setOutput("Décris la situation avant de préparer une transmission.");
      return;
    }

    const dataMarkdown = `**Données :**
${situation}`;
    const actionsMarkdown = `**Actions :**
- Actions IDE réalisées à compléter
- Prévenir IDE/tuteur si signe d'alerte
- Surveillances adaptées au contexte ${service ? `(${service})` : ""}`;
    const resultsMarkdown = `**Résultats :**
- Évolution clinique à renseigner
- Réévaluation selon urgence ${urgency || "à préciser"}`;
    const generatedMarkdown = `## Transmission ciblée DAR

**Cible :** ${target || "à préciser"}

${dataMarkdown}

${actionsMarkdown}

${resultsMarkdown}`;

    setOutput("Préparation en cours...");

    let finalMarkdown = generatedMarkdown;
    let aiNotice = "";

    try {
      const aiResult = await requestAIGeneration(
        "targeted-transmission",
        `Cible pressentie: ${target || "à déterminer"}
Service/contexte: ${service || "non précisé"}
Urgence: ${urgency || "à préciser"}

Situation anonymisée:
${situation}`
      );
      finalMarkdown = aiResult.markdown;
      aiNotice =
        aiResult.remaining === null
          ? ""
          : `IA utilisée. Il te reste ${aiResult.remaining} génération(s) ce mois-ci.`;
    } catch (error) {
      aiNotice = error instanceof Error ? error.message : "IA indisponible, transmission guidée générée localement.";
    }

    setOutput(finalMarkdown);

    try {
      const supabase = createSupabaseBrowserClient();
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) {
        setSaveMessage("Connecte-toi pour sauvegarder cette transmission.");
        return;
      }

      const db = supabase as unknown as GenericInsertClient;
      const { error } = await db.from("transmissions").insert({
        user_id: user.id,
        title: target || "Transmission ciblée",
        situation,
        target: target || null,
        data_markdown: finalMarkdown.includes("**Données") ? dataMarkdown : finalMarkdown,
        actions_markdown: actionsMarkdown,
        results_markdown: resultsMarkdown,
        status: "generated"
      });

      setSaveMessage(
        error
          ? "Transmission générée, mais sauvegarde Supabase impossible."
          : [aiNotice, "Transmission sauvegardée."].filter(Boolean).join(" ")
      );
    } catch {
      setSaveMessage("Transmission générée. Sauvegarde indisponible sur cet environnement.");
    }
  }

  return (
    <Card className="p-5">
      <form
        id="transmission-prepare"
        onSubmit={(event) => {
          event.preventDefault();
          prepare();
        }}
      >
        <div className="grid gap-4 lg:grid-cols-3">
          <Input value={target} onChange={(event) => setTarget(event.target.value)} placeholder="Cible pressentie: douleur, chute, anxiété..." />
          <Input value={service} onChange={(event) => setService(event.target.value)} placeholder="Service ou contexte" />
          <Input value={urgency} onChange={(event) => setUrgency(event.target.value)} placeholder="Niveau d'urgence" />
        </div>
        <Textarea
          className="mt-4"
          value={situation}
          onChange={(event) => setSituation(event.target.value)}
          placeholder="Décris les données observées, les actions menées et les résultats..."
        />
        <Button className="mt-4" type="submit">
          <ClipboardCheck className="h-4 w-4" aria-hidden />
          Préparer la transmission
        </Button>
      </form>
      {output ? (
        <>
          {saveMessage ? (
            <p className="mt-4 rounded-lg bg-[var(--surface)] px-3 py-2 text-sm font-semibold text-[var(--muted)]">
              {saveMessage}
            </p>
          ) : null}
          <pre className="mt-5 whitespace-pre-wrap rounded-lg border border-[var(--border)] bg-[var(--glass)] p-4 text-sm leading-6">
            {output}
          </pre>
        </>
      ) : null}
    </Card>
  );
}
