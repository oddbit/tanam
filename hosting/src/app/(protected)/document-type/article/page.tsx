"use client";
import Loader from "@/components/common/Loader";
import Notification from "@/components/common/Notification";
import PageHeader from "@/components/common/PageHeader";
import {useTanamDocumentType} from "@/hooks/useTanamDocumentTypes";
import {useTanamDocuments} from "@/hooks/useTanamDocuments";
import {Suspense} from "react";
import {DocumentTypeGenericList} from "../../../../components/DocumentType/DocumentTypeGenericList";

export default function DocumentTypeDocumentsPage() {
  const {data: documentType} = useTanamDocumentType("article");
  const {data: documents, error: docsError} = useTanamDocuments("article");

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
