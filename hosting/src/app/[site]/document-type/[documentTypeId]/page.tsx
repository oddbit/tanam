"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import {Table, TableRowActions, TableRowLabel} from "@/components/Table";
import Loader from "@/components/common/Loader";
import Notification from "@/components/common/Notification";
import {useTanamDocumentType} from "@/hooks/useTanamDocumentTypes";
import {useTanamDocuments} from "@/hooks/useTanamDocuments";
import {useTanamSite} from "@/hooks/useTanamSite";
import {useRouter} from "next/navigation";
import {Suspense} from "react";

export default function DocumentTypeDocumentsPage() {
  const {data: documents, error: docsError} = useTanamDocuments();
  const {data: tanamSite} = useTanamSite();
  const {data: documentType} = useTanamDocumentType();
  const router = useRouter();

  const handleView = (documentId: string) => {
    router.push(`/${tanamSite?.id}/document/${documentId}`);
  };

  return (
    <DefaultLayout>
      <Suspense fallback={<Loader />}>
        {documentType ? <Breadcrumb pageName={documentType.titlePlural} /> : <Loader />}
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
    </DefaultLayout>
  );
}