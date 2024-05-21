"use client";

import "jsvectormap/dist/css/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React, { useEffect, useState } from "react";
import Loader from "@/components/common/Loader";

interface RootLayoutProps {
  children: React.ReactNode;
  siteData: { title: string };
}

const RootLayout: React.FC<RootLayoutProps> = ({ children, siteData }) => {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    document.title = siteData?.title ?? "Tanam";
    setLoading(false);
  }, [siteData]);

  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <div className="dark:bg-boxdark-2 dark:text-bodydark">
          {loading ? <Loader /> : children}
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
