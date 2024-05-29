"use client";
import {useAuthentication} from "@/hooks/useAuthentication";
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
      <h1>Tanam CMS</h1>
      <p>Login etc</p>
    </Suspense>
  );
}
