"use client";
import "@tanam/cms/assets/scss/layout-authentication.scss";
import Image from "next/image";
import {notFound, useParams} from "next/navigation";
import {useEffect} from "react";
import {useFirebaseUi} from "../../../../hooks/useFirebaseUi";

export default function AuthPage() {
  const {authAction} = useParams<{authAction: string}>() ?? {};
  const {setIsSignup} = useFirebaseUi();

  const isSignUp = authAction === "signup";
  const isSignIn = authAction === "signin";

  if (!isSignUp && !isSignIn) {
    return notFound();
  }

  useEffect(() => {
    setIsSignup(isSignUp);

    return () => {
      setIsSignup(false);
    };
  });

  return (
    <>
      <section className="l-authentication">
        <div className="fixed left-1/2 top-1/2 w-1/3 -translate-x-1/2 -translate-y-1/2 transform text-center">
          <div className="flex justify-center">
            <Image src="/favicon.ico" width={80} height={80} alt="tanam icon" />
            <h1 className="text-gray-500 mt-10 text-lg font-bold authentication__title">
              {isSignUp ? "Signup" : "Signin"}
            </h1>
          </div>

          <div className="authentication__wrapper-content">
            <div id="firebaseuiAuthContainer" />
          </div>
        </div>
      </section>
    </>
  );
}
