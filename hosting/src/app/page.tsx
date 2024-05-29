"use client";
import {useAuthentication} from "@/hooks/useAuthentication";
import Image from "next/image";
import {redirect} from "next/navigation";
import {Suspense} from "react";
import Loader from "../components/common/Loader";

export default function HomePage() {
  const {isSignedIn} = useAuthentication();

  if (isSignedIn) {
    redirect("/dashboard");
  }

  return (
    <Suspense fallback={<Loader />}>
      <section className="l-landing-page">
        <div className="fixed left-1/2 top-1/2 w-1/3 -translate-x-1/2 -translate-y-1/2 transform text-center">
          <div className="flex justify-center">
            <Image src="/favicon.ico" width={80} height={80} alt="tanam icon" />
            <h1 className="text-gray-500 mt-10 text-lg font-bold landing-page__title">Tanam CMS</h1>
          </div>
        </div>
      </section>{" "}
    </Suspense>
  );
}
