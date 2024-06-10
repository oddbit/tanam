"use client";
import TiptapEditor from "@/components/Tiptap/TiptapEditor";
import Loader from "@/components/common/Loader";
import Notification from "@/components/common/Notification";
import PageHeader from "@/components/common/PageHeader";
import {useCrudTanamDocument, useTanamDocument} from "@/hooks/useTanamDocuments";
import {ITanamDocument} from "@functions/models/TanamDocument";
import {Timestamp} from "firebase/firestore";
import {useParams, useRouter} from "next/navigation";
import {Suspense, useEffect, useState} from "react";

export default function DocumentDetailsPage() {
  const router = useRouter();
  const {documentId} = useParams<{documentId: string}>() ?? {};
  const {data: document, error: documentError} = useTanamDocument(documentId);
  const {update, error: writeError} = useCrudTanamDocument(documentId);
  const [readonlyMode] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  if (!!document?.documentType && document?.documentType !== "article") {
    router.push(`/document-type/${document?.documentType}/${document?.id}`);
    return <Loader />;
  }

  useEffect(() => {
    if (documentError || writeError) {
      setError(documentError || writeError);
    }
  }, [documentError, writeError]);

  function onDocumentContentChange(content: string) {
    console.log("Save document", content);
    update({data: {content} as Partial<ITanamDocument<Timestamp>>});
  }

  return (
    <>
      <Suspense fallback={<Loader />}>
        {document ? <PageHeader pageName={document.data.title as string} /> : <Loader />}
      </Suspense>
      {error && <Notification type="error" title="Error fetching document" message={error.message} />}
      <TiptapEditor
        key={"article-content"}
        value={document?.data.content as string}
        disabled={readonlyMode}
        onChange={onDocumentContentChange}
      />
    </>
  );
}
