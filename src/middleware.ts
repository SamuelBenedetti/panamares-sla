import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Sets `x-pathname` on every request so server components (notably the root
 * layout) can read the request URL via `headers()` and pick the right locale.
 *
 * Why this exists: Next.js App Router does not expose the request path to
 * server components by default. The root layout needs it to set
 * `<html lang>` correctly on `/en/*` routes.
 */
export function middleware(req: NextRequest) {
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", req.nextUrl.pathname);

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  // Skip Next.js internals + static files. Run on every page route.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/|.*\\..*).*)"],
};
