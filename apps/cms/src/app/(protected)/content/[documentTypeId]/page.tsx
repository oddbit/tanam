"use client";
import { Button } from "@tanam/cms/components/Button";
import { DocumentTypeGenericList } from "@tanam/cms/components/DocumentType/DocumentTypeGenericList";
import Loader from "@tanam/cms/components/common/Loader";
import Notification from "@tanam/cms/components/common/Notification";
import PageHeader from "@tanam/cms/components/common/PageHeader";
import { useTanamDocumentType } from "@tanam/cms/hooks/useTanamDocumentTypes";
import { useTanamDocuments } from "@tanam/cms/hooks/useTanamDocuments";
import { UserNotification } from "@tanam/cms/models/UserNotification";
import { useParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

export default function DocumentTypeDocumentsPage() {
  const {documentTypeId} = useParams<{documentTypeId: string}>() ?? {};
  const {data: documents, error: docsError} = useTanamDocuments(documentTypeId);
  const {data: documentType} = useTanamDocumentType(documentTypeId);
  const [notification, setNotification] = useState<UserNotification | null>(null);

  useEffect(() => {
    setNotification(docsError);
  }, [docsError]);

  const addNewDocument = async () => {};

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
