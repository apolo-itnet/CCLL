import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const token =
    request.cookies.get("next-auth.session-token") ||
    request.cookies.get("__Secure-next-auth.session-token");

  const isDashboard = request.nextUrl.pathname.startsWith("/dashboard");

  if (isDashboard && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};