import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const isLoggedIn = req.cookies.get("adminUser")?.value === "true";

  // Protect all routes under /admin
  if (req.nextUrl.pathname.startsWith("/admin")) {
    if (!isLoggedIn) {
      // redirect to root ("/") if not logged in
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

// Run middleware only on /admin routes
export const config = {
  matcher: ["/admin/:path*"],
};
