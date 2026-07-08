import { WandSparkles } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import { CarePlanWorkspace } from "@/components/features/care-plan-workspace";

export default function CarePlansPage() {
  return (
    <>
      <PageHeader
        eyebrow="Fonctionnalité coeur"
        title="Générateur de démarche de soins"
        description="Décris le patient, le contexte de stage et les attentes IFSI. La couche IA produira un document structuré, éditable et exportable."
        action={
          <Button form="care-plan-generate">
            <WandSparkles className="h-4 w-4" aria-hidden />
            Générer
          </Button>
        }
      />
      <CarePlanWorkspace />
    </>
  );
}
