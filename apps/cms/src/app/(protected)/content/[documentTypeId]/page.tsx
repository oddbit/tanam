"use client";
import {UserNotification} from "@tanam/domain-client";
import {Button, DocumentTypeGenericList, Loader, Notification, PageHeader} from "@tanam/ui-components";
import {useParams} from "next/navigation";
import {Suspense, useEffect, useState} from "react";
import {useTanamDocumentType} from "../../../../hooks/useTanamDocumentTypes";
import {useTanamDocuments} from "../../../../hooks/useTanamDocuments";

export default function DocumentTypeDocumentsPage() {
  const {documentTypeId} = useParams<{documentTypeId: string}>() ?? {};
  const {data: documents, error: docsError} = useTanamDocuments(documentTypeId);
  const {data: documentType} = useTanamDocumentType(documentTypeId);
  const [notification, setNotification] = useState<UserNotification | null>(null);

  useEffect(() => {
    setNotification(docsError);
  }, [docsError]);

  const addNewDocument = async () => {
    // Add your code here
  };

  return (
    <>
      <Suspense fallback={<Loader />}>
        {documentType ? (
          <div className="flex items-center gap-4">
            <PageHeader pageName={documentType.titlePlural.translated} />{" "}
            <div className="mb-6">
              <Button
                onClick={addNewDocument}
                title={`Add New ${documentType.titleSingular.translated}`}
                style="rounded"
              />
            </div>
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
