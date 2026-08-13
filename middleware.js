import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { ADMIN_COOKIE, AUTH_COOKIE } from "@/lib/session";

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  const isAdminPage = pathname.startsWith("/admin") && pathname !== "/admin/login";
  if (isAdminPage) {
    const token = req.cookies.get(ADMIN_COOKIE)?.value;
    const payload = token ? await verifyToken(token, true) : null;

    if (payload?.role !== "admin") {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // First-visit gate: send anyone who isn't logged in to a clean
  // login/signup landing page instead of straight into the shop.
  if (pathname === "/") {
    const token = req.cookies.get(AUTH_COOKIE)?.value;
    const payload = token ? await verifyToken(token) : null;
    if (!payload) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/"],
};
