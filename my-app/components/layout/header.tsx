import Link from "next/link";

import { MetrialMark } from "@/components/brand/metrial-mark";
import { localizedPath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

import { LanguageSwitch } from "./language-switch";

type HeaderProps = {
  lang: Locale;
  dict: Dictionary;
  /** The other locale's dictionary, for the language switch label. */
  otherDict: Dictionary;
};

/**
 * Header shell (FE-0). FR-FE-70 adds scroll condensing, the mobile sheet,
 * the ⌘K hint and Under the Hood in FE-1 and FE-8.
 */
export function Header({ lang, dict, otherDict }: HeaderProps) {
  const links = [
    { href: "/projects", label: dict.nav.projects },
    { href: "/experience", label: dict.nav.experience },
    { href: "/about", label: dict.nav.about },
    { href: "/contact", label: dict.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-charcoal/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4 sm:px-6">
        <Link
          href={localizedPath("/", lang)}
          className="flex items-center gap-2 font-display text-sm font-semibold tracking-[0.2em] uppercase"
        >
          <MetrialMark className="h-6 w-auto" />
          <span>{dict.meta.siteName}</span>
        </Link>

        <nav aria-label={dict.nav.label} className="ms-auto hidden md:block">
          <ul className="flex items-center gap-6 text-sm text-offwhite/80">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={localizedPath(link.href, lang)}
                  className="transition-colors hover:text-gold"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ms-auto flex items-center gap-3 md:ms-0">
          <LanguageSwitch
            lang={lang}
            label={dict.language.label}
            switchLabel={otherDict.language.switch}
          />
          <Link
            href="/cv"
            prefetch={false}
            className="rounded-md bg-gold px-3 py-1.5 text-sm font-semibold text-charcoal transition-colors hover:bg-gold-light"
          >
            {dict.nav.downloadCv}
          </Link>
        </div>
      </div>
    </header>
  );
}
