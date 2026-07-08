import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import { StagePrep } from "@/components/features/stage-prep";

export default function StagesPage() {
  return (
    <>
      <PageHeader
        title="Stages et portfolio"
        description="Préparation par service: schémas, médicaments, pathologies, gestes techniques et objectifs de stage."
        action={<Button form="stage-add">Ajouter un stage</Button>}
      />
      <StagePrep />
    </>
  );
}
