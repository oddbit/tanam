"use client";
import {DocumentTypeGenericList} from "@/components/DocumentType/DocumentTypeGenericList";
import {Button} from "@/components/Button";
import Loader from "@/components/common/Loader";
import PageHeader from "@/components/common/PageHeader";
import {ErrorPage} from '@/components/Error/ErrorPage';
import {useTanamDocumentType} from "@/hooks/useTanamDocumentTypes";
import {useTanamDocuments} from "@/hooks/useTanamDocuments";
import {useParams, useRouter} from "next/navigation";
import {Suspense} from "react";

export default function DocumentTypeDocumentsPage() {
  const router = useRouter();
  const {documentTypeId} = useParams<{documentTypeId: string}>() ?? {};
  const {data: documents, error: docsError} = useTanamDocuments(documentTypeId);
  const {data: documentType, error: typesError} = useTanamDocumentType(documentTypeId);

  const handleCreateNewDocumentType = () => {
    router.push(`/content/${documentTypeId}/create`);
  };

  const pageActions = [
    <Button key="createNewDocument" onClick={handleCreateNewDocumentType} title={`Create New ${documentType?.titleSingular.translated ?? "Document"}`} />
  ]

  if (docsError || typesError) {
    return (
      <>
        <ErrorPage 
          pageName={documentType?.titleSingular.translated ?? "Document details"}
          notificationType="error"
          notificationTitle="Error loading document"
          notificationMessage={docsError?.message || typesError?.message || "Unknown error"}
        />
      </>
    );
  }

  return (
    <>
      <Suspense fallback={<Loader />}>
        {documentType ? <PageHeader pageName={documentType.titlePlural.translated} pageActions={pageActions} /> : <Loader />}
      </Suspense>
      <Suspense fallback={<Loader />}>
        {documentType ? <DocumentTypeGenericList documents={documents} documentType={documentType} /> : <Loader />}
      </Suspense>
    </>
  );
}
