"use client";
import Loader from "@/components/common/Loader";
import {useAuthUserState} from "@/contexts/AuthUserContext";
import {useRouter} from "next/navigation";
import {Suspense, useEffect} from "react";

interface AuthRestrictedProps {
  children: React.ReactNode;
}

export default function AuthRestricted({children}: AuthRestrictedProps) {
  const {state} = useAuthUserState();
  const router = useRouter();

  useEffect(() => {
    if (!state.isSignedIn) {
      router.replace("/");
    }
  }, [state.isSignedIn, router]);

  if (!state.isSignedIn) {
    return <Loader />;
  }

  return <Suspense fallback={<Loader />}>{children}</Suspense>;
}
