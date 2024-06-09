import {Table, TableRowActions, TableRowLabel} from "@/components/Table";
import {TanamDocumentClient} from "@/models/TanamDocumentClient";
import {useRouter} from "next/navigation";

interface TableOverviewGenericProps {
  documents: TanamDocumentClient[];
}

export function DocumentTypeGenericList({documents}: TableOverviewGenericProps) {
  const router = useRouter();
  const handleView = (documentId: string) => {
    router.push(`${documentId}`);
  };

  return (
    <>
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
    </>
  );
}
