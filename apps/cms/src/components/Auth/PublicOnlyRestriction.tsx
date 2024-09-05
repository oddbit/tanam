"use client";
import { useAuthentication } from "@tanam/cms/hooks/useAuthentication";

interface PublicOnlyRestrictionProps {
  children: React.ReactNode;
  rejected: React.ReactNode;
  loading?: React.ReactNode;
}

export default function PublicOnlyRestriction({children, rejected, loading}: PublicOnlyRestrictionProps) {
  const {isSignedIn} = useAuthentication();
  const isLoading = isSignedIn === null;

  if (isLoading) {
    return <>{loading ?? rejected}</>;
  }

  return isSignedIn ? <>{rejected}</> : <>{children}</>;
}
