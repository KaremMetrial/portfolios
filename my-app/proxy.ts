import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { resolveLocaleRoute } from "@/lib/i18n/routing";
import { isProductionOrigin } from "@/lib/site";

/**
 * Proxy (Next.js 16 middleware), FE-0.
 *
 * FR-FE-02: locale routing, see lib/i18n/routing.ts.
 * FR-FE-96: non-production deployments send X-Robots-Tag: noindex.
 * NFR-FE-S2: baseline security headers + CSP stub (full nonce CSP in FE-6).
 */

function securityHeaders(isProduction: boolean): Record<string, string> {
  const headers: Record<string, string> = {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    // CSP stub: the nonce-based policy ships in FE-6.
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

  if (isProduction) {
    headers["Strict-Transport-Security"] =
      "max-age=63072000; includeSubDomains; preload";
  } else {
    headers["X-Robots-Tag"] = "noindex, nofollow";
  }

  return headers;
}

export function proxy(request: NextRequest) {
  const isProduction = isProductionOrigin(process.env.NEXT_PUBLIC_SITE_URL);
  const decision = resolveLocaleRoute(request.nextUrl.pathname);

  let response: NextResponse;
  if (decision.type === "next") {
    response = NextResponse.next();
  } else {
    const url = request.nextUrl.clone();
    url.pathname = decision.pathname;
    response =
      decision.type === "redirect"
        ? NextResponse.redirect(url, decision.status)
        : NextResponse.rewrite(url);
  }

  for (const [key, value] of Object.entries(securityHeaders(isProduction))) {
    response.headers.set(key, value);
  }
  return response;
}

export const config = {
  matcher: [
    // Everything except build assets and the image optimizer; api, cv and
    // file requests still get security headers but skip locale routing.
    "/((?!_next/static|_next/image).*)",
  ],
};
