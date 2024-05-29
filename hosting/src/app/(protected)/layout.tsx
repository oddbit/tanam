"use client";

import {AuthUserProvider} from "@/contexts/AuthUserContext";
import React from "react";
import CmsLayout from "../../components/Layouts/CmsLayout";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default function ProtectedLayout({children}: ProtectedLayoutProps) {
  return (
    <AuthUserProvider>
      <CmsLayout>{children}</CmsLayout>
    </AuthUserProvider>
  );
}
