import {TanamDocument, TanamDocumentTypeClient, TanamPublishStatus} from "@tanam/domain-frontend";
import Link from "next/link";
import {Table, TableRowLabel} from "../Table";

interface TableOverviewGenericProps {
  documentType: TanamDocumentTypeClient;
  documents: TanamDocument[];
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
