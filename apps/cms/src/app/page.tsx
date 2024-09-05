"use client";
import { useAuthentication } from "@tanam/cms/hooks/useAuthentication";
import { redirect } from "next/navigation";
import Loader from "../components/common/Loader";

export default function HomePage() {
  const {isSignedIn} = useAuthentication();

  if (isSignedIn === true) {
    redirect("/dashboard");
  } else if (isSignedIn === false) {
    redirect("/auth");
  }

  return <Loader />;
}
