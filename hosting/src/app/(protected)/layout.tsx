"use client";

import CmsLayout from "@/components/Layouts/CmsLayout";
import React from "react";
import {useAuthentication} from "@/hooks/useAuthentication";
import {redirect} from "next/navigation";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default function ProtectedLayout({children}: ProtectedLayoutProps) {
  const {isSignedIn} = useAuthentication();

  if (isSignedIn === false) {
    redirect("/");
  }

  return <CmsLayout>{children}</CmsLayout>;
}
