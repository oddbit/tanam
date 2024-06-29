"use client";
import {DocumentTypeGenericList} from "@/components/DocumentType/DocumentTypeGenericList";
import Loader from "@/components/common/Loader";
import Notification from "@/components/common/Notification";
import PageHeader from "@/components/common/PageHeader";
import {useTanamDocumentType} from "@/hooks/useTanamDocumentTypes";
import {useTanamDocuments} from "@/hooks/useTanamDocuments";
import {Suspense, useEffect, useState} from "react";
import {useParams} from "next/navigation";
import {UserNotification} from "@/models/UserNotification";

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
      <Suspense fallback={<Loader />}>
        {documentType ? (
          <div className="flex items-center">
            <PageHeader pageName={documentType.titlePlural.translated} />{" "}
            <button
              type="button"
              className="ml-4 mb-6 inline-flex items-center justify-center rounded-md bg-primary px-2 py-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-2 xl:px-2"
            >
              Add new {documentType.titleSingular.translated}
            </button>
          </div>
        ) : (
          <Loader />
        )}
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
