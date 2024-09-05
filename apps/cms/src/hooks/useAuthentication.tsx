"use client";
import { firebaseAuth } from "@/plugins/firebase";
import { TanamRole } from "@tanam/shared";
import { User } from "firebase/auth";
import { redirect, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function useAuthentication() {
  const pathname = usePathname();

  const [error, setError] = useState<Error | null>(null);
  const [authUser, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<TanamRole | null>(null);
  const [isSignedIn, setIsSignedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged((user) => {
      console.log("[onAuthStateChanged]", {user});
      setUser(user);
      setIsSignedIn(!!user);
      fetchUserRole();
    });

    return () => unsubscribe();
  }, []);

  async function fetchUserRole() {
    try {
      const idTokenResult = await firebaseAuth.currentUser?.getIdTokenResult();

      setUserRole((idTokenResult?.claims as {tanamRole: TanamRole}).tanamRole);

      // Redirect when user doesnt have claims
      if (pathname !== "/error/insufficient-role" && (userRole === null || !userRole)) {
        redirect("/error/insufficient-role");
      }
    } catch (error) {
      setError(error as Error);
    }
  }

  async function signout() {
    console.log("[signout]");
    try {
      await firebaseAuth.signOut();
    } catch (error) {
      setError(error as Error);
    }
  }

  return {
    isSignedIn,
    authUser,
    userRole,
    error,
    signout,
    setError,
  };
}
