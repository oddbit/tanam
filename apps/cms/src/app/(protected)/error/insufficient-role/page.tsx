"use client";
import {Loader, Notification, PageHeader} from "@tanam/ui-components";
import {Suspense} from "react";
import {useAuthentication} from "../../../../hooks/useAuthentication";
import {useTanamUser} from "../../../../hooks/useTanamUser";

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
