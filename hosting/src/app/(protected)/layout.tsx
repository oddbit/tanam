"use client";

import CmsLayout from "@/components/Layouts/CmsLayout";
import React from "react";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default function ProtectedLayout({children}: ProtectedLayoutProps) {
  return <CmsLayout>{children}</CmsLayout>;
}
