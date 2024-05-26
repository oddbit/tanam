"use client";
import "@/assets/css/satoshi.css";
import "@/assets/css/style.css";
import React from "react";
import {useAuthentication} from "@/hooks/useAuthentication";

export default function BlankLayout({children}: {children: React.ReactNode}) {
  useAuthentication()

  return (
    <>
      <div className="l-blank">{children}</div>
    </>
  );
}
