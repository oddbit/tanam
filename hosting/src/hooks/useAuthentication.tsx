"use client";
import {firebaseAuth} from "@/plugins/firebase";
import {useState, useEffect} from "react";
import {useAuthUserState} from "@/contexts/AuthUserContext";
import {createSession, removeSession} from "@/actions/authAction";
import {User, UserInfo} from "firebase/auth";

export function useAuthentication() {
  const {state: authState, setState: setAuthState} = useAuthUserState();
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
          onAuthenticate(user);
        }

        if (!user) {
          onDeauthenticate();
        }
      });
    });
  }

  async function signout() {
    try {
      await firebaseAuth.signOut();
      removeSession()
    } catch (error) {
      console.error(error);
    }
  }

  async function onAuthenticate(user: User) {
    try {
      const idTokenResult = await user.getIdTokenResult();

      setAuthState({
        ...authState,
        token: idTokenResult,
        userInfo: user.toJSON() as UserInfo,
      });
      
      await createSession(idTokenResult.token)
    } catch (error) {
      console.error(error);
    }
  }

  async function onDeauthenticate() {
    resetState();
  }

  function resetState() {
    setAuthState({
      token: null,
      accessToken: null,
      refreshToken: null,
      userInfo: null,
    });
  }

  return {
    isLoading,
    authState,

    initAuth,
    signout,
    resetState,
    setIsLoading,
  };
}
