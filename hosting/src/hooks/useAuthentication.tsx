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
    };
  }, []);

  async function initAuth() {
    await new Promise(() => {
      firebaseAuth.onAuthStateChanged(async (user) => {
        if (user) {
          await onAuthenticate(user);
        } else {
          onDeauthenticate();
        }
      });
    });
  }

  async function signout() {
    try {
      await firebaseAuth.signOut();
      setAuthState({
        isSignedIn: false,
        token: null,
        accessToken: null,
        refreshToken: null,
        userInfo: null,
      });
    } catch (error) {
      setError(error as Error);
    }
  }

  async function onAuthenticate(user: User) {
    try {
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
    initAuth,
    signout,
    setIsLoading,
    setError,
  };
}
