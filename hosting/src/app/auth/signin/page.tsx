import React from "react";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { SignInWithGoogle } from "./_components/SignInWithGoogle";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME } from "../../../constants";

export const metadata: Metadata = {
  title: "Tanam | Sign In",
};

const SignIn: React.FC = () => {
  const session = cookies().get(SESSION_COOKIE_NAME)?.value ?? null;

  return (
    <DefaultLayout session={session}>
      <Breadcrumb pageName="Sign In" />

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-wrap items-center">
          <div className="m-auto w-full text-center xl:w-1/2">
            <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
              <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                Sign in to Tanam
              </h2>
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
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default SignIn;
