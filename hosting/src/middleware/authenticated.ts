import {type NextRequest, NextResponse} from "next/server";
import {ROOT_ROUTE, SIGN_IN_ROUTE, SESSION_COOKIE_NAME} from "@/constants"

export const EXCEPT_PAGE = [ROOT_ROUTE]

export default function authenticatedMiddleware(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value || "";

  if (!token && EXCEPT_PAGE.includes(request.nextUrl.pathname)) {
    const absoluteURL = new URL(SIGN_IN_ROUTE, request.nextUrl.origin);
    return NextResponse.redirect(absoluteURL.toString());
  }
}
