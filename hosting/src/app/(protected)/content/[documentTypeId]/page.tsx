"use client";
import {DocumentTypeGenericList} from "@/components/DocumentType/DocumentTypeGenericList";
import Loader from "@/components/common/Loader";
import Notification from "@/components/common/Notification";
import PageHeader from "@/components/common/PageHeader";
import {useTanamDocumentType} from "@/hooks/useTanamDocumentTypes";
import {useTanamDocuments} from "@/hooks/useTanamDocuments";
import {UserNotification} from "@/models/UserNotification";
import {useParams} from "next/navigation";
import {Suspense, useEffect, useState} from "react";

export default function DocumentTypeDocumentsPage() {
  const {documentTypeId} = useParams<{documentTypeId: string}>() ?? {};
  const {data: documents, error: docsError} = useTanamDocuments(documentTypeId);
  const {data: documentType} = useTanamDocumentType(documentTypeId);
  const [notification, setNotification] = useState<UserNotification | null>(null);

  useEffect(() => {
    setNotification(docsError);
  }, [docsError]);

  return (
    <>
      dynamic
      <Suspense fallback={<Loader />}>
        {documentType ? <PageHeader pageName={documentType.titlePlural.translated} /> : <Loader />}
      </Suspense>
      {notification && (
        <Notification type={notification.type} title={notification.title} message={notification.message} />
      )}
      {docsError && <Notification type="error" title="Error fetching documents" message={docsError.message} />}
      <Suspense fallback={<Loader />}>
        {documentType ? <DocumentTypeGenericList documents={documents} documentType={documentType} /> : <Loader />}
      </Suspense>
    </>
  );
}
