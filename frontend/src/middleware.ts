import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

const protectedRoutes = ["/dashboard/admin/home"];
const publicRoutes = ["/login", "/"];
// TODO: add admin specific admin routes
const adminRoutes = ["/dashboard/admin/home"];

export default function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isAdminRoute = adminRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path) || path === "/";

  // Always redirect to login if no session cookie exists
  const sessionCookie = cookies().get("session")?.value;
  if (isProtectedRoute && !sessionCookie) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (isPublicRoute && isAdminRoute && sessionCookie) {
    return NextResponse.redirect(new URL("/dashboard/admin/home", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
