"use client";

import React from "react";
import "../../assets/css/satoshi.css";
import "../../assets/css/style.css";

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({children}: PublicLayoutProps) {
  return <div className="l-blank">{children}</div>;
}
