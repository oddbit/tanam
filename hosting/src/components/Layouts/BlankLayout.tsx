"use client";
import "@/assets/css/satoshi.css";
import "@/assets/css/style.css";
import React from "react";

export default function BlankLayout({children}: {children: React.ReactNode}) {
  return <div className="l-blank">{children}</div>;
}
