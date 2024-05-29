"use client";
import {useRouter} from "next/router";
import {useEffect} from "react";

export default function AuthRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/auth/signin");
  }, [router]);

  return null;
}
