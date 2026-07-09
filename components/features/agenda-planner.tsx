"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type AgendaEvent = {
  title: string;
  date: string;
  category: string;
};

export function AgendaPlanner() {
  const [events, setEvents] = useState<AgendaEvent[]>([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("Révision");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const savedEvents = window.localStorage.getItem("nurseai-agenda");
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents) as AgendaEvent[]);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("nurseai-agenda", JSON.stringify(events));
  }, [events]);

  function addEvent() {
    if (!title.trim() || !date) {
      setMessage("Ajoute un titre et une date.");
      return;
    }
    setEvents((current) => [...current, { title, date, category }]);
    setTitle("");
    setDate("");
    setMessage("Date ajoutée à ton agenda.");
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
      <Card className="p-5">
        <h2 className="text-lg font-black">Ajouter une date</h2>
        <form
          className="mt-4 space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            addEvent();
          }}
        >
          <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Ex: Partiel UE 2.1" />
          <Input value={date} onChange={(event) => setDate(event.target.value)} type="date" />
          <Input value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Révision, stage, partiel..." />
          <Button type="submit" className="w-full">
            <Plus className="h-4 w-4" aria-hidden />
            Ajouter
          </Button>
          {message ? (
            <p className="rounded-lg bg-[var(--surface)] px-3 py-2 text-sm font-semibold text-[var(--muted)]">
              {message}
            </p>
          ) : null}
        </form>
      </Card>
      <Card className="p-5">
        <h2 className="text-lg font-black">À venir</h2>
        <div className="mt-4 space-y-3">
          {events.length === 0 ? (
            <div className="rounded-lg border border-dashed border-[var(--border)] p-6 text-center">
              <CalendarDays className="mx-auto h-8 w-8 text-[var(--muted)]" aria-hidden />
              <p className="mt-3 text-sm text-[var(--muted)]">Aucune date pour le moment.</p>
            </div>
          ) : (
            events.map((event) => (
              <div key={`${event.title}-${event.date}`} className="flex items-center justify-between rounded-lg bg-[var(--surface)] p-3">
                <div>
                  <p className="text-sm font-bold">{event.title}</p>
                  <p className="text-xs text-[var(--muted)]">{event.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge>{event.category}</Badge>
                  <button
                    type="button"
                    onClick={() => setEvents((current) => current.filter((item) => item !== event))}
                    className="grid h-8 w-8 place-items-center rounded-lg text-[var(--muted)] transition hover:bg-[var(--card)] hover:text-[var(--danger)]"
                    aria-label="Supprimer la date"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
