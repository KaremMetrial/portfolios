import Link from "next/link";

import { MetrialWordmark } from "@/components/brand/metrial-wordmark";
import { localizedPath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

import { HeaderShell } from "./header-shell";
import { LanguageSwitch } from "./language-switch";
import { MobileNav } from "./mobile-nav";
import { NavLink } from "./nav-link";

type HeaderProps = {
  lang: Locale;
  dict: Dictionary;
  /** The other locale's dictionary, for the language switch label. */
  otherDict: Dictionary;
};

/**
 * Header (FR-FE-70): brand lockup, centred navigation with the gold active
 * underline, language switch and the gold "Let's talk" pill — the layout of
 * the brand comps. Condensing on scroll lives in <HeaderShell>.
 */
export function Header({ lang, dict, otherDict }: HeaderProps) {
  const links = [
    { href: localizedPath("/", lang), label: dict.nav.home },
    { href: localizedPath("/projects", lang), label: dict.nav.projects },
    { href: localizedPath("/experience", lang), label: dict.nav.experience },
    { href: localizedPath("/about", lang), label: dict.nav.about },
    { href: localizedPath("/contact", lang), label: dict.nav.contact },
  ];

  const contactHref = localizedPath("/contact", lang);

  return (
    <HeaderShell>
      <div className="shell relative flex h-18 items-center gap-6">
        <Link
          href={localizedPath("/", lang)}
          aria-label={dict.meta.siteName}
          className="shrink-0 rounded-sm"
        >
          <MetrialWordmark />
        </Link>

        <nav
          aria-label={dict.nav.label}
          className="ms-auto hidden md:block lg:absolute lg:left-1/2 lg:ms-0 lg:-translate-x-1/2"
        >
          <ul className="flex items-center gap-7">
            {links.map((link) => (
              <li key={link.href}>
                <NavLink href={link.href}>{link.label}</NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ms-auto flex items-center gap-3">
          <LanguageSwitch
            lang={lang}
            label={dict.language.label}
            switchLabel={otherDict.language.switch}
          />

          <Link
            href={contactHref}
            className="hidden h-10 items-center gap-2 rounded-md bg-gold px-5 font-display text-sm font-semibold text-charcoal transition-colors hover:bg-gold-light active:bg-gold-dark sm:inline-flex"
          >
            {dict.nav.letsTalk}
            <span aria-hidden="true" className="rtl:rotate-180">
              →
            </span>
          </Link>

          <MobileNav
            links={links}
            ctaHref={contactHref}
            ctaLabel={dict.nav.letsTalk}
            openLabel={dict.header.openMenu}
            closeLabel={dict.header.closeMenu}
          />
        </div>
      </div>
    </HeaderShell>
  );
}
