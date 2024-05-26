"use client";
import "@/assets/scss/layout-authentication.scss";
import {useAuthentication} from "@/hooks/useAuthentication";

const AuthUser: React.FC = () => {
  const {authState, signout} = useAuthentication();

  function actionSignout() {
    signout();
  }

  return (
    <>
      <h1>Auth User</h1>
      <p>Content of the page goes here</p>
      <p>authState :: {JSON.stringify(authState)}</p>
      <button
        className="hover:bg-primary-dark mt-10 rounded-md bg-primary px-4 py-2 text-white transition-colors"
        onClick={() => actionSignout()}
      >
        Logout
      </button>
    </>
  );
};

export default AuthUser;
