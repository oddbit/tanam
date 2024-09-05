import { Table, TableRowLabel } from "@/components/Table";
import { TanamDocumentClient } from "@/models/TanamDocumentClient";
import { TanamDocumentTypeClient } from "@/models/TanamDocumentTypeClient";
import { TanamPublishStatus } from "@tanam/shared";
import Link from "next/link";

interface TableOverviewGenericProps {
  documentType: TanamDocumentTypeClient;
  documents: TanamDocumentClient[];
  isLoading?: boolean;
}

export function DocumentTypeGenericList({documents, documentType, isLoading}: TableOverviewGenericProps) {
  return (
    <Table
      isLoading={isLoading}
      headers={["Title", "Created", "Status"]}
      rows={documents.map((document, key) => [
        <Link key={`${key}-${document.id}-id`} href={`/content/${document.documentType}/${document.id}`}>
          <p className="font-medium text-black dark:text-white">{document.data[documentType.titleField] as string}</p>
        </Link>,
        <p key={`${key}-${document.id}-date`} className="text-black dark:text-white">
          {document.createdAt?.toDate().toUTCString()}
        </p>,

        <TableRowLabel
          key={`${key}-${document.id}-status`}
          title={document.status}
          status={document.status === TanamPublishStatus.Published ? "success" : "info"}
        />,
      ])}
    />
  );
}
