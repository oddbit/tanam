"use client";
import Notification from "@/components/common/Notification";
import {useTanamRecentDocuments} from "@/hooks/useTanamDocuments";
import {useParams} from "next/navigation";

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
      <section className="l-dashboard">
        site ID :: {site} <br />
        document :: {JSON.stringify(document)} <br />
        error :: {JSON.stringify(docError)}
      </section>
    </>
  );
}
