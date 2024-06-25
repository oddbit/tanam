"use client";
import Notification from "@/components/common/Notification";
import Loader from "@/components/common/Loader";
import ContentCard from "@/components/Containers/ContentCard";
import {useTanamRecentDocuments} from "@/hooks/useTanamDocuments";
import {useParams} from "next/navigation";
import {Suspense} from "react";

export default function DashboardPage() {
  const {site} = useParams<{site: string}>() ?? {
    site: null,
  };
  const {data: document, error: docError} = useTanamRecentDocuments("createdAt");

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
          <ContentCard key={site} title={site}>
            <Suspense fallback={<Loader />}>
              <section className="l-dashboard">
                site ID :: {site} <br />
                document :: {JSON.stringify(document)} <br />
                error :: {JSON.stringify(docError)}
              </section>
            </Suspense>
          </ContentCard>
        </div>
      )}
    </>
  );
}
