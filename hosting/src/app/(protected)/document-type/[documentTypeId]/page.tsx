"use client";
import {Table, TableRowActions, TableRowLabel} from "@/components/Table";
import Loader from "@/components/common/Loader";
import Notification from "@/components/common/Notification";
import PageHeader from "@/components/common/PageHeader";
import {useTanamDocumentType} from "@/hooks/useTanamDocumentTypes";
import {useTanamDocuments} from "@/hooks/useTanamDocuments";
import {useRouter} from "next/navigation";
import {Suspense} from "react";

export default function DocumentTypeDocumentsPage() {
  const {data: documents, error: docsError} = useTanamDocuments();
  const {data: documentType} = useTanamDocumentType();
  const router = useRouter();

  const handleView = (documentId: string) => {
    router.push(`/tanam-documents/${documentId}`);
  };

  return (
    <>
      <Suspense fallback={<Loader />}>
        {documentType ? <PageHeader pageName={documentType.titlePlural.translated} /> : <Loader />}
      </Suspense>

      {docsError ? (
        <Notification type="error" title="Error fetching documents" message={docsError.message} />
      ) : (
        <Suspense fallback={<Loader />}>
          <Table
            headers={["Id", "Created", "Status", "Actions"]}
            rows={documents.map((document, key) => [
              <div key={`${key}-${document.id}-id`}>
                <h5 className="font-medium text-black dark:text-white">{document.id}</h5>
              </div>,
              <p key={`${key}-${document.id}-date`} className="text-black dark:text-white">
                {document.createdAt.toDate().toUTCString()}
              </p>,
              <TableRowLabel
                key={`${key}-${document.id}-status`}
                title={document.status}
                status={document.status === "published" ? "success" : "info"}
              />,
              <TableRowActions
                key={`${key}-${document.id}-actions`}
                onView={() => handleView(document.id)}
                onDelete={() => console.log("Delete", document)}
                onDownload={() => console.log("Download", document)}
              />,
            ])}
          />
        </Suspense>
      )}
    </>
  );
}
