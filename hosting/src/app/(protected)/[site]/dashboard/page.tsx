"use client";
import Notification from "@/components/common/Notification";
import Loader from "@/components/common/Loader";
import ContentCard from "@/components/Containers/ContentCard";
import {Table} from "@/components/Table";
import {useTanamDocumentTypes} from '@/hooks/useTanamDocumentTypes';
import {useParams} from "next/navigation";
import {Suspense} from "react";

export default function DashboardPage() {
  const {site} = useParams<{site: string}>() ?? {
    site: null,
  };
  const {data: documentTypes, totalRecords: typeTotalRecords, error: typeError} = useTanamDocumentTypes();

  if (typeError) {
    return (
      <>
        <Notification type="error" title="Error loading document" message={typeError?.message || "Unknown error"} />
      </>
    );
  }

  return (
    <>
      {site && (
        <div className="grid grid-cols-1 gap-9">
          <ContentCard key={site} title="Post Type">
            <Suspense fallback={<Loader />}>
              <section className="l-dashboard">
                <Table 
                  headers={["Id", "Title", "Created At"]} 
                  rows={documentTypes.map((documentType) => [
                    <div>{documentType.id}</div>,
                    <div>{documentType.documentTitleField}</div>,
                    <p>{documentType.createdAt.toDate().toUTCString()}</p>
                  ])}
                  totalRecords={typeTotalRecords}
                />
              </section>
            </Suspense>
          </ContentCard>
        </div>
      )}
    </>
  );
}
