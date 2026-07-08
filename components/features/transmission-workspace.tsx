"use client";

import { useState } from "react";
import { ClipboardCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function TransmissionWorkspace() {
  const [target, setTarget] = useState("");
  const [service, setService] = useState("");
  const [urgency, setUrgency] = useState("");
  const [situation, setSituation] = useState("");
  const [output, setOutput] = useState("");

  function prepare() {
    if (!situation.trim()) {
      setOutput("Décris la situation avant de préparer une transmission.");
      return;
    }

    setOutput(`## Transmission ciblée DAR

**Cible :** ${target || "à préciser"}

**Données :**
${situation}

**Actions :**
- Actions IDE réalisées à compléter
- Prévenir IDE/tuteur si signe d'alerte
- Surveillances adaptées au contexte ${service ? `(${service})` : ""}

**Résultats :**
- Évolution clinique à renseigner
- Réévaluation selon urgence ${urgency || "à préciser"}`);
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
        <pre className="mt-5 whitespace-pre-wrap rounded-lg border border-[var(--border)] bg-[var(--glass)] p-4 text-sm leading-6">
          {output}
        </pre>
      ) : null}
    </Card>
  );
}
