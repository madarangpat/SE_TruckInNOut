import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

const publicRoutes = ["/login"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = path.startsWith("/dashboard");
  const isPublicRoute = publicRoutes.includes(path);

  // Always redirect to login if no session cookie exists
  const sessionCookie = cookies().get("session");
  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  let tokens;
  try {
    // Parse the cookie to get both tokens
    tokens = JSON.parse(sessionCookie.value);
  } catch (error) {
    // If the session cookie is malformed, redirect to login
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // Decode the access token
  let decodedAccessToken;
  try {
    decodedAccessToken = jwtDecode(tokens.access);
  } catch (error) {
    // If decoding fails, redirect to login
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // For public routes, if a valid access token exists, redirect to dashboard
  if (isPublicRoute && decodedAccessToken) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  // For protected routes, if no valid access token is found, redirect to login
  if (isProtectedRoute && !decodedAccessToken) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};