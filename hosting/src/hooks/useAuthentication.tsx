"use client";
import {firebaseAuth} from "@/plugins/firebase";
import {User} from "firebase/auth";
import {useEffect, useState} from "react";

export function useAuthentication() {
  const [error, setError] = useState<Error | null>(null);
  const [authUser, setUser] = useState<User | null>(null);
  const [isSignedIn, setIsSignedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged((user) => {
      console.log("[onAuthStateChanged]", {user});
      setUser(user);
      setIsSignedIn(!!user);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

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
    error,
    signout,
    setError,
  };
}
