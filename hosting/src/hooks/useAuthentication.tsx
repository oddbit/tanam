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
    const unsubscribe = firebaseAuth.onAuthStateChanged(async (user) => {
      console.log("[onAuthStateChanged] user", user);
      setIsLoading(true);
      if (user) {
        await onAuthenticate(user);
      } else {
        onDeauthenticate();
      }
      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  async function signout() {
    try {
      await firebaseAuth.signOut();
      onDeauthenticate();
    } catch (error) {
      setError(error as Error);
    }
  }

  async function onAuthenticate(user: User) {
    try {
      console.log("[onAuthenticate] user", user);
      const idTokenResult = await user.getIdTokenResult();

      setAuthState({
        isSignedIn: true,
        token: idTokenResult,
        accessToken: idTokenResult.token,
        refreshToken: user.refreshToken,
        userInfo: user.toJSON() as UserInfo,
      });
    } catch (error) {
      setError(error as Error);
    }
  }

  function onDeauthenticate() {
    setAuthState({
      isSignedIn: false,
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
    signout,
    setIsLoading,
    setError,
  };
}
