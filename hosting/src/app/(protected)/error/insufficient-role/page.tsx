"use client";
import Loader from "@/components/common/Loader";
import Notification from "@/components/common/Notification";
import PageHeader from "@/components/common/PageHeader";
import { useAuthentication } from "@/hooks/useAuthentication";
import { useTanamUser } from "@/hooks/useTanamUser";
import { Suspense } from "react";

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
