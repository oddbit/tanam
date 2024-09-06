"use client";
import Loader from "@tanam/cms/components/common/Loader";
import Notification from "@tanam/cms/components/common/Notification";
import PageHeader from "@tanam/cms/components/common/PageHeader";
import {useAuthentication} from "@tanam/cms/hooks/useAuthentication";
import {useTanamUser} from "@tanam/cms/hooks/useTanamUser";
import {Suspense} from "react";

export default function ErrorInsufficientRolePage() {
  const {authUser} = useAuthentication();
  const {error: userError} = useTanamUser(authUser?.uid);

  return (
    <>
      <Suspense fallback={<Loader />}>
        <PageHeader pageName="Insufficient role" />
        <Notification
          type="error"
          title={userError?.title || "Something wrong"}
          message={userError?.message || "Unknown error"}
        />
      </Suspense>
    </>
  );
}
