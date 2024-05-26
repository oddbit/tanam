import React from "react";
import "@/assets/scss/layout-authentication.scss";
import {Metadata} from "next";
import Image from "next/image";
import BlankLayout from "@/components/Layouts/BlankLayout";
import AuthUser from "@/components/AuthUser";

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
              <h1 className="text-gray-500 mt-10 text-lg font-bold text-white authentication__title">Signout</h1>
            </div>

            <div className="authentication__wrapper-content">
              Logout
              <AuthUser />
            </div>
          </div>
        </section>
      </BlankLayout>
    </>
  );
}
