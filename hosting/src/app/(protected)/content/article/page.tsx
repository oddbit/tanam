"use client";
import {Button} from "@/components/Button";
import {DocumentTypeGenericList} from "@/components/DocumentType/DocumentTypeGenericList";
import Loader from "@/components/common/Loader";
import Notification from "@/components/common/Notification";
import PageHeader from "@/components/common/PageHeader";
import {useTanamDocumentType} from "@/hooks/useTanamDocumentTypes";
import {useCreateTanamDocument, useTanamDocuments} from "@/hooks/useTanamDocuments";
import {UserNotification} from "@/models/UserNotification";
import {useRouter} from "next/navigation";
import {Suspense, useEffect, useState} from "react";

export default function DocumentTypeDocumentsPage() {
  const {data: documentType} = useTanamDocumentType("article");
  const {create, error: writeError} = useCreateTanamDocument(documentType?.id);
  const {data: documents, error: docsError} = useTanamDocuments("article");
  const [notification, setNotification] = useState<UserNotification | null>(null);
  const router = useRouter();

  useEffect(() => {
    setNotification(docsError || writeError);
  }, [docsError, writeError]);

  const addNewArticle = async () => {
    const id = await create();

    router.push(`article/${id}`);
  };

  return (
    <>
      <Suspense fallback={<Loader />}>
        {documentType ? (
          <div className="flex items-center gap-4">
            <PageHeader pageName={documentType.titlePlural.translated} />
            <div className="mb-6">
              <Button
                title={`Add New ${documentType.titleSingular.translated}`}
                onClick={addNewArticle}
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

      <Suspense fallback={<Loader />}>
        {documentType ? <DocumentTypeGenericList documents={documents} documentType={documentType} /> : <Loader />}
      </Suspense>
    </>
  );
}
