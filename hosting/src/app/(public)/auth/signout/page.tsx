import React from "react";
import "@/assets/scss/layout-authentication.scss";
import {Metadata} from "next";
import Image from "next/image";
import BlankLayout from "@/components/Layouts/BlankLayout";
// import AuthUser from "@/components/AuthUser";
import SignoutUser from "@/components/SignoutUser";

export const metadata: Metadata = {
  title: "Tanam | Signout",
  description: "Signout in Tanam",
};

export default function SignoutPage() {
  return (
    <>
      <BlankLayout>
        <section className="l-authentication">
          <div className="fixed left-1/2 top-1/2 w-1/3 -translate-x-1/2 -translate-y-1/2 transform text-center">
            <div className="flex justify-center">
              <Image src="/favicon.ico" width={80} height={80} alt="tanam icon" />
            </div>

            <SignoutUser />

            {/* Showing this section when you want to check auth user data */}
            {/* <div className="authentication__wrapper-content">
              Logout
              <AuthUser />
            </div> */}
          </div>
        </section>
      </BlankLayout>
    </>
  );
}
