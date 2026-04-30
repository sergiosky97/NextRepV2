import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const protectedWithSettings = ["/home", "/settings"];

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const accessToken = request.cookies.get("nextrep_access_token")?.value;

  const isProtected = protectedWithSettings.some((route) => pathname.startsWith(route));
  if (isProtected && !accessToken) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith("/login") && accessToken) {
    const homeUrl = new URL("/home", request.url);
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/register", "/forgot-password", "/reset-password", "/home/:path*", "/settings/:path*"]
};
