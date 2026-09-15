/**
 * i18n routing config (FR-FE-01, FR-FE-02).
 * English is served unprefixed at the root; Arabic lives under /ar.
 */
export const locales = ["en", "ar"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const LOCALE_COOKIE = "NEXT_LOCALE";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function dir(locale: Locale): "ltr" | "rtl" {
  return locale === "ar" ? "rtl" : "ltr";
}

/** /ar/projects → /projects (English equivalent, no prefix). */
export function unprefixedPath(pathname: string): string {
  for (const locale of locales) {
    if (pathname === `/${locale}`) return "/";
    if (pathname.startsWith(`/${locale}/`)) {
      return pathname.slice(locale.length + 1);
    }
  }
  return pathname;
}

/** Public URL of a path in a locale: English unprefixed, Arabic under /ar. */
export function localizedPath(pathname: string, locale: Locale): string {
  const path = unprefixedPath(pathname);
  if (locale === defaultLocale) return path;
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}
