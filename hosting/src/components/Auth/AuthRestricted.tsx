"use client";

import Loader from "@/components/common/Loader";
import {useAuthUserState} from "@/contexts/AuthUserContext";
import {useRouter} from "next/router";
import {Suspense, useEffect} from "react";

interface AuthRestrictedProps {
  children: React.ReactNode;
}

export default function AuthRestricted({children}: AuthRestrictedProps) {
  const {state} = useAuthUserState();
  const router = useRouter();

  useEffect(() => {
    if (!state) {
      router.replace("/auth/");
    }
  }, [state, router]);

  if (!state.userInfo) {
    return (
      <Suspense fallback={<Loader />}>
        <Loader />
      </Suspense>
    );
  }

  return <>{children}</>;
}
