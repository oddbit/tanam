"use client";
import {Loader} from "@tanam/ui-components";
import {redirect} from "next/navigation";
import {useAuthentication} from "../hooks/useAuthentication";

export default function HomePage() {
  const {isSignedIn} = useAuthentication();

  if (isSignedIn === true) {
    redirect("/dashboard");
  } else if (isSignedIn === false) {
    redirect("/auth");
  }

  return <Loader />;
}
