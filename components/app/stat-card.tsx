import { type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

type StatCardProps = {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  tone?: "blue" | "green" | "peach" | "violet";
};

const tones = {
  blue: "bg-[var(--surface)] text-[var(--primary)]",
  green: "bg-[var(--mint)] text-[var(--mint-strong)]",
  peach: "bg-[var(--peach)] text-[var(--peach-strong)]",
  violet: "bg-[var(--violet)] text-[var(--violet-strong)]"
};

export function StatCard({ label, value, detail, icon: Icon, tone = "blue" }: StatCardProps) {
  return (
    <Card className="p-5 transition hover:-translate-y-0.5 hover:shadow-xl">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--muted)]">{label}</p>
          <p className="mt-2 text-3xl font-black tracking-normal text-[var(--foreground)]">{value}</p>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${tones[tone]}`}>
          <Icon className="h-5 w-5" aria-hidden />
        </div>
      </div>
      <p className="mt-4 text-sm leading-5 text-[var(--muted)]">{detail}</p>
    </Card>
  );
}
