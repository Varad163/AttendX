import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const pathname = req.nextUrl.pathname;

  // Public routes allowed
  const publicRoutes = ["/login", "/register", "/"];
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // User not logged in → redirect
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Role-based protection
  if (pathname.startsWith("/teacher") && token.role !== "teacher") {
    return NextResponse.redirect(new URL("/student/history", req.url));
  }

  if (pathname.startsWith("/student") && token.role !== "student") {
    return NextResponse.redirect(new URL("/teacher/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/teacher/:path*", "/student/:path*", "/login", "/register"],
};
