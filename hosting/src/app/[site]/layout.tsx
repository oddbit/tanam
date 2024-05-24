"use client";

import Loader from "@/components/common/Loader";
import "@/css/satoshi.css";
import "@/css/style.css";
import {useTanamSite} from "@/hooks/useTanamSite";
import "flatpickr/dist/flatpickr.min.css";
import "jsvectormap/dist/css/jsvectormap.css";
import React, {useEffect, useState} from "react";

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({children}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setError] = useState<string>("");
  const {siteData, error} = useTanamSite();

  useEffect(() => {
    if (siteData || error) {
      setLoading(false);
    }

    if (error) {
      // TODO(Dennis): Check error type and set appropriate error message
      setError(error);
    }

    if (siteData) {
      document.title = siteData.title ?? "Tanam";
    } else if (error) {
      document.title = "Error";
    }
  }, [siteData, error]);

  /**
   * Abstraction to simplify the rendering of the site content after loading
   * @returns React.ReactNode - The site content to render
   */
  function getSiteContent(): React.ReactNode {
    if (!!errorMessage) {
      return <div>{errorMessage}</div>;
    } else {
      return children;
    }
  }

  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <div className="dark:bg-boxdark-2 dark:text-bodydark">{loading ? <Loader /> : getSiteContent()}</div>
      </body>
    </html>
  );
};

export default RootLayout;
