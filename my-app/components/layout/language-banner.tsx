"use client";

import { usePathname } from "next/navigation";
import { useState, useSyncExternalStore } from "react";

import { LOCALE_COOKIE, localizedPath, type Locale } from "@/lib/i18n/config";

import { rememberLocale } from "./language-switch";

const DISMISS_KEY = "language-banner-dismissed";

type LanguageBannerProps = {
  lang: Locale;
  /** Question and action are written in the suggested language. */
  question: string;
  action: string;
  dismiss: string;
};

/** First of the browser's languages that the site supports. */
function preferredLocale(): Locale | null {
  for (const tag of navigator.languages ?? [navigator.language]) {
    const base = tag.toLowerCase().split("-")[0];
    if (base === "ar" || base === "en") return base;
  }
  return null;
}

function hasExplicitChoice(): boolean {
  return document.cookie
    .split("; ")
    .some((pair) => pair.startsWith(`${LOCALE_COOKIE}=`));
}

function wasDismissed(): boolean {
  try {
    return sessionStorage.getItem(DISMISS_KEY) === "1";
  } catch {
    return false;
  }
}

const subscribe = () => () => {};

/**
 * FR-FE-02: suggest the other language instead of redirecting. Decided in
 * the browser (navigator.languages mirrors Accept-Language) so pages stay
 * statically rendered.
 */
export function LanguageBanner({
  lang,
  question,
  action,
  dismiss,
}: LanguageBannerProps) {
  const pathname = usePathname();
  const [dismissed, setDismissed] = useState(false);
  const suggested = useSyncExternalStore(
    subscribe,
    () => {
      if (hasExplicitChoice() || wasDismissed()) return null;
      const preferred = preferredLocale();
      return preferred && preferred !== lang ? preferred : null;
    },
    () => null,
  );

  if (!suggested || dismissed) return null;

  const dir = suggested === "ar" ? "rtl" : "ltr";

  return (
    <aside
      lang={suggested}
      dir={dir}
      className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 border-b border-line bg-surface px-4 py-2 text-sm"
    >
      <span>{question}</span>
      <a
        href={localizedPath(pathname, suggested)}
        hrefLang={suggested}
        className="font-semibold text-gold underline-offset-4 hover:underline"
        onClick={() => rememberLocale(suggested)}
      >
        {action}
      </a>
      <button
        type="button"
        className="text-silver hover:text-offwhite"
        onClick={() => {
          try {
            sessionStorage.setItem(DISMISS_KEY, "1");
          } catch {
            // Storage unavailable: dismiss for this page view only.
          }
          setDismissed(true);
        }}
      >
        {dismiss}
      </button>
    </aside>
  );
}
