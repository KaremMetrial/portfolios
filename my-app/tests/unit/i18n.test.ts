import { describe, expect, it } from "vitest";

import {
  dir,
  isLocale,
  localizedPath,
  unprefixedPath,
} from "@/lib/i18n/config";
import ar from "@/lib/i18n/dictionaries/ar.json";
import en from "@/lib/i18n/dictionaries/en.json";
import { resolveLocaleRoute } from "@/lib/i18n/routing";
import { isProductionOrigin, PRODUCTION_ORIGIN } from "@/lib/site";

describe("resolveLocaleRoute (FR-FE-02)", () => {
  it.each([
    ["/", "/en"],
    ["/projects", "/en/projects"],
    ["/projects/barq", "/en/projects/barq"],
    ["/english", "/en/english"],
    ["/arabic", "/en/arabic"],
    ["/cvs", "/en/cvs"],
    ["/api-docs", "/en/api-docs"],
  ])("rewrites %s to %s", (pathname, target) => {
    expect(resolveLocaleRoute(pathname)).toEqual({
      type: "rewrite",
      pathname: target,
    });
  });

  it.each([
    ["/en", "/"],
    ["/en/projects", "/projects"],
    ["/en/projects/barq", "/projects/barq"],
  ])("redirects %s to %s with 308", (pathname, target) => {
    expect(resolveLocaleRoute(pathname)).toEqual({
      type: "redirect",
      pathname: target,
      status: 308,
    });
  });

  it.each([
    "/ar",
    "/ar/projects",
    "/api/revalidate",
    "/api",
    "/cv",
    "/robots.txt",
    "/favicon.ico",
    "/_next/data/x.json",
  ])("passes %s through", (pathname) => {
    expect(resolveLocaleRoute(pathname)).toEqual({ type: "next" });
  });
});

describe("locale helpers", () => {
  it("recognizes only supported locales", () => {
    expect(isLocale("en")).toBe(true);
    expect(isLocale("ar")).toBe(true);
    expect(isLocale("fr")).toBe(false);
  });

  it("maps direction", () => {
    expect(dir("en")).toBe("ltr");
    expect(dir("ar")).toBe("rtl");
  });

  it.each([
    ["/ar/projects", "/projects"],
    ["/ar", "/"],
    ["/en/about", "/about"],
    ["/about", "/about"],
    ["/arabic", "/arabic"],
  ])("unprefixes %s to %s", (pathname, expected) => {
    expect(unprefixedPath(pathname)).toBe(expected);
  });

  it.each([
    ["/", "ar", "/ar"],
    ["/projects", "ar", "/ar/projects"],
    ["/ar/projects", "en", "/projects"],
    ["/ar", "en", "/"],
    ["/about", "en", "/about"],
  ] as const)("localizes %s for %s as %s", (pathname, locale, expected) => {
    expect(localizedPath(pathname, locale)).toBe(expected);
  });
});

describe("dictionaries", () => {
  function keys(value: unknown, prefix = ""): string[] {
    if (typeof value !== "object" || value === null) return [prefix];
    return Object.entries(value).flatMap(([key, child]) =>
      keys(child, prefix ? `${prefix}.${key}` : key),
    );
  }

  it("have the same keys in en and ar", () => {
    expect(keys(ar).sort()).toEqual(keys(en).sort());
  });
});

describe("isProductionOrigin (FR-FE-96)", () => {
  it("accepts only the production origin", () => {
    expect(isProductionOrigin(PRODUCTION_ORIGIN)).toBe(true);
    expect(isProductionOrigin(`${PRODUCTION_ORIGIN}/`)).toBe(true);
    expect(isProductionOrigin("http://localhost:3000")).toBe(false);
    expect(isProductionOrigin(`${PRODUCTION_ORIGIN}.evil.test`)).toBe(false);
    expect(isProductionOrigin(undefined)).toBe(false);
    expect(isProductionOrigin("not a url")).toBe(false);
  });
});
