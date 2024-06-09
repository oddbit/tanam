"use client";
import Loader from "@/components/common/Loader";
import Notification from "@/components/common/Notification";
import PageHeader from "@/components/common/PageHeader";
import {useTanamDocumentType} from "@/hooks/useTanamDocumentTypes";
import {useTanamDocument} from "@/hooks/useTanamDocuments";
import {useParams, useRouter} from "next/navigation";
import {Suspense, useEffect, useState} from "react";

const DocumentDetailsPage = () => {
  const router = useRouter();
  const {documentId} = useParams<{documentId: string}>() ?? {};
  const {data: document, error: documentError} = useTanamDocument(documentId);
  const {data: documentType, error: typeError} = useTanamDocumentType("article");

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
        {documentType ? <PageHeader pageName={documentType.titleSingular.translated} /> : <Loader />}
      </Suspense>
      {error && <Notification type="error" title="Error fetching document" message={error.message} />}
      <div>
        <pre>{JSON.stringify(document?.data, null, 2)}</pre>
      </div>
    </>
  );
};

export default DocumentDetailsPage;
