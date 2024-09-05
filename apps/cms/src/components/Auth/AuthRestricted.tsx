"use client";
import { useAuthentication } from "@tanam/cms/hooks/useAuthentication";

interface AuthRestrictedProps {
  children: React.ReactNode;
  rejected: React.ReactNode;
  loading?: React.ReactNode;
}

export default function AuthRestricted({children, rejected, loading}: AuthRestrictedProps) {
  const {isSignedIn} = useAuthentication();
  const isLoading = isSignedIn === null;

  if (isLoading) {
    return <>{loading ?? rejected}</>;
  }

  return !isSignedIn ? <>{rejected}</> : <>{children}</>;
}
