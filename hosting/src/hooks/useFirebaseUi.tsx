"use client";
import {firebaseUi} from "@/plugins/firebase";
import {auth as firebaseAuthUi} from "firebaseui";
import {AuthCredential, GoogleAuthProvider} from "firebase/auth";
import "firebaseui/dist/firebaseui.css";
import {useEffect, useState} from "react";

export function useFirebaseUi() {
  const [isSignUp, setIsSignup] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    renderFirebaseUi(firebaseUi);

    return () => {
      setIsLoading(false);
      setIsSignup(false);
    };
  }, []);

  function renderFirebaseUi(ui: firebaseAuthUi.AuthUI) {
    if (!window || typeof window === "undefined") return;

    const selector = "#firebaseuiAuthContainer";

    ui.start(selector, {
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
  }

  return {
    isLoading,
    isSignUp,

    setIsLoading,
    setIsSignup,
  };
}
