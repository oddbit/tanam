"use server";

import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {ROOT_ROUTE, SESSION_COOKIE_NAME} from "@/constants";

export async function createSession(token: string) {
  cookies().set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // One day
    path: "/",
  });

  redirect(ROOT_ROUTE);
}

export async function removeSession() {
  cookies().delete(SESSION_COOKIE_NAME);

  redirect(ROOT_ROUTE);
}