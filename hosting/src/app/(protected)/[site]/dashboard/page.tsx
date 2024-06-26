"use client";
import Notification from "@/components/common/Notification";
import Loader from "@/components/common/Loader";
import ContentCard from "@/components/Containers/ContentCard";
import {Table} from "@/components/Table";
// import {useTanamDocument} from "@/hooks/useTanamDocuments";
import {useTanamRecentDocuments} from "@/hooks/useTanamDocuments";
import {useTanamDocumentType, useTanamDocumentTypes} from '@/hooks/useTanamDocumentTypes';
import {useParams} from "next/navigation";
import {Suspense} from "react";

export default function DashboardPage() {
  const {site} = useParams<{site: string}>() ?? {
    site: null,
  };
  // const {data: document, error: docError} = useTanamDocument();
  const {data: document, error: docError} = useTanamRecentDocuments("createdAt");
  const {data: documentTypes, error: typesError} = useTanamDocumentTypes();
  // const {data: documentType, error: typeError} = useTanamDocumentType(document?.documentType);

  if (docError) {
    return (
      <>
        <Notification type="error" title="Error loading document" message={docError?.message || "Unknown error"} />
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
                site ID :: {site} <br />
                document :: {JSON.stringify(document)} <br />
                documentTypes :: {JSON.stringify(documentTypes)} <br />
                {/* documentType :: {JSON.stringify(documentType)} <br /> */}
                error :: {JSON.stringify(docError)}
              </section>

              <Table 
                headers={["Id", "Title", "Created At"]} 
                rows={documentTypes.map((documentType) => [
                  <div>{documentType.id}</div>,
                  <div>{documentType.documentTitleField}</div>,
                  <p>{documentType.createdAt.toDate().toUTCString()}</p>
                ])}
              />
            </Suspense>
          </ContentCard>
        </div>
      )}
    </>
  );
}
