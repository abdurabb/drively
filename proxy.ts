import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ACCESS_TOKEN_COOKIE } from "@/src/lib/authSession";

const AUTH_PAGES = ["/login", "/signup", "/forgot-password", "/verify-otp"];
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/bookings",
  "/profile",
  "/admin",
  "/reviews",
  "/vendor",
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;

  // 1. Authenticated users cannot access guest-only auth pages (/login, /signup)
  if (
    token &&
    AUTH_PAGES.some(
      (path) => pathname === path || pathname.startsWith(`${path}/`)
    )
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 2. Unauthenticated users cannot access protected routes
  if (
    !token &&
    PROTECTED_PREFIXES.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
    )
  ) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set(
      "redirect",
      `${pathname}${request.nextUrl.search}`,
    );
    return NextResponse.redirect(loginUrl);
  }

  // 3. Landing page ("/"), "/cars", "/companies" and any other routes are public
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico
     * - static files with extensions (svg, png, jpg, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
