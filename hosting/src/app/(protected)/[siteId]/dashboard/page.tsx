"use client";
import {useParams} from "next/navigation";

export default function DashboardPage() {
  const {siteId} = useParams<{siteId: string}>() ?? {};

  return (
    <>
      <section className="l-dashboard">
        site ID :: {siteId}
      </section>
    </>
  );
}
