import ECommerce from "@/components/Dashboard/E-commerce";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME } from "../constants";

export const metadata: Metadata = {
  title:
    "Next.js E-commerce Dashboard | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default function Home() {
  const session = cookies().get(SESSION_COOKIE_NAME)?.value ?? null;
  return (
    <>
      <DefaultLayout session={session}>
        <ECommerce />
      </DefaultLayout>
    </>
  );
}
