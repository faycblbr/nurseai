import { ClipboardCheck } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import { TransmissionWorkspace } from "@/components/features/transmission-workspace";

export default function TransmissionsPage() {
  return (
    <>
      <PageHeader
        title="Transmissions ciblées"
        description="Assistant DAR pour transformer une situation clinique en transmission claire, concise et conforme aux usages de stage."
        action={
          <Button form="transmission-prepare">
            <ClipboardCheck className="h-4 w-4" aria-hidden />
            Préparer
          </Button>
        }
      />
      <TransmissionWorkspace />
    </>
  );
}
