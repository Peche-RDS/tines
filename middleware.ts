import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  const isProtected = pathname.startsWith("/dashboard");
  const isAdminOnly = pathname.startsWith("/dashboard/admin");

  //  Si no hay token → login
  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token) {
    try {
      //  SOLO decodificar (NO verificar)
      const payload = JSON.parse(
        atob(token.split(".")[1])
      );

      // 🔐 proteger admin
      if (isAdminOnly && payload.role !== "admin") {
        return NextResponse.redirect(new URL("/dashboard/user", request.url));
      }

    } catch (error) {
      console.log("DECODE ERROR:", error);
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};