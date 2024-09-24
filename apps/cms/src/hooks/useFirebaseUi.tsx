"use client";
import {AuthCredential, GoogleAuthProvider} from "firebase/auth";
import {auth as firebaseAuthUi} from "firebaseui";
import "firebaseui/dist/firebaseui.css";
import {useCallback, useEffect, useState} from "react";
import {firebaseAuth} from "../plugins/firebase";

const firebaseUi = firebaseAuthUi.AuthUI.getInstance() || new firebaseAuthUi.AuthUI(firebaseAuth);

export function useFirebaseUi() {
  const [isSignUp, setIsSignup] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const renderFirebaseUi = useCallback(() => {
    if (typeof window === "undefined") return;

    const selector = "#firebaseuiAuthContainer";

    firebaseUi.start(selector, {
      signInSuccessUrl: "/",
      siteName: "Tanam CMS",
      tosUrl: "https://github.com/oddbit/tanam/blob/main/docs/tos.md",
      privacyPolicyUrl: "https://github.com/oddbit/tanam/blob/main/docs/privacy-policy.md",
      signInOptions: [
        {
          provider: GoogleAuthProvider.PROVIDER_ID,
          fullLabel: isSignUp ? "Sign up with Google" : "Sign in with Google",
        },
      ],
      popupMode: true,
      signInFlow: "popup",
      callbacks: {
        signInSuccessWithAuthResult: ({credential}: {credential: AuthCredential}) => {
          const authCredential = credential.toJSON();
          console.log("[signInSuccessWithAuthResult]", {authCredential});
          return true;
        },

        uiShown: () => {
          setIsLoading(false);
        },
      },
    });
  }, [isSignUp]);

  useEffect(() => {
    renderFirebaseUi();

    return () => {
      firebaseUi.reset();
      setIsLoading(false);
      setIsSignup(false);
    };
  }, [renderFirebaseUi]);

  return {
    isLoading,
    isSignUp,

    setIsLoading,
    setIsSignup,
  };
}
