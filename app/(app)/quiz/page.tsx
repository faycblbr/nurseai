import { PageHeader } from "@/components/app/page-header";
import { QuizTrainer } from "@/components/features/quiz-trainer";

export default function QuizPage() {
  return (
    <>
      <PageHeader
        title="Quiz UE"
        description="QCM, questions ouvertes, classements et statistiques par semestre pour préparer les partiels et rattrapages."
      />
      <QuizTrainer />
    </>
  );
}
