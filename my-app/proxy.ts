import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Proxy (Next.js 16 middleware) — FE-0.
 *
 * FR-FE-02: English at the root, Arabic under /ar, no automatic language
 * redirect. Unprefixed paths are rewritten internally to /en/*; /en/* URLs
 * 308-redirect to the unprefixed form so English has one canonical URL.
 * FR-FE-96: non-production deployments send X-Robots-Tag: noindex.
 * NFR-FE-S2: baseline security headers + CSP stub (full nonce CSP in FE-6).
 */

const PUBLIC_FILE = /\.(.*)$/;

function securityHeaders(isProduction: boolean): Record<string, string> {
  const headers: Record<string, string> = {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    // CSP stub — full nonce-based CSP ships in FE-6.
    "Content-Security-Policy": [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      "connect-src 'self' https:",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  };

  if (!isProduction) {
    headers["X-Robots-Tag"] = "noindex, nofollow";
  }

  return headers;
}

function withSecurityHeaders(
  response: NextResponse,
  isProduction: boolean,
): NextResponse {
  for (const [key, value] of Object.entries(securityHeaders(isProduction))) {
    response.headers.set(key, value);
  }
  return response;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProduction =
    process.env.NEXT_PUBLIC_SITE_URL === "https://kareemsabry.dev";

  // ---- Routing (FR-FE-02) -------------------------------------------------

  // Metadata files, API routes and static files bypass language handling.
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/cv" ||
    PUBLIC_FILE.test(pathname)
  ) {
    return withSecurityHeaders(NextResponse.next(), isProduction);
  }

  const hasArPrefix = pathname === "/ar" || pathname.startsWith("/ar/");
  const hasEnPrefix = pathname === "/en" || pathname.startsWith("/en/");

  // (b) /en/* is a duplicate of the root URLs — 308 to the unprefixed form.
  if (hasEnPrefix) {
    const url = request.nextUrl.clone();
    url.pathname = pathname === "/en" ? "/" : pathname.slice(3);
    return withSecurityHeaders(
      NextResponse.redirect(url, 308),
      isProduction,
    );
  }

  // (a) Rewrite unprefixed paths to /en internally.
  if (!hasArPrefix) {
    const url = request.nextUrl.clone();
    url.pathname = pathname === "/" ? "/en" : `/en${pathname}`;
    return withSecurityHeaders(NextResponse.rewrite(url), isProduction);
  }

  // /ar/* renders as-is with the same security headers.
  return withSecurityHeaders(NextResponse.next(), isProduction);
}

export const config = {
  matcher: [
    // Run on everything except Next internals; api/cv and file-extension
    // requests are further short-circuited inside the handler.
    "/((?!_next/static|_next/image|api|cv).*)",
  ],
};
