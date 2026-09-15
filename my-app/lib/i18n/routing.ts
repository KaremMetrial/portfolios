/**
 * Locale routing decision for proxy.ts (FR-FE-02), kept pure for unit tests.
 *
 * English is served unprefixed (internally rewritten to /en), Arabic lives
 * under /ar, and /en/* is 308-redirected to its unprefixed form. There is no
 * redirect based on Accept-Language or cookies.
 */
export type RouteDecision =
  | { type: "next" }
  | { type: "rewrite"; pathname: string }
  | { type: "redirect"; pathname: string; status: 308 };

/** A final path segment with a file extension: /robots.txt, /icon.svg. */
const FILE_PATH = /\/[^/]+\.[a-z0-9]+$/i;

/** Paths that never take a locale: API routes and the CV redirect. */
const BYPASS_PATH = /^\/(?:api|cv)(?:\/|$)/;

function hasPrefix(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export function resolveLocaleRoute(pathname: string): RouteDecision {
  if (
    pathname.startsWith("/_next") ||
    BYPASS_PATH.test(pathname) ||
    FILE_PATH.test(pathname)
  ) {
    return { type: "next" };
  }

  if (hasPrefix(pathname, "/en")) {
    return {
      type: "redirect",
      pathname: pathname === "/en" ? "/" : pathname.slice("/en".length),
      status: 308,
    };
  }

  if (hasPrefix(pathname, "/ar")) {
    return { type: "next" };
  }

  return {
    type: "rewrite",
    pathname: pathname === "/" ? "/en" : `/en${pathname}`,
  };
}
