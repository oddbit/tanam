"use client";

import CmsLayout from "@/components/Layouts/CmsLayout";
import { useAuthentication } from "@/hooks/useAuthentication";
import { useTanamUser } from "@/hooks/useTanamUser";
import { redirect, usePathname } from "next/navigation";
import React from "react";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default function ProtectedLayout({children}: ProtectedLayoutProps) {
  const pathname = usePathname();
  const {isSignedIn, authUser} = useAuthentication();
  const {error: userError} = useTanamUser(authUser?.uid);

  console.info("pathname :: ", pathname)

  if (isSignedIn === false) {
    redirect("/");
  }

  if (pathname !== "/error" && userError && userError.message) {
    redirect("/error");
  }

  return <CmsLayout>{children}</CmsLayout>;
}
