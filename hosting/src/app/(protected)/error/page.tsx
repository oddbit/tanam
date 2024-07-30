"use client";
import Loader from "@/components/common/Loader";
import Notification from "@/components/common/Notification";
import PageHeader from "@/components/common/PageHeader";
import {Suspense} from "react";

export default function ErrorPage() {
  return (
    <>
      <Suspense fallback={<Loader />}>
        <PageHeader pageName="Error" />
        <Notification type="error" title="Something wrong" message="Unknown error" />
      </Suspense>
    </>
  );
}
