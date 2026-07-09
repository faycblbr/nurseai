import { PageHeader } from "@/components/app/page-header";
import { LibraryBrowser } from "@/components/features/library-browser";

type LibraryPageProps = {
  searchParams?: Promise<{ q?: string }>;
};

export default async function LibraryPage({ searchParams }: LibraryPageProps) {
  const params = await searchParams;

  return (
    <>
      <PageHeader
        title="Bibliothèque"
        description="Tous les documents générés ou importés, avec recherche, filtres, favoris et exports."
      />
      <LibraryBrowser initialQuery={params?.q ?? ""} />
    </>
  );
}
