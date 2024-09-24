"use client";
import {TanamRole} from "@tanam/domain-frontend";
import {User} from "firebase/auth";
import {redirect, usePathname} from "next/navigation";
import {useCallback, useEffect, useState} from "react";
import {firebaseAuth} from "../plugins/firebase";

export function useAuthentication() {
  const pathname = usePathname();

  const [error, setError] = useState<Error | null>(null);
  const [authUser, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<TanamRole | null>(null);
  const [isSignedIn, setIsSignedIn] = useState<boolean | null>(null);

  const fetchUserRole = useCallback(async () => {
    try {
      const idTokenResult = await firebaseAuth.currentUser?.getIdTokenResult();
      const role = (idTokenResult?.claims as {tanamRole: TanamRole})?.tanamRole;

      setUserRole(role || null);

      if (pathname !== "/error/insufficient-role" && !role) {
        redirect("/error/insufficient-role");
      }
    } catch (error) {
      setError(error as Error);
    }
  }, [pathname]);

  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged((user) => {
      console.log("[onAuthStateChanged]", {user});

      setUser(user);
      setIsSignedIn(!!user);

      if (user) fetchUserRole();
    });

    return () => unsubscribe();
  }, [fetchUserRole]);

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
