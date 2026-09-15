"use client";

import { usePathname } from "next/navigation";

import { track } from "@/lib/analytics";
import { LOCALE_COOKIE, localizedPath, type Locale } from "@/lib/i18n/config";

type LanguageSwitchProps = {
  lang: Locale;
  label: string;
  /** Name of the other language, written in that language. */
  switchLabel: string;
};

/** Remembers an explicit language choice; never used to redirect (FR-FE-02). */
export function rememberLocale(locale: Locale): void {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
}

/**
 * FR-FE-05: keeps path and query, sets NEXT_LOCALE, sends language_switch.
 * A plain link, so it works without JavaScript and is crawlable.
 */
export function LanguageSwitch({
  lang,
  label,
  switchLabel,
}: LanguageSwitchProps) {
  const pathname = usePathname();
  const target: Locale = lang === "ar" ? "en" : "ar";
  const href = localizedPath(pathname, target);

  return (
    <a
      href={href}
      hrefLang={target}
      lang={target}
      aria-label={`${label}: ${switchLabel}`}
      className="rounded-md px-2 py-1 text-sm text-offwhite/80 transition-colors hover:text-gold"
      onClick={(event) => {
        event.preventDefault();
        rememberLocale(target);
        track("language_switch", { from: lang, to: target });
        window.location.assign(href + window.location.search);
      }}
    >
      {switchLabel}
    </a>
  );
}
