"use client";

import { useState } from "react";
import { Plus, WandSparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { coreCarePlanSections } from "@/config/navigation";
import { requestAIGeneration } from "@/lib/ai/client";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type InsertBuilder = {
  insert: (payload: Record<string, unknown>) => Promise<{ error: { message: string } | null }>;
};

type GenericInsertClient = {
  from: (table: string) => InsertBuilder;
};

const constantFields = [
  { key: "temperature", label: "Température", placeholder: "Ex: 37,8 °C" },
  { key: "bloodPressure", label: "Tension artérielle", placeholder: "Ex: 135/82 mmHg" },
  { key: "heartRate", label: "Fréquence cardiaque", placeholder: "Ex: 92 bpm" },
  { key: "respiratoryRate", label: "Fréquence respiratoire", placeholder: "Ex: 18/min" },
  { key: "spo2", label: "Saturation", placeholder: "Ex: 96% air ambiant" },
  { key: "pain", label: "Douleur", placeholder: "Ex: EVA 4/10" },
  { key: "glycemia", label: "Glycémie si pertinent", placeholder: "Ex: 1,42 g/L" },
  { key: "diuresis", label: "Diurèse si pertinent", placeholder: "Ex: 800 ml/24h" }
] as const;

const constantGuides = [
  "Douleur + tension + fréquence cardiaque: cherche un lien avec stress, infection, douleur ou hémorragie.",
  "Saturation + fréquence respiratoire: surveille dyspnée, cyanose, encombrement, oxygénothérapie.",
  "Température: pense infection, inflammation, surveillance antibiotique et prélèvements prescrits.",
  "Glycémie: utile si diabète, corticoïdes, malaise, alimentation modifiée ou insuline.",
  "Diurèse: utile en cardio, néphro, post-op, perfusion, diurétiques ou risque de rétention."
];

const treatmentGuides = [
  {
    family: "Anticoagulant",
    indication: "Prévention ou traitement d'un risque thromboembolique",
    monitoring: "Saignements, hématomes, bilan prescrit, interactions, éducation du patient",
    adverseEffect: "Hémorragie"
  },
  {
    family: "Diurétique",
    indication: "Oedèmes, insuffisance cardiaque, hypertension selon contexte",
    monitoring: "Tension, diurèse, poids, ionogramme prescrit, signes de déshydratation",
    adverseEffect: "Déshydratation ou trouble ionique"
  },
  {
    family: "Antalgique",
    indication: "Douleur aiguë ou chronique",
    monitoring: "EVA/EN, efficacité, somnolence, nausées, constipation selon molécule",
    adverseEffect: "Surdosage ou effet sédatif selon traitement"
  },
  {
    family: "Insuline / antidiabétique",
    indication: "Diabète ou déséquilibre glycémique",
    monitoring: "Glycémies capillaires, signes d'hypoglycémie, repas, injection, éducation",
    adverseEffect: "Hypoglycémie"
  }
];

export function CarePlanWorkspace() {
  const [context, setContext] = useState("");
  const [output, setOutput] = useState("");
  const [showConstants, setShowConstants] = useState(false);
  const [showTreatment, setShowTreatment] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [saveMessage, setSaveMessage] = useState("");
  const [constants, setConstants] = useState<Record<string, string>>({});
  const [treatment, setTreatment] = useState({
    name: "",
    family: "",
    indication: "",
    monitoring: "",
    adverseEffect: ""
  });

  const constantsSummary = constantFields
    .map((field) => `${field.label}: ${constants[field.key] || "à renseigner"}`)
    .join("\n");

  const treatmentSummary = `Nom: ${treatment.name || "à renseigner"}
Famille: ${treatment.family || "à rechercher"}
Indication: ${treatment.indication || "à expliquer avec tes mots"}
Surveillance IDE: ${treatment.monitoring || "à déduire"}
Effet indésirable important: ${treatment.adverseEffect || "à vérifier"}`;

  async function generate() {
    setSaveState("idle");
    setSaveMessage("");

    if (context.trim().length < 20) {
      setOutput("Ajoute plus de contexte patient pour générer une démarche exploitable.");
      return;
    }

    const generatedMarkdown = `## Démarche de soins - brouillon pédagogique

### 1. Ce que tu dois d'abord repérer
- Motif d'entrée
- Antécédents importants
- Traitements à risque
- Constantes et signes d'alerte
- Niveau d'autonomie

### 2. Constantes renseignées
${showConstants ? constantsSummary : "Aucune constante ajoutée. Essaie d'abord de renseigner les constantes disponibles."}

### 3. Traitement renseigné
${showTreatment ? treatmentSummary : "Aucun traitement ajouté. Ajoute au moins un traitement fréquent ou à risque si tu en as."}

### 4. Hypothèses à vérifier
- Quels risques sont prioritaires ?
- Quelles surveillances IDE sont justifiées ?
- Quelles informations manquent dans ton recueil ?

### 5. À compléter toi-même
NurseAI ne remplace pas ton raisonnement. Complète les 14 besoins, puis compare avec les propositions guidées.

### Situation analysée
${context}`;

    setOutput("Génération en cours...");
    setSaveState("saving");

    try {
      let finalMarkdown = generatedMarkdown;
      let aiNotice = "";

      try {
        const aiResult = await requestAIGeneration(
          "care-plan",
          `Situation patient anonymisée:
${context}

Constantes:
${showConstants ? constantsSummary : "Non renseignées"}

Traitement:
${showTreatment ? treatmentSummary : "Non renseigné"}

Objectif: produire une démarche de soins guidée, exigeante et adaptée IFSI.`
        );
        finalMarkdown = aiResult.markdown;
        aiNotice =
          aiResult.remaining === null
            ? ""
            : `IA utilisée. Il te reste ${aiResult.remaining} génération(s) ce mois-ci.`;
      } catch (error) {
        aiNotice = error instanceof Error ? error.message : "IA indisponible, brouillon guidé généré localement.";
      }

      setOutput(finalMarkdown);

      const supabase = createSupabaseBrowserClient();
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) {
        setSaveState("error");
        setSaveMessage("Connecte-toi pour sauvegarder cette démarche dans ton espace.");
        return;
      }

      const title = context.trim().slice(0, 72) || "Démarche de soins";
      const db = supabase as unknown as GenericInsertClient;
      const { error } = await db.from("care_plans").insert({
        user_id: user.id,
        title,
        patient_context: context,
        content_markdown: finalMarkdown,
        status: "generated"
      });

      if (error) {
        setSaveState("error");
        setSaveMessage("La démarche est générée, mais la sauvegarde Supabase a échoué. Vérifie les variables et les règles RLS.");
        return;
      }

      setSaveState("saved");
      setSaveMessage([aiNotice, "Démarche sauvegardée dans ton espace."].filter(Boolean).join(" "));
    } catch {
      setSaveState("error");
      setSaveMessage("La démarche est générée, mais la sauvegarde n'est pas disponible sur cet environnement.");
    }
  }

  return (
    <section className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
      <Card className="p-5">
        <h2 className="text-lg font-semibold">Situation patient anonymisée</h2>
        <form
          id="care-plan-generate"
          onSubmit={(event) => {
            event.preventDefault();
            generate();
          }}
        >
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-800">
            Ne mets jamais de nom, prénom, date de naissance, adresse ou numéro patient. Décris uniquement une situation anonymisée.
          </div>
          <Textarea
            className="mt-4"
            value={context}
            onChange={(event) => setContext(event.target.value)}
            placeholder="Ex: patient de 78 ans, entrée pour décompensation cardiaque. Ne mets jamais de nom, prénom, date de naissance ou adresse."
          />
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowConstants(true)}
            >
              <Plus className="h-4 w-4" aria-hidden />
              Ajouter constantes
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowTreatment(true)}
            >
              <Plus className="h-4 w-4" aria-hidden />
              Ajouter traitements
            </Button>
          </div>
          {showConstants ? (
            <div className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--glass)] p-4">
              <h3 className="font-black">Constantes</h3>
              <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
                Renseigne ce que tu as. Puis demande-toi: qu&apos;est-ce qui est anormal, prioritaire ou à surveiller ?
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {constantFields.map((field) => (
                  <label key={field.key} className="text-sm font-semibold">
                    {field.label}
                    <Input
                      className="mt-1"
                      value={constants[field.key] || ""}
                      onChange={(event) =>
                        setConstants((current) => ({ ...current, [field.key]: event.target.value }))
                      }
                      placeholder={field.placeholder}
                    />
                  </label>
                ))}
              </div>
              <div className="mt-4 rounded-lg bg-[var(--surface)] p-3 text-sm leading-6 text-[var(--muted)]">
                Guide: repère les constantes hors normes, relie-les au motif d&apos;hospitalisation, puis propose une fréquence de surveillance.
              </div>
              <div className="mt-3 grid gap-2">
                {constantGuides.map((guide) => (
                  <div key={guide} className="rounded-lg border border-[var(--border)] bg-[var(--glass-strong)] px-3 py-2 text-sm leading-6 text-[var(--muted)]">
                    {guide}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
          {showTreatment ? (
            <div className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--glass)] p-4">
              <h3 className="font-black">Traitement</h3>
              <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
                L&apos;app ne te donne pas directement la réponse: essaie d&apos;abord de retrouver la famille et la surveillance.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Input value={treatment.name} onChange={(event) => setTreatment((current) => ({ ...current, name: event.target.value }))} placeholder="Nom du traitement" />
                <Input value={treatment.family} onChange={(event) => setTreatment((current) => ({ ...current, family: event.target.value }))} placeholder="Famille / classe" />
                <Input value={treatment.indication} onChange={(event) => setTreatment((current) => ({ ...current, indication: event.target.value }))} placeholder="Pourquoi ce patient l'a ?" />
                <Input value={treatment.monitoring} onChange={(event) => setTreatment((current) => ({ ...current, monitoring: event.target.value }))} placeholder="Surveillance IDE" />
                <Input className="sm:col-span-2" value={treatment.adverseEffect} onChange={(event) => setTreatment((current) => ({ ...current, adverseEffect: event.target.value }))} placeholder="Effet indésirable important à connaître" />
              </div>
              <div className="mt-4 rounded-lg bg-[var(--surface)] p-3 text-sm leading-6 text-[var(--muted)]">
                Guide: si tu bloques, cherche la famille dans ton cours ou une source fiable, puis reviens compléter la surveillance.
              </div>
              <div className="mt-3 grid gap-2">
                {treatmentGuides.map((guide) => (
                  <button
                    key={guide.family}
                    className="rounded-lg border border-[var(--border)] bg-[var(--glass-strong)] px-3 py-2 text-left text-sm leading-6 transition hover:border-[var(--primary)] hover:bg-[var(--surface)]"
                    type="button"
                    onClick={() =>
                      setTreatment((current) => ({
                        ...current,
                        family: current.family || guide.family,
                        indication: current.indication || guide.indication,
                        monitoring: current.monitoring || guide.monitoring,
                        adverseEffect: current.adverseEffect || guide.adverseEffect
                      }))
                    }
                  >
                    <span className="font-black">{guide.family}</span>
                    <span className="block text-[var(--muted)]">{guide.monitoring}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : null}
          <Button className="mt-4 w-full" type="submit">
            <WandSparkles className="h-4 w-4" aria-hidden />
            Générer le brouillon
          </Button>
          {saveMessage ? (
            <p
              className={`mt-3 rounded-lg px-3 py-2 text-sm font-semibold ${
                saveState === "saved"
                  ? "bg-[var(--mint)] text-[var(--mint-strong)]"
                  : "bg-[var(--peach)] text-[var(--peach-strong)]"
              }`}
            >
              {saveMessage}
            </p>
          ) : saveState === "saving" ? (
            <p className="mt-3 rounded-lg bg-[var(--surface)] px-3 py-2 text-sm font-semibold text-[var(--muted)]">
              Sauvegarde en cours...
            </p>
          ) : null}
        </form>
      </Card>
      <Card className="p-5">
        <h2 className="text-lg font-semibold">Structure IFSI attendue</h2>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {coreCarePlanSections.map((section) => (
            <div key={section} className="rounded-lg bg-[var(--surface)] px-3 py-2 text-sm">
              {section}
            </div>
          ))}
        </div>
        {output ? (
          <pre className="mt-5 max-h-96 whitespace-pre-wrap rounded-lg border border-[var(--border)] bg-[var(--glass)] p-4 text-sm leading-6">
            {output}
          </pre>
        ) : null}
      </Card>
    </section>
  );
}
