import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const timestamp = new Date().toISOString();
  console.warn(
    `[MIDDLEWARE] Accessed path: ${request.nextUrl.pathname} at: ${timestamp}`
  );
  if (request.nextUrl.pathname === "/ads.txt") {
    console.warn(`[MIDDLEWARE] ads.txt accessed at: ${timestamp}`);
    const response = NextResponse.next();
    response.headers.set("Cache-Control", "no-store, max-age=0");
    return response;
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
