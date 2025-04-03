import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./auth/session";

const adminRoutes = ["/dashboard/admin/home"];
const employeeRoutes = ["/dashboard/employee/home"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = path.startsWith("/dashboard");
  const session = getSession();
  const user = session?.user;

  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // if (user) {
  //   if (
  //     adminRoutes.includes(path) &&
  //     user.role !== "admin" &&
  //     user.role !== "super_admin"
  //   ) {
  //     return NextResponse.redirect(
  //       new URL("/dashboard/employee/home", req.nextUrl)
  //     );
  //   }

  //   if (
  //     adminRoutes.includes(path) &&
  //     (user.role !== "admin" &&
  //     user.role !== "super_admin") &&
  //     user.employee_type === "Staff"
  //   ) {
  //     return NextResponse.redirect(
  //       new URL("/dashboard/employee/home", req.nextUrl)
  //     );
  //   }

  //   if (
  //     employeeRoutes.includes(path) &&
  //     (user.role === "admin" || user.role === "super_admin")
  //   ) {
  //     return NextResponse.redirect(
  //       new URL("/dashboard/admin/home", req.nextUrl)
  //     );
  //   }
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
