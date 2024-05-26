"use client";

import React from "react";
import {AuthUserProvider} from '@/contexts/AuthUserContext';

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({children}) => {
  return (
    <>
      <AuthUserProvider>
        <html lang="en">
          <body suppressHydrationWarning={true}>
            <div className="dark:bg-boxdark-2 dark:text-bodydark">
              {children}
            </div>
          </body>
        </html>
      </AuthUserProvider>
    </>
  );
};

export default RootLayout;
