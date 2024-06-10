"use client";
import TiptapEditor from "@/components/Tiptap/TiptapEditor";
import Loader from "@/components/common/Loader";
import Notification from "@/components/common/Notification";
import PageHeader from "@/components/common/PageHeader";
import {useTanamDocumentType} from "@/hooks/useTanamDocumentTypes";
import {useTanamDocument} from "@/hooks/useTanamDocuments";
import {useEditor} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {useParams, useRouter} from "next/navigation";
import {Suspense, useEffect, useState} from "react";

const extensions = [StarterKit];

export default function DocumentDetailsPage() {
  const router = useRouter();
  const {documentId} = useParams<{documentId: string}>() ?? {};
  const {data: document, error: documentError} = useTanamDocument(documentId);
  const {data: documentType, error: typeError} = useTanamDocumentType("article");
  const editor = useEditor({
    extensions,
    content: document?.data,
  });

  const [readonlyMode] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  if (!!document?.documentType && document?.documentType !== "article") {
    router.push(`/document-type/${document?.documentType}/${document?.id}`);
    return <Loader />;
  }

  useEffect(() => {
    setError(documentError ?? typeError);
  }, [documentError]);

  return (
    <>
      <Suspense fallback={<Loader />}>
        {document ? <PageHeader pageName={document.data.title as string} /> : <Loader />}
      </Suspense>
      {error && <Notification type="error" title="Error fetching document" message={error.message} />}
      <TiptapEditor key={"article-content"} value={document?.data.content as string} />
    </>
  );
}
