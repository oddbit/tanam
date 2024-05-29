"use client";

import React from "react";
import {AuthUserProvider} from "@/contexts/AuthUserContext";

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({children}: PublicLayoutProps) {
  return (
    <AuthUserProvider>
      <div className="l-blank">{children}</div>
    </AuthUserProvider>
  );
}
