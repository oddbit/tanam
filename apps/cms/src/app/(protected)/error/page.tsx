"use client";
import Loader from "@tanam/cms/components/common/Loader";
import Notification from "@tanam/cms/components/common/Notification";
import PageHeader from "@tanam/cms/components/common/PageHeader";
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
