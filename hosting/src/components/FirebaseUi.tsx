"use client"
import "@/assets/scss/layout-authentication.scss";
import {useEffect} from 'react';
import {useFirebaseUi} from "@/hooks/useFirebaseUi";

interface FirebaseUiProps {
  isSignUp: boolean;
}

const FirebaseUi: React.FC<FirebaseUiProps> = ({isSignUp}) => {
  const {setIsSignup} = useFirebaseUi()

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
