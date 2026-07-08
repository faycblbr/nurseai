"use client";

import { useState } from "react";
import { CalendarDays, Plus } from "lucide-react";
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

  function addEvent() {
    if (!title.trim() || !date) return;
    setEvents((current) => [...current, { title, date, category }]);
    setTitle("");
    setDate("");
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
      <Card className="p-5">
        <h2 className="text-lg font-black">Ajouter une date</h2>
        <div className="mt-4 space-y-3">
          <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Ex: Partiel UE 2.1" />
          <Input value={date} onChange={(event) => setDate(event.target.value)} type="date" />
          <Input value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Révision, stage, partiel..." />
          <Button onClick={addEvent} className="w-full">
            <Plus className="h-4 w-4" aria-hidden />
            Ajouter
          </Button>
        </div>
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
                <Badge>{event.category}</Badge>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
