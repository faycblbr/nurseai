"use client";

import { useState } from "react";
import { BookOpen, HeartPulse, Pill, Stethoscope } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const services = {
  Cardiologie: {
    organes: ["Schéma du cœur", "Circulation pulmonaire", "Conduction électrique"],
    medicaments: ["Diurétiques", "Bêtabloquants", "Anticoagulants"],
    pathologies: ["Insuffisance cardiaque", "SCA", "Troubles du rythme"],
    gestes: ["ECG", "Surveillance TA/FC", "Bilan entrées-sorties"]
  },
  Gériatrie: {
    organes: ["Vieillissement physiologique", "Risque de chute", "Nutrition"],
    medicaments: ["Antalgiques", "Psychotropes", "Antihypertenseurs"],
    pathologies: ["Démence", "Déshydratation", "Syndrome confusionnel"],
    gestes: ["Aide à la toilette", "Évaluation douleur", "Prévention escarres"]
  },
  Pneumologie: {
    organes: ["Poumons", "Échanges gazeux", "Saturation"],
    medicaments: ["Bronchodilatateurs", "Corticoïdes", "Antibiotiques"],
    pathologies: ["BPCO", "Pneumonie", "Asthme"],
    gestes: ["Aérosol", "Oxygénothérapie", "Surveillance FR/SpO2"]
  }
};

export function StagePrep() {
  const [service, setService] = useState<keyof typeof services>("Cardiologie");
  const [stageName, setStageName] = useState("");
  const [personalStages, setPersonalStages] = useState<string[]>([]);
  const data = services[service];

  function addStage() {
    if (!stageName.trim()) return;
    setPersonalStages((current) => [...current, stageName.trim()]);
    setStageName("");
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[0.7fr_1.3fr]">
      <Card className="p-5">
        <h2 className="text-lg font-black">Choisir un service</h2>
        <div className="mt-4 space-y-2">
          {Object.keys(services).map((item) => (
            <button
              key={item}
              onClick={() => setService(item as keyof typeof services)}
              className={`w-full rounded-lg border px-4 py-3 text-left text-sm font-bold ${
                item === service ? "border-[var(--primary)] bg-[var(--surface)]" : "border-[var(--border)] bg-[var(--glass)]"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
        <form
          id="stage-add"
          onSubmit={(event) => {
            event.preventDefault();
            addStage();
          }}
          className="mt-5 space-y-3 rounded-lg bg-[var(--surface)] p-3"
        >
          <Input value={stageName} onChange={(event) => setStageName(event.target.value)} placeholder="Ex: Stage cardiologie S2" />
          <Button type="submit" className="w-full">Ajouter le stage</Button>
        </form>
        {personalStages.length > 0 ? (
          <div className="mt-4 space-y-2">
            {personalStages.map((stage) => (
              <div key={stage} className="rounded-lg border border-[var(--border)] bg-[var(--glass)] px-3 py-2 text-sm font-semibold">
                {stage}
              </div>
            ))}
          </div>
        ) : null}
      </Card>
      <div className="grid gap-4 md:grid-cols-2">
        {[
          { title: "Schémas à revoir", icon: BookOpen, values: data.organes },
          { title: "Médicaments fréquents", icon: Pill, values: data.medicaments },
          { title: "Pathologies", icon: HeartPulse, values: data.pathologies },
          { title: "Gestes et surveillances", icon: Stethoscope, values: data.gestes }
        ].map((block) => {
          const Icon = block.icon;
          return (
            <Card key={block.title} className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--surface)] text-[var(--primary)]">
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <h3 className="font-black">{block.title}</h3>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {block.values.map((value) => (
                  <Badge key={value}>{value}</Badge>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
