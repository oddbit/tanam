"use client";
import Notification from "@/components/common/Notification";
import PageHeader from "@/components/common/PageHeader";
import { useAuthentication } from "@/hooks/useAuthentication";
import { useTanamUser } from "@/hooks/useTanamUser";

export default function ErrorPage() {
  const {authUser} = useAuthentication();
  const {error: userError} = useTanamUser(authUser?.uid);

  return (
    <>
      <PageHeader pageName="Error" />
      <Notification
        type="error"
        title={userError?.title || "Something wrong"}
        message={userError?.message || "Unknown error"}
      />
    </>
  );
}
