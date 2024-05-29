"use client";
import {firebaseAuth} from "@/plugins/firebase";
import {useState, useEffect} from "react";
import {useAuthUserState} from "@/contexts/AuthUserContext";
import {User, UserInfo} from "firebase/auth";

export function useAuthentication() {
  const {state: authState, setState: setAuthState} = useAuthUserState();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    initAuth();

    return () => {
      setIsLoading(false);
      resetState();
    };
  }, []);

  async function initAuth() {
    await new Promise(() => {
      firebaseAuth.onAuthStateChanged(async (user) => {
        if (user) {
          await onAuthenticate(user);
        } else {
          resetState();
        }
      });
    });
  }

  async function signout() {
    try {
      console.log("Signing out...");
      await firebaseAuth.signOut();
    } catch (error) {
      setError(error as Error);
      console.error(error);
    }
  }

  async function onAuthenticate(user: User) {
    try {
      console.log("onAuthenticate", user);
      const idTokenResult = await user.getIdTokenResult();

      setAuthState({
        ...authState,
        token: idTokenResult,
        userInfo: user.toJSON() as UserInfo,
      });
    } catch (error) {
      setError(error as Error);
      console.error(error);
    }
  }

  function resetState() {
    console.log("Resetting state...");
    setAuthState({
      token: null,
      accessToken: null,
      refreshToken: null,
      userInfo: null,
    });
  }

  return {
    isLoading,
    error,
    authState,
    initAuth,
    signout,
    resetState,
    setIsLoading,
    setError,
  };
}
