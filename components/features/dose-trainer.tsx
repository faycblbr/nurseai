"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, RotateCcw, Timer, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const exercises = [
  {
    type: "Débit",
    statement: "Préparer 500 ml de NaCl à passer en 8 heures. Calcule le débit en ml/h.",
    answer: 62.5,
    unit: "ml/h",
    explanation: "Débit = volume / temps = 500 / 8 = 62,5 ml/h."
  },
  {
    type: "Gouttes/min",
    statement: "Perfusion de 250 ml sur 4 heures avec tubulure 20 gouttes/ml. Calcule les gouttes/min.",
    answer: 21,
    unit: "gouttes/min",
    explanation: "250 x 20 = 5000 gouttes. 4 h = 240 min. 5000 / 240 = 20,8, donc 21 gouttes/min."
  },
  {
    type: "Dilution",
    statement: "Tu dois administrer 750 mg. Le flacon contient 1 g dans 10 ml. Quel volume prélever ?",
    answer: 7.5,
    unit: "ml",
    explanation: "1 g = 1000 mg pour 10 ml. 750 mg correspond à 7,5 ml."
  }
];

export function DoseTrainer() {
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const [message, setMessage] = useState("");

  const exercise = exercises[index];
  const progress = useMemo(() => `${index + 1}/${exercises.length}`, [index]);

  function checkAnswer() {
    setMessage("");
    if (!answer.trim()) {
      setResult(null);
      setMessage("Entre une réponse avant de corriger.");
      return;
    }

    const normalized = Number(answer.replace(",", "."));
    if (Number.isNaN(normalized)) {
      setResult(null);
      setMessage("Utilise uniquement un nombre, par exemple 62,5.");
      return;
    }

    const nextResult = Math.abs(normalized - exercise.answer) < 0.2 ? "correct" : "wrong";
    setResult(nextResult);

    const attempt = {
      statement: exercise.statement,
      answer: normalized,
      expected: exercise.answer,
      correct: nextResult === "correct",
      createdAt: new Date().toISOString()
    };
    const savedAttempts = window.localStorage.getItem("nurseai-dose-attempts");
    const attempts = savedAttempts ? (JSON.parse(savedAttempts) as typeof attempt[]) : [];
    window.localStorage.setItem("nurseai-dose-attempts", JSON.stringify([attempt, ...attempts].slice(0, 30)));
  }

  function nextExercise() {
    setIndex((current) => (current + 1) % exercises.length);
    setAnswer("");
    setResult(null);
    setMessage("");
  }

  return (
    <section className="grid gap-4 lg:grid-cols-[0.75fr_1.25fr]">
      <Card className="p-5">
        <h2 className="text-lg font-semibold">Types d&apos;exercices</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {["Calcul simple", "Perfusion", "Débit", "Gouttes/min", "Dilution", "Concentration", "Pédiatrie", "Insuline"].map(
            (type) => (
              <Badge key={type}>{type}</Badge>
            )
          )}
        </div>
        <div className="mt-6 rounded-lg bg-[var(--surface)] p-4">
          <p className="text-sm font-bold">Mode pédagogique</p>
          <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
            L&apos;objectif est de comprendre le raisonnement, pas seulement obtenir la réponse.
          </p>
        </div>
      </Card>
      <Card className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Session active</h2>
            <p className="text-sm text-[var(--muted)]">{exercise.type} · exercice {progress}</p>
          </div>
          <Badge>
            <Timer className="mr-1 h-3 w-3" aria-hidden />
            Entraînement
          </Badge>
        </div>
        <p className="mt-5 text-base leading-7 text-[var(--foreground)]">{exercise.statement}</p>
        <form
          id="dose-trainer"
          onSubmit={(event) => {
            event.preventDefault();
            checkAnswer();
          }}
          className="mt-5 flex flex-col gap-3 sm:flex-row"
        >
          <Input value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder={`Réponse en ${exercise.unit}`} />
          <Button type="submit">Corriger</Button>
          <Button type="button" variant="secondary" onClick={nextExercise}>
            <RotateCcw className="h-4 w-4" aria-hidden />
            Suivant
          </Button>
        </form>
        {message ? (
          <p className="mt-4 rounded-lg bg-[var(--surface)] px-3 py-2 text-sm font-semibold text-[var(--muted)]">
            {message}
          </p>
        ) : null}
        {result ? (
          <div
            className={`mt-5 rounded-lg border p-4 ${
              result === "correct" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
            }`}
          >
            <div className="flex items-center gap-2 font-bold">
              {result === "correct" ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" aria-hidden />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" aria-hidden />
              )}
              {result === "correct" ? "Bonne réponse" : `Réponse attendue : ${exercise.answer} ${exercise.unit}`}
            </div>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{exercise.explanation}</p>
          </div>
        ) : null}
      </Card>
    </section>
  );
}
