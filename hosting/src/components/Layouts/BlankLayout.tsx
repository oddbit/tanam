"use client";
import "@/assets/css/satoshi.css";
import "@/assets/css/style.css";
import React from "react";
import { AuthUserProvider } from '@/contexts/AuthUserContext';

export default function BlankLayout({children}: {children: React.ReactNode}) {
  return (
    <>
      <AuthUserProvider>
        <div className="l-blank">{children}</div>
      </AuthUserProvider>
    </>
  );
}
