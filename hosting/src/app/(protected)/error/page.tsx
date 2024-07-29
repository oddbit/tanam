"use client";
import Notification from "@/components/common/Notification";
import PageHeader from "@/components/common/PageHeader";
import { useAuthentication } from "@/hooks/useAuthentication";
import { useTanamUser } from "@/hooks/useTanamUser";
import { useEffect } from "react";

export default function ErrorPage() {
  const {authUser} = useAuthentication();
  const {data: tanamUser, error: userError} = useTanamUser(authUser?.uid);

  useEffect(() => {
    console.log("userError", userError?.message);
  }, [userError]);

  return (
    <>
      authUser :: {JSON.stringify(authUser)}
      <PageHeader pageName="Ooooppss" />
      <Notification
        type="error"
        title="Error"
        message="Message"
      />
    </>
  );
}
