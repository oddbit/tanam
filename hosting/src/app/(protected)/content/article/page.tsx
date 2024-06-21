"use client";
import {DocumentTypeGenericList} from "@/components/DocumentType/DocumentTypeGenericList";
import Loader from "@/components/common/Loader";
import Notification from "@/components/common/Notification";
import PageHeader from "@/components/common/PageHeader";
import {useTanamDocumentType} from "@/hooks/useTanamDocumentTypes";
import {useCreateTanamDocument, useTanamDocuments} from "@/hooks/useTanamDocuments";
import {UserNotification} from "@/models/UserNotification";
import {Suspense, useEffect, useState} from "react";

export default function DocumentTypeDocumentsPage() {
  const {data: documentType} = useTanamDocumentType("article");
  const {create, error: writeError, isLoading} = useCreateTanamDocument(documentType?.id);
  const {data: documents, error: docsError} = useTanamDocuments("article");
  const [notification, setNotification] = useState<UserNotification | null>(null);

  useEffect(() => {
    setNotification(docsError || writeError);
  }, [docsError, writeError]);

  const addNewArticle = async () => {
    await create();
  };

  return (
    <>
      <Suspense fallback={<Loader />}>
        {documentType ? (
          <div className="flex items-center">
            <PageHeader pageName={documentType.titlePlural.translated} />
            <button
              type="button"
              className="ml-4 mb-6 inline-flex items-center justify-center rounded-md bg-primary px-2 py-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-2 xl:px-2"
              onClick={addNewArticle}
            >
              <span className={isLoading ? "opacity-0" : "opacity-100"}>
                Add new {documentType.titleSingular.translated}
              </span>
              {isLoading ? <span className="i-line-md-loading-loop w-[24px] h-[24px] absolute" /> : null}
            </button>
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
