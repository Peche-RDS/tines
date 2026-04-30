import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  const isProtected = pathname.startsWith("/dashboard") ||
                      pathname.startsWith("/admin") ||
                      pathname.startsWith("/user");

  const isAdminOnly = pathname.startsWith("/admin") ||
                      pathname.startsWith("/dashboard/admin");

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAdminOnly && token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.role !== "admin") {
        return NextResponse.redirect(new URL("/dashboard/user", request.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/user/:path*"],
};
