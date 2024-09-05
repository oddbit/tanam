"use client";

import "@tanam/cms/assets/css/satoshi.css";
import "@tanam/cms/assets/css/style.css";
import React from "react";

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({children}: PublicLayoutProps) {
  return <div className="l-blank">{children}</div>;
}
