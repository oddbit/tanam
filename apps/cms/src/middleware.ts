import type {NextRequest} from "next/server";
import {NextResponse} from "next/server";

export function middleware(req: NextRequest) {
  const {pathname, locale} = req.nextUrl;

  console.info("middleware pathname :: ", pathname);
  console.info("middleware pathname :: ", pathname === `/${locale}/auth`);
  console.info("middleware locale :: ", locale);

  if (pathname === `/${locale}/auth` || pathname === "/auth") {
    return NextResponse.redirect(new URL(`/${locale}/auth/signin`, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};
