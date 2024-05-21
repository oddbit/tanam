import { type NextRequest, NextResponse } from "next/server";
import {
  ROOT_ROUTE,
  SESSION_COOKIE_NAME,
  SIGN_IN_ROUTE,
  SIGN_UP_ROUTE,
} from "./constants";

const protectedRoutes = [ROOT_ROUTE];

export default function middleware(request: NextRequest) {
  const session = request.cookies.get(SESSION_COOKIE_NAME)?.value || "";

  // Redirect to login if session is not set
  if (!session && protectedRoutes.includes(request.nextUrl.pathname)) {
    const absoluteURL = new URL(SIGN_IN_ROUTE, request.nextUrl.origin);
    return NextResponse.redirect(absoluteURL.toString());
  }

  // Redirect to home if session is set and user tries to access root
  if (
    session &&
    (request.nextUrl.pathname === SIGN_IN_ROUTE ||
      request.nextUrl.pathname === SIGN_UP_ROUTE)
  ) {
    const absoluteURL = new URL(ROOT_ROUTE, request.nextUrl.origin);
    return NextResponse.redirect(absoluteURL.toString());
  }
}
