"use client";
import {Loader, Notification, PageHeader} from "@tanam/ui-components";
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
