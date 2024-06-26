"use client";

import "@/assets/css/satoshi.css";
import "@/assets/css/style.css";
import React from "react";
import {useAuthentication} from '@/hooks/useAuthentication';
import {redirect} from 'next/navigation';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({children}: PublicLayoutProps) {
  const {isSignedIn} = useAuthentication();

  if (isSignedIn) {
    redirect("/");
  }

  return <div className="l-blank">{children}</div>;
}
