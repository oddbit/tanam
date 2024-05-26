"use client";
import "@/assets/css/satoshi.css";
import "@/assets/css/style.css";
import "flatpickr/dist/flatpickr.min.css";
import "jsvectormap/dist/css/jsvectormap.css";
import Loader from "@/components/common/Loader";
import {useTanamSite} from "@/hooks/useTanamSite";
import React, {useState, useEffect} from "react";

export default function SiteDataLayout({children}: {children: React.ReactNode}) {
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setError] = useState<string>("");
  const {data: siteData, error} = useTanamSite();

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
   * @return {React.ReactNode} The site content to render
   */
  function getSiteContent(): React.ReactNode {
    if (errorMessage) {
      return <div>{errorMessage}</div>;
    } else {
      return children;
    }
  }

  return <div>{loading ? <Loader /> : getSiteContent()}</div>;
}
