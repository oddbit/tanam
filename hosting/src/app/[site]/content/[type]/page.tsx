"use client";
import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import {Table, TableBody, TableHeader, TableRow, TableRowActions, TableRowLabel} from "@/components/Table";
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
        <Table>
          <TableHeader headers={["Id", "Created", "Status", "Actions"]} />
          <TableBody>
            {documents.map((document, key) => (
              <TableRow
                key={key}
                columns={[
                  <div>
                    <h5 className="font-medium text-black dark:text-white">{document.id}</h5>
                  </div>,
                  <p className="text-black dark:text-white">{document.createdAt.toDate().toUTCString()}</p>,
                  <TableRowLabel
                    title={document.status}
                    status={document.status === "published" ? "success" : "info"}
                  />,
                  <TableRowActions
                    onView={() => console.log("View", document)}
                    onDelete={() => console.log("Delete", document)}
                    onDownload={() => console.log("Download", document)}
                  />,
                ]}
              />
            ))}
          </TableBody>
        </Table>
      )}
    </DefaultLayout>
  );
}
