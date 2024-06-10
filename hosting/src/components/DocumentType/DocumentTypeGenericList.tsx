import {Table, TableRowActions, TableRowLabel} from "@/components/Table";
import {TanamDocumentClient} from "@/models/TanamDocumentClient";
import Link from "next/link";
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
        headers={["Id", "Created", "Status"]}
        rows={documents.map((document, key) => [
          <Link key={`${key}-${document.id}-id`} href={`/content/${document.documentType}/${document.id}`}>
            <h5 className="font-medium text-black dark:text-white">{document.id}</h5>
          </Link>,
          <p key={`${key}-${document.id}-date`} className="text-black dark:text-white">
            {document.createdAt.toDate().toUTCString()}
          </p>,

          <TableRowLabel
            key={`${key}-${document.id}-status`}
            title={document.status}
            status={document.status === "published" ? "success" : "info"}
          />
        ])}
      />
    </>
  );
}
