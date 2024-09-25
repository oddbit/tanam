"use client";
import {useEffect} from "react";
import {useAuthentication} from "../hooks/useAuthentication";

const SignoutUser: React.FC = () => {
  const {signout} = useAuthentication();

  useEffect(() => {
    const actionSignout = () => {
      signout();
    };

    actionSignout();
  }, [signout]);

  return null;
};

export default SignoutUser;
