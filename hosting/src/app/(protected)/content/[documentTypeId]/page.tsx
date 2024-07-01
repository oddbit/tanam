"use client";
import {DocumentTypeGenericList} from "@/components/DocumentType/DocumentTypeGenericList";
import Loader from "@/components/common/Loader";
import Notification from "@/components/common/Notification";
import PageHeader from "@/components/common/PageHeader";
import {useTanamDocumentType} from "@/hooks/useTanamDocumentTypes";
import {useTanamDocuments} from "@/hooks/useTanamDocuments";
import {useParams} from "next/navigation";
import {Suspense} from "react";

export default function DocumentTypeDocumentsPage() {
  const {documentTypeId} = useParams<{documentTypeId: string}>() ?? {};
  const {data: documents, error: docsError} = useTanamDocuments(documentTypeId);
  const {data: documentType, error: typesError} = useTanamDocumentType(documentTypeId);

  if (docsError || typesError) {
    return (
      <>
        <PageHeader pageName={documentType?.titleSingular.translated ?? "Document details"} />
        <Notification
          type="error"
          title="Error loading document"
          message={docsError?.message || typesError?.message || "Unknown error"}
        />
      </>
    );
  }

  return (
    <>
      dynamic
      <Suspense fallback={<Loader />}>
        {documentType ? <PageHeader pageName={documentType.titlePlural.translated} /> : <Loader />}
      </Suspense>
      <Suspense fallback={<Loader />}>
        {documentType ? <DocumentTypeGenericList documents={documents} documentType={documentType} /> : <Loader />}
      </Suspense>
    </>
  );
}
