"use client";
import { Button } from "@/components/Button";
import { DocumentTypeGenericList } from "@/components/DocumentType/DocumentTypeGenericList";
import Loader from "@/components/common/Loader";
import Notification from "@/components/common/Notification";
import PageHeader from "@/components/common/PageHeader";
import { useTanamDocumentType } from "@/hooks/useTanamDocumentTypes";
import { useCrudTanamDocument, useTanamDocuments } from "@/hooks/useTanamDocuments";
import { UserNotification } from "@/models/UserNotification";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

export default function DocumentTypeDocumentsPage() {
  const {data: documentType} = useTanamDocumentType("article");
  const {create, error: crudError} = useCrudTanamDocument();
  const {data: documents, error: docsError, isLoading} = useTanamDocuments("article");
  const [notification, setNotification] = useState<UserNotification | null>(null);
  const router = useRouter();

  useEffect(() => {
    setNotification(docsError || crudError);
  }, [docsError, crudError]);

  const addNewArticle = async () => {
    const id = await create(documentType?.id);

    if (!id) return;

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
              >
                <span className="i-ic-add w-[22px] h-[22px] text-white mr-2" />
              </Button>
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
        {documentType ? (
          <DocumentTypeGenericList isLoading={isLoading} documents={documents} documentType={documentType} />
        ) : (
          <Loader />
        )}
      </Suspense>
    </>
  );
}
