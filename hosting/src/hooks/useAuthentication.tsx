import {useState, useEffect} from "react";
import 'firebaseui/dist/firebaseui.css'
import {auth as firebaseAuthUi} from "firebaseui"
import {firebaseAuth} from "@/plugins/firebase";
import {EmailAuthProvider, GoogleAuthProvider} from 'firebase/auth';

const firebaseUi = new firebaseAuthUi.AuthUI(firebaseAuth)

export function useAuthentication() {
  const [isSignUp, setIsSignup] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (window) {
      renderFirebaseUi()
    }

    return () => {
      setIsLoading(false)
      setIsSignup(false)
    }
  })

  function renderFirebaseUi() {
    const selector = '#firebaseuiAuthContainer'

    firebaseUi.start(selector, {
      signInSuccessUrl: window.location.origin,
      signInOptions: [
        {
          provider: EmailAuthProvider.PROVIDER_ID,
          fullLabel: isSignUp
            ? 'Sign up with email'
            : 'Sign in with email'
        },
        {
          provider: GoogleAuthProvider.PROVIDER_ID,
          fullLabel: isSignUp
            ? 'Sign up with Google'
            : 'Sign in with Google'
        }
      ],
      popupMode: true,
      signInFlow: 'popup',
      callbacks: {
        signInSuccessWithAuthResult: ({ credential }) => {
          // Set credential after signin success
          console.info('signInSuccessWithAuthResult :: ', credential)

          return true
        },

        uiShown: () => {
          setIsLoading(false)
        }
      }
    })
  }

  return {
    isLoading,
    isSignUp,
    
    setIsLoading,
    setIsSignup
  }
}