import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import { DoseTrainer } from "@/components/features/dose-trainer";

export default function DoseCalculationsPage() {
  return (
    <>
      <PageHeader
        title="Calculs de doses"
        description="Entraînement et mode examen avec chronomètre, correction automatique et explications pédagogiques détaillées."
        action={<Button form="dose-trainer">Mode examen</Button>}
      />
      <DoseTrainer />
    </>
  );
}
