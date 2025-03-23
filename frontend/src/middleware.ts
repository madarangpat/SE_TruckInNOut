import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const adminRoutes = ["/dashboard/admin/home"];
const employeeRoutes = ["/dashboard/employee/home"];

export default function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = path.startsWith("/dashboard")

  const sessionCookie = cookies().get("session")?.value;
  let session = null;
  let user = null;
  if (sessionCookie) {
    try {
      session = JSON.parse(sessionCookie);
      user = session.user;
    } catch (error) {
      console.error("Error parsing session cookie:", error);
    }
  }

  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (user) {
    if (adminRoutes.includes(path) && user.role !== "admin" && user.role !== "super_admin") {
      return NextResponse.redirect(new URL("/dashboard/employee/home", req.nextUrl));
    }

    if (employeeRoutes.includes(path) && (user.role === "admin" || user.role === "super_admin")) {
      return NextResponse.redirect(new URL("/dashboard/admin/home", req.nextUrl));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
};
