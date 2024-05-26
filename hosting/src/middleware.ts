import {type NextRequest, NextResponse} from "next/server";
import {ROOT_ROUTE, SIGN_IN_ROUTE, SESSION_COOKIE_NAME, SIGN_OUT_ROUTE, SIGN_UP_ROUTE} from "@/constants"

const EXCEPT_PAGE = [
  ROOT_ROUTE,
  SIGN_IN_ROUTE,
  SIGN_UP_ROUTE,
  SIGN_OUT_ROUTE
]

export default function middleware(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value || "";

  if (!token && EXCEPT_PAGE.includes(request.nextUrl.pathname)) {
    const absoluteURL = new URL(SIGN_IN_ROUTE, request.nextUrl.origin);
    return NextResponse.redirect(absoluteURL.toString());
  }

  return NextResponse.next();
}
