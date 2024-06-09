"use client";
import {DocumentTypeGenericList} from "@/components/DocumentType/DocumentTypeGenericList";
import Loader from "@/components/common/Loader";
import Notification from "@/components/common/Notification";
import PageHeader from "@/components/common/PageHeader";
import {useTanamDocumentType} from "@/hooks/useTanamDocumentTypes";
import {useTanamDocuments} from "@/hooks/useTanamDocuments";
import {Suspense} from "react";
import {useParams} from "next/navigation";

export default function DocumentTypeDocumentsPage() {
  const {documentTypeId} = useParams<{documentTypeId: string}>() ?? {};
  const {data: documents, error: docsError} = useTanamDocuments(documentTypeId);
  const {data: documentType} = useTanamDocumentType(documentTypeId);

  return (
    <>
      <Suspense fallback={<Loader />}>
        {documentType ? <PageHeader pageName={documentType.titlePlural.translated} /> : <Loader />}
      </Suspense>
      {docsError && <Notification type="error" title="Error fetching documents" message={docsError.message} />}
      <Suspense fallback={<Loader />}>
        <DocumentTypeGenericList documents={documents} />
      </Suspense>
    </>
  );
}
