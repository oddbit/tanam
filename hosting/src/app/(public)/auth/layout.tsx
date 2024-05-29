"use client";

import PublicOnlyRestriction from "@/components/Auth/PublicOnlyRestriction";
import React from "react";

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({children}: PublicLayoutProps) {
  return <PublicOnlyRestriction>{children}</PublicOnlyRestriction>;
}
