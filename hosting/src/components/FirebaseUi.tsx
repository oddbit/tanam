"use client"
import "@/assets/scss/layout-authentication.scss";
import {useEffect} from 'react';
import {useAuthentication} from "@/hooks/useAuthentication";

export default function FirebaseUi() {
  const {setIsSignup} = useAuthentication()

  useEffect(() => {
    setIsSignup(false);
  }, []);

  return (
    <>
      <div id="firebaseuiAuthContainer" />
    </>
  );
}
