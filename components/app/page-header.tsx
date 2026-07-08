import { type ReactNode } from "react";
import { Badge } from "@/components/ui/badge";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description: string;
  action?: ReactNode;
};

export function PageHeader({ eyebrow, title, description, action }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-3xl">
        {eyebrow ? <Badge className="mb-3">{eyebrow}</Badge> : null}
        <h1 className="text-2xl font-semibold tracking-normal text-[var(--foreground)] sm:text-3xl">
          {title}
        </h1>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)] sm:text-base">
          {description}
        </p>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
