"use client";
import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import {Table, TableRowActions, TableRowLabel} from "@/components/Table";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import {useTanamDocuments} from "@/hooks/useTanamDocuments";
import Alerts from "@/components/common/Alerts";

export default function ContentOverviewPage() {
  const {data: documents, error} = useTanamDocuments();

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Tables" />

      {error ? (
        <Alerts type="error" title="Error fetching documents" message={error.message} />
      ) : (
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
              onView={() => console.log("View", document)}
              onDelete={() => console.log("Delete", document)}
              onDownload={() => console.log("Download", document)}
            />,
          ])}
        />
      )}
    </DefaultLayout>
  );
}
