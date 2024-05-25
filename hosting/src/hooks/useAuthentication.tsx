"use client";
import {useState, useEffect} from "react";

export function useAuthentication() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    return () => {
      setIsLoading(false)
    }
  })

  return {
    isLoading,
    
    setIsLoading
  }
}