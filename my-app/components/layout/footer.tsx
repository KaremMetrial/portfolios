import Link from "next/link";
import { cacheLife } from "next/cache";
import { MapPin, Mail } from "lucide-react";

import { MetrialWordmark } from "@/components/brand/metrial-wordmark";
import { SocialIcon, socialLabel } from "@/components/brand/social-icon";
import { LiveStrip } from "@/components/sections/live-strip";
import { env } from "@/lib/env";
import { localizedPath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { SocialLink } from "@/lib/api";

type FooterProps = {
  dict: Dictionary;
  lang: Locale;
  location: string;
  email: string;
  socialLinks: SocialLink[];
};

/** Cached so the prerender stays static (Cache Components time rule). */
async function CopyrightNotice({ template }: { template: string }) {
  "use cache";
  cacheLife("days");

  return <p>{template.replace("{year}", String(new Date().getFullYear()))}</p>;
}

function ColumnTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display text-xs font-semibold tracking-[0.2em] text-offwhite uppercase">
      {children}
    </h2>
  );
}

/**
 * Footer (brand comps): brand column, quick links, focus areas and contact,
 * over a hairline bottom bar carrying the copyright and the brand motto.
 */
export function Footer({
  dict,
  lang,
  location,
  email,
  socialLinks,
}: FooterProps) {
  const links = [
    { href: localizedPath("/", lang), label: dict.nav.home },
    { href: localizedPath("/projects", lang), label: dict.nav.projects },
    { href: localizedPath("/experience", lang), label: dict.nav.experience },
    { href: localizedPath("/about", lang), label: dict.nav.about },
    { href: localizedPath("/contact", lang), label: dict.nav.contact },
  ];

  return (
    <footer className="relative mt-auto border-t border-line bg-ink-2">
      <div className="shell grid gap-12 py-16 md:grid-cols-12">
        <div className="flex flex-col gap-5 md:col-span-4">
          <MetrialWordmark
            size="lg"
            subline={dict.footer.subline}
            label="Metrial"
          />
          <p className="max-w-xs text-sm leading-relaxed text-silver">
            {dict.footer.tagline}
          </p>
          <ul className="flex items-center gap-3">
            {socialLinks.map((link) => (
              <li key={link.platform}>
                <a
                  href={link.url}
                  target={link.url.startsWith("http") ? "_blank" : undefined}
                  rel={
                    link.url.startsWith("http")
                      ? "noreferrer noopener"
                      : undefined
                  }
                  aria-label={socialLabel(link.platform)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-line text-silver transition-colors hover:border-gold/50 hover:text-gold"
                >
                  <SocialIcon platform={link.platform} className="h-4 w-4" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav
          aria-label={dict.footer.quickLinks}
          className="flex flex-col gap-4 md:col-span-3"
        >
          <ColumnTitle>{dict.footer.quickLinks}</ColumnTitle>
          <ul className="flex flex-col gap-2.5 text-sm text-silver">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="transition-colors hover:text-gold"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col gap-4 md:col-span-2">
          <ColumnTitle>{dict.footer.focus}</ColumnTitle>
          <ul className="flex flex-col gap-2.5 text-sm text-silver">
            {dict.footer.focusItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-4 md:col-span-3">
          <ColumnTitle>{dict.footer.connect}</ColumnTitle>
          <ul className="flex flex-col gap-3 text-sm text-silver">
            <li className="flex items-start gap-2.5">
              <Mail
                className="mt-0.5 h-4 w-4 shrink-0 text-gold"
                aria-hidden="true"
              />
              <a
                href={`mailto:${email}`}
                className="break-all transition-colors hover:text-gold"
              >
                {email}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin
                className="mt-0.5 h-4 w-4 shrink-0 text-gold"
                aria-hidden="true"
              />
              <span>{location}</span>
            </li>
          </ul>
          <p className="text-xs leading-relaxed text-silver/70">
            {dict.footer.builtWith}
          </p>
        </div>
      </div>

      <div className="border-t border-line-soft">
        <div className="shell flex flex-col items-center justify-between gap-3 py-6 text-xs text-silver/70 sm:flex-row">
          <CopyrightNotice template={dict.footer.rights} />
          <LiveStrip
            apiUrl={env.NEXT_PUBLIC_API_URL}
            operational={dict.home.liveStrip.operational}
            unavailable={dict.home.liveStrip.unavailable}
          />
          <p className="font-display tracking-[0.3em] text-silver/60 uppercase">
            {dict.footer.motto}
          </p>
        </div>
      </div>
    </footer>
  );
}
