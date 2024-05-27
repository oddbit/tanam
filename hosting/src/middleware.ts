import {type NextRequest, NextResponse} from "next/server";
import {ROOT_ROUTE, SIGN_IN_ROUTE, SIGN_UP_ROUTE, SESSION_COOKIE_NAME} from "@/constants";

const EXCEPT_PAGE = [ROOT_ROUTE, SIGN_IN_ROUTE, SIGN_UP_ROUTE];

export default function middleware(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value || "";
  // This siteId should be dynamic in the next iteration
  const siteId = "tanam-testing";

  if (token && EXCEPT_PAGE.includes(request.nextUrl.pathname)) {
    if (request.nextUrl.pathname === `${ROOT_ROUTE}${siteId}`) return;

    const absoluteURL = new URL(`${ROOT_ROUTE}${siteId}`, request.nextUrl.origin);
    return NextResponse.redirect(absoluteURL.toString());
  }

  return NextResponse.next();
}
