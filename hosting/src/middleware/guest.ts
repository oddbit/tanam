import {type NextRequest, NextResponse} from "next/server";
import {ROOT_ROUTE, SESSION_COOKIE_NAME} from "@/constants"

export default function guestMiddleware(request: NextRequest) {
  const session = request.cookies.get(SESSION_COOKIE_NAME)?.value || "";
  // This siteId should be dynamic in the next iteration
  const siteId = "tanam-testing"

  if (session) {
    const absoluteURL = new URL(`${ROOT_ROUTE}${siteId}`, request.nextUrl.origin);
    return NextResponse.redirect(absoluteURL.toString());
  }
}
