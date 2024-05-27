"use client";
import ContentCard from "@/components/Containers/ContentCard";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import {Table, TableRowActions, TableRowLabel} from "@/components/Table";
import Loader from "@/components/common/Loader";
import {useTanamRecentDocuments} from "@/hooks/useTanamDocuments";
import {useTanamSite} from "@/hooks/useTanamSite";
import {useRouter} from "next/navigation";
import {Suspense} from "react";

export default function Home() {
  const {data: tanamSite} = useTanamSite();
  const {data: newlyCreatedDocs, error: docError} = useTanamRecentDocuments("createdAt");
  const router = useRouter();
  return (
    <DefaultLayout>
      <ContentCard title="Recent content">
        <Suspense fallback={<Loader />}>
          <Table
            headers={["Id", "Created", "Status", "Actions"]}
            rows={newlyCreatedDocs.map((document, key) => [
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
                onView={() => router.push(`/${tanamSite?.id}/document/${document.id}`)}
                onDelete={() => console.log("Delete", document)}
                onDownload={() => console.log("Download", document)}
              />,
            ])}
          />
        </Suspense>
      </ContentCard>
      g{" "}
    </DefaultLayout>
  );
}
