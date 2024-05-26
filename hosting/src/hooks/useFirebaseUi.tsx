"use client";
import {useState, useEffect} from "react";
import "firebaseui/dist/firebaseui.css";
import {auth as firebaseAuthUi} from "firebaseui";
import {firebaseAuth} from "@/plugins/firebase";
import {EmailAuthProvider, GoogleAuthProvider, AuthCredential} from "firebase/auth";
import {useAuthUserState} from "@/contexts/AuthUserContext";

const firebaseUi = new firebaseAuthUi.AuthUI(firebaseAuth);

export function useFirebaseUi() {
  const {state: authState, setState: setAuthState} = useAuthUserState();
  const [isSignUp, setIsSignup] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    renderFirebaseUi();

    return () => {
      setIsLoading(false);
      setIsSignup(false);
    };
  });

  function renderFirebaseUi() {
    if (!window || typeof window === "undefined") return;

    const selector = "#firebaseuiAuthContainer";

    firebaseUi.start(selector, {
      signInSuccessUrl: `${window.location.origin}/tanam-testing`,
      signInOptions: [
        {
          provider: EmailAuthProvider.PROVIDER_ID,
          fullLabel: isSignUp ? "Sign up with email" : "Sign in with email",
        },
        {
          provider: GoogleAuthProvider.PROVIDER_ID,
          fullLabel: isSignUp ? "Sign up with Google" : "Sign in with Google",
        },
      ],
      popupMode: true,
      signInFlow: "popup",
      callbacks: {
        signInSuccessWithAuthResult: ({credential}: {credential: AuthCredential}) => {
          const authCredential = credential.toJSON()

          setAuthState({
            ...authState,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            accessToken: authCredential?.accessToken || null
          });

          return true;
        },

        uiShown: () => {
          setIsLoading(false);
        },
      },
    });
  }

  return {
    isLoading,
    isSignUp,

    setIsLoading,
    setIsSignup,
  };
}
