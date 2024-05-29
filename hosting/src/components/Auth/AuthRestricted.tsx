"use client";
import Loader from "@/components/common/Loader";
import {useAuthUserState} from "@/contexts/AuthUserContext";
import {useRouter} from "next/navigation";
import {useEffect} from "react";
import {useAuthentication} from "@/hooks/useAuthentication";

interface AuthRestrictedProps {
  children: React.ReactNode;
}

export default function AuthRestricted({children}: AuthRestrictedProps) {
  useAuthentication(); // Hook to set up the auth state

  const {authState} = useAuthentication();
  const router = useRouter();

  useEffect(() => {
    console.log("state", authState);
    if (authState.isSignedIn === false) {
      router.replace("/");
    }
  }, [authState, router]);

  if (!authState) {
    return <Loader />;
  }

  return <>{children}</>;
}
