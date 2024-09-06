"use client";
import {redirect} from "next/navigation";
import React from "react";
import CmsLayout from "../../components/Layouts/CmsLayout";
import {useAuthentication} from "../../hooks/useAuthentication";

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
