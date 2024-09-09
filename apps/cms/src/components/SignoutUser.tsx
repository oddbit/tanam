"use client";
import {useEffect} from "react";
import {useAuthentication} from "../hooks/useAuthentication";

const SignoutUser: React.FC = () => {
  const {signout} = useAuthentication();

  useEffect(() => {
    actionSignout();
  }, []);

  function actionSignout() {
    signout();
  }

  return <></>;
};

export default SignoutUser;
