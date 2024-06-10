"use client";
import TiptapEditor from "@/components/Tiptap/TiptapEditor";
import Loader from "@/components/common/Loader";
import Notification from "@/components/common/Notification";
import PageHeader from "@/components/common/PageHeader";
import {useCrudTanamDocument, useTanamDocument} from "@/hooks/useTanamDocuments";
import {UserNotification} from "@/models/UserNotification";
import {useParams, useRouter} from "next/navigation";
import {Suspense, useEffect, useState} from "react";

export default function DocumentDetailsPage() {
  const router = useRouter();
  const {documentId} = useParams<{documentId: string}>() ?? {};
  const {data: document, error: documentError} = useTanamDocument(documentId);
  const {update, error: writeError} = useCrudTanamDocument(documentId);
  const [readonlyMode] = useState<boolean>(false);
  const [notification, setNotification] = useState<UserNotification | null>(null);
  if (!!document?.documentType && document?.documentType !== "article") {
    router.push(`/document-type/${document?.documentType}/${document?.id}`);
    return <Loader />;
  }

  useEffect(() => {
    setNotification(documentError || writeError);
  }, [documentError, writeError]);

  async function onDocumentContentChange(content: string) {
    console.log("[onDocumentContentChange]", content);
    await update({data: {content}});
  }

  return (
    <>
      <Suspense fallback={<Loader />}>
        {document ? <PageHeader pageName={document.data.title as string} /> : <Loader />}
      </Suspense>
      {notification && (
        <Notification type={notification.type} title={notification.title} message={notification.message} />
      )}

      <TiptapEditor
        key={"article-content"}
        value={document?.data.content as string}
        disabled={readonlyMode}
        onChange={onDocumentContentChange}
      />
    </>
  );
}
