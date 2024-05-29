"use client";

import {useAuthentication} from "@/hooks/useAuthentication";
import React from "react";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({children}: RootLayoutProps) {
  const {authUser} = useAuthentication();
  //
  return (
    <>
      <html lang="en">
        <body suppressHydrationWarning={true}></body>
        <div className="dark:bg-boxdark-2 dark:text-bodydark">
          <div className="dark:bg-boxdark-2 dark:text-bodydark">{children}</div>
        </div>
      </html>
    </>
  );
}
