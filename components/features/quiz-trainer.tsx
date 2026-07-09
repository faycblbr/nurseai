"use client";

import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getPremiumLockMessage, usePremium } from "@/components/billing/premium-provider";

const questions = [
  {
    semester: "S1",
    prompt: "Quel est le rôle principal de l'insuline ?",
    choices: ["Augmenter la glycémie", "Faire baisser la glycémie", "Fluidifier le sang"],
    answer: 1,
    explanation: "L'insuline favorise l'entrée du glucose dans les cellules et diminue la glycémie."
  },
  {
    semester: "S2",
    prompt: "Avant une injection sous-cutanée, quel réflexe est prioritaire ?",
    choices: ["Vérifier prescription, patient, produit, dose, voie", "Masser fortement", "Faire boire le patient"],
    answer: 0,
    explanation: "Les vérifications sécuritaires sont prioritaires avant tout soin médicamenteux."
  },
  {
    semester: "Stage",
    prompt: "En cardiologie, quelle surveillance est fréquente avec les diurétiques ?",
    choices: ["Taille des cheveux", "Diurèse, tension, ionogramme selon prescription", "Couleur des yeux"],
    answer: 1,
    explanation: "Les diurétiques exposent à des variations tensionnelles, hydro-électrolytiques et de diurèse."
  }
];

export function QuizTrainer() {
  const premium = usePremium();
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const question = questions[current];
  const isAnswered = selected !== null;

  function next() {
    if (!premium.active) {
      setMessage(getPremiumLockMessage("enchaîner les quiz d'entraînement"));
      return;
    }

    setCurrent((value) => (value + 1) % questions.length);
    setSelected(null);
    setMessage("");
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[0.75fr_1.25fr]">
      <Card className="p-5">
        <h2 className="text-lg font-black">Parcours quiz</h2>
        <div className="mt-4 space-y-2">
          {questions.map((item, index) => (
            <button
              key={item.prompt}
              onClick={() => {
                if (!premium.active) {
                  setMessage(getPremiumLockMessage("changer de parcours quiz"));
                  return;
                }
                setCurrent(index);
                setSelected(null);
                setMessage("");
              }}
              className={`w-full rounded-lg border px-3 py-3 text-left text-sm font-semibold ${
                index === current ? "border-[var(--primary)] bg-[var(--surface)]" : "border-[var(--border)] bg-[var(--glass)]"
              }`}
            >
              <Badge>{item.semester}</Badge>
              <p className="mt-2">{item.prompt}</p>
            </button>
          ))}
        </div>
      </Card>
      <Card className="p-5">
        <Badge>{question.semester}</Badge>
        <h2 className="mt-4 text-xl font-black">{question.prompt}</h2>
        <div className="mt-5 space-y-3">
          {question.choices.map((choice, index) => {
            const correct = isAnswered && index === question.answer;
            const wrong = selected === index && selected !== question.answer;
            return (
              <button
                key={choice}
                onClick={() => {
                  if (!premium.active) {
                    setMessage(getPremiumLockMessage("répondre aux quiz"));
                    return;
                  }
                  setSelected(index);
                  setMessage("");
                }}
                className={`flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left font-semibold ${
                  correct
                    ? "border-green-200 bg-green-50"
                    : wrong
                      ? "border-red-200 bg-red-50"
                      : "border-[var(--border)] bg-[var(--glass)]"
                }`}
              >
                {choice}
                {correct ? <CheckCircle2 className="h-5 w-5 text-green-600" aria-hidden /> : null}
                {wrong ? <XCircle className="h-5 w-5 text-red-600" aria-hidden /> : null}
              </button>
            );
          })}
        </div>
        {isAnswered ? (
          <div className="mt-5 rounded-lg bg-[var(--surface)] p-4 text-sm leading-6 text-[var(--muted)]">
            {question.explanation}
          </div>
        ) : null}
        {message ? (
          <p className="mt-4 rounded-lg bg-[var(--surface)] px-3 py-2 text-sm font-semibold text-[var(--muted)]">
            {message}
          </p>
        ) : null}
        <Button className="mt-5" onClick={next}>Question suivante</Button>
      </Card>
    </div>
  );
}
