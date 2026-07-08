import { PageHeader } from "@/components/app/page-header";
import { AgendaPlanner } from "@/components/features/agenda-planner";

export default function AgendaPage() {
  return (
    <>
      <PageHeader
        title="Agenda"
        description="Examens, stages, partiels, révisions et notifications pour garder le rythme sans dispersion."
      />
      <AgendaPlanner />
    </>
  );
}
