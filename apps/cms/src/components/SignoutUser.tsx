"use client";
import {useAuthentication} from "@tanam/cms/hooks/useAuthentication";
import {useEffect} from "react";

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
