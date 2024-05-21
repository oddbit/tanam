import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { SignInWithGoogle } from "./_components/SignInWithGoogle";

export const metadata: Metadata = {
  title: "Tanam | Sign In",
};

const SignIn: React.FC = () => {
  return (
    <div className="fixed left-1/2 top-1/2 w-1/3 -translate-x-1/2 -translate-y-1/2 transform">
      <SignInWithGoogle />
      <div className="mt-6 text-center">
        <p>
          Don’t have any account?{" "}
          <Link href="/auth/signup" className="text-primary">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
