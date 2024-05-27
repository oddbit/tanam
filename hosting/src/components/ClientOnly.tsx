"use client";
import {useEffect, useState} from "react";

const ClientOnly: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(window && typeof window !== "undefined");
  }, []);

  if (!isClient) return;

  return <>{children}</>;
};

export default ClientOnly;
