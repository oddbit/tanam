"use client"
import "@/assets/scss/layout-authentication.scss";
import {useEffect} from 'react';
import {useAuthentication} from "@/hooks/useAuthentication";

interface FirebaseUiProps {
  isSignUp: boolean;
}

const FirebaseUi: React.FC<FirebaseUiProps> = ({isSignUp}) => {
  const {setIsSignup} = useAuthentication()

  useEffect(() => {
    setIsSignup(isSignUp)

    return () => {
      setIsSignup(false);
    }
  });

  return (
    <>
      <div id="firebaseuiAuthContainer" />
    </>
  );
}

export default FirebaseUi
