import Image from "next/image";
import Link from "next/link";

import { MetrialLogotype } from "@/components/brand/metrial-logotype";
import { MetrialMark } from "@/components/brand/metrial-mark";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/motion/reveal";
import { SlopeDivider } from "@/components/motion/slope-divider";
import { localizedPath, type Locale } from "@/lib/i18n/config";
import type { ProfileData } from "@/lib/api";

type HeroProps = {
  profile: ProfileData;
  dict: {
    eyebrow: string;
    role: string;
    specialties: string[];
    rail: string[];
    viewWork: string;
    letsTalk: string;
    contact: string;
  };
  lang: Locale;
};

/**
 * Hero (FR-FE-31), built to the brand comps: the banner ridge full-bleed
 * behind the section, a scrim that keeps the left column readable, the name
 * as H1 with the role in brand gold, availability, both CTAs, and the mark
 * and keyword rail over the ridge. Server-rendered with no layout shift.
 */
export function Hero({ profile, dict, lang }: HeroProps) {
  const available =
    profile.availability === "open" ||
    profile.availability === "open_to_relocation";

  return (
    <section className="relative isolate overflow-hidden border-b border-line-soft">
      {/* Ambient brand light + engineering grid, as in the comps. */}
      <div aria-hidden="true" className="gold-glow absolute inset-0 -z-10" />
      <div aria-hidden="true" className="grid-veil absolute inset-0 -z-10" />

      <div className="shell grid items-center gap-12 py-20 lg:grid-cols-12 lg:gap-16 lg:py-28">
        <div className="flex flex-col items-start gap-6 lg:col-span-7">
          <Reveal>
            <div className="flex items-center gap-4">
              <SlopeDivider className="w-10" />
              <p className="eyebrow">{dict.eyebrow}</p>
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <h1 className="font-display text-5xl leading-[1.05] font-bold text-balance text-offwhite sm:text-6xl lg:text-7xl">
              {profile.name}
            </h1>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="text-gold-gradient font-display text-2xl font-bold sm:text-3xl">
              {dict.role}
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <p className="max-w-xl text-base leading-relaxed text-silver sm:text-lg">
              {profile.summary}
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <Badge pulse={available} tone={available ? "success" : "neutral"}>
              {profile.availability_text}
            </Badge>
          </Reveal>

          <Reveal delay={0.25}>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href={localizedPath("/contact", lang)}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-gold px-7 font-display text-sm font-semibold text-charcoal transition-colors hover:bg-gold-light active:bg-gold-dark"
              >
                {dict.letsTalk}
                <span aria-hidden="true" className="rtl:rotate-180">
                  →
                </span>
              </Link>
              <Link
                href={localizedPath("/projects", lang)}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-line px-7 font-display text-sm font-semibold text-offwhite transition-colors hover:border-gold/60 hover:text-gold"
              >
                {dict.viewWork}
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <ul className="flex flex-wrap items-center gap-x-3 gap-y-2 pt-4 font-display text-[0.7rem] font-medium tracking-[0.2em] text-silver/80 uppercase">
              {dict.specialties.map((item, index) => (
                <li key={item} className="flex items-center gap-3">
                  {index > 0 && (
                    <span aria-hidden="true" className="text-gold/50">
                      ·
                    </span>
                  )}
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* Framed banner plate: the ridge under the brand lockup. */}
        <Reveal delay={0.15} className="lg:col-span-5">
          <div className="relative aspect-4/5 w-full overflow-hidden rounded-card border border-line bg-surface shadow-lift sm:aspect-square lg:aspect-4/5">
            <Image
              src="/brand/ridge-peak.webp"
              alt=""
              fill
              priority
              sizes="(min-width: 1024px) 480px, (min-width: 640px) 60vw, 90vw"
              className="object-cover object-[78%_50%]"
            />

            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(to_top,var(--color-ink)_2%,rgba(7,10,12,0.25)_45%,transparent_70%),radial-gradient(65%_45%_at_50%_45%,rgba(198,168,106,0.16),transparent_70%)]"
            />
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink via-ink/70 to-transparent"
            />

            <div className="absolute inset-x-0 top-0 flex items-start justify-end gap-4 p-5">
              <ul
                aria-hidden="true"
                className="flex flex-col items-end gap-2 font-display text-[0.6rem] font-semibold tracking-[0.34em] text-silver/70 uppercase"
              >
                {dict.rail.map((word) => (
                  <li key={word}>{word}</li>
                ))}
              </ul>
            </div>

            {/* The brand lockup sits on the ridge, as on the banner. */}
            <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 flex-col items-center gap-3">
              <MetrialMark
                className="h-20 w-auto drop-shadow-[0_18px_40px_rgba(0,0,0,0.85)] sm:h-24"
                title="Metrial"
              />
              <MetrialLogotype
                tracking={0.36}
                className="text-base drop-shadow-[0_6px_18px_rgba(0,0,0,0.9)] sm:text-lg"
              />
              <SlopeDivider className="w-10" />
            </div>

            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 border-t border-line/70 bg-ink/60 px-5 py-4 backdrop-blur-sm">
              <span className="font-display text-[0.6rem] font-medium tracking-[0.24em] text-silver uppercase">
                {profile.location}
              </span>
              <p className="font-display text-[0.6rem] whitespace-nowrap tracking-[0.3em] text-gold uppercase">
                Build · Solve · Scale
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
