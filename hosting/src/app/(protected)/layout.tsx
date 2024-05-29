"use client";

import AuthRestricted from "@/components/Auth/AuthRestricted";
import CmsLayout from "@/components/Layouts/CmsLayout";
import {AuthUserProvider} from "@/contexts/AuthUserContext";
import React from "react";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default function ProtectedLayout({children}: ProtectedLayoutProps) {
  return (
    <AuthUserProvider>
      <AuthRestricted>
        <CmsLayout>{children}</CmsLayout>
      </AuthRestricted>
    </AuthUserProvider>
  );
}
