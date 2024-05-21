import React from "react";
import Link from "next/link";

import { Metadata } from "next";
import { SignUpWithGoogle } from "./_components/SignUpWithGoogle";

export const metadata: Metadata = {
  title: "Tanam | Sign Up",
};

const SignUp: React.FC = () => {
  return (
    <div className="fixed left-1/2 top-1/2 w-1/3 -translate-x-1/2 -translate-y-1/2 transform">
      <SignUpWithGoogle />
      <div className="mt-6 text-center">
        <p>
          Already have an account?{" "}
          <Link href="/auth/signin" className="text-primary">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
