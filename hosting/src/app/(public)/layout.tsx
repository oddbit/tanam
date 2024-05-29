"use client";

import React from "react";

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({children}: PublicLayoutProps) {
  return <div className="l-blank">{children}</div>;
}
