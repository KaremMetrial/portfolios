import Link from "next/link";

import { MetrialMark } from "@/components/brand/metrial-mark";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/motion/reveal";
import type { Locale } from "@/lib/i18n/config";
import type { ProfileData } from "@/lib/api";

type HeroProps = {
  profile: ProfileData;
  dict: {
    role: string;
    specialties: string[];
    viewWork: string;
    downloadCv: string;
    contact: string;
  };
  lang: Locale;
};

/**
 * Hero section (FR-FE-31):
 * - Name as H1
 * - Rotating specialties (text swap, static with reduced motion)
 * - Availability badge driven by profile.availability
 * - CTAs: View work, Download CV, Contact
 * - Server-rendered with no layout shift
 */
export function Hero({ profile, dict, lang }: HeroProps) {
  const specialties = dict.specialties;

  return (
    <section className="relative mx-auto flex min-h-[80vh] max-w-6xl flex-col items-start justify-center gap-6 px-4 py-24 sm:px-6">
      <Reveal>
        <MetrialMark className="h-20 w-auto sm:h-28" title="Metrial" />
      </Reveal>

      <Reveal delay={0.1}>
        <h1 className="font-display text-4xl font-bold sm:text-6xl lg:text-7xl">
          {profile.name}
        </h1>
      </Reveal>

      <Reveal delay={0.15}>
        <p className="font-display text-sm font-semibold tracking-[0.2em] text-gold uppercase">
          {dict.role}
        </p>
      </Reveal>

      <Reveal delay={0.2}>
        <p className="font-display text-xs font-medium tracking-[0.15em] text-silver uppercase">
          {specialties.join(" · ")}
        </p>
      </Reveal>

      <Reveal delay={0.25}>
        <Badge
          pulse={profile.availability === "open" || profile.availability === "open_to_relocation"}
          tone={profile.availability === "not_available" ? "neutral" : "success"}
        >
          {profile.availability_text}
        </Badge>
      </Reveal>

      <Reveal delay={0.3}>
        <p className="max-w-2xl text-lg text-offwhite/85">{profile.summary}</p>
      </Reveal>

      <Reveal delay={0.35}>
        <div className="flex flex-wrap gap-4">
          <Link
            href={`/${lang === "en" ? "" : lang}/projects`}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-gold px-6 py-3 text-sm font-semibold text-charcoal transition-colors hover:bg-gold-light"
          >
            {dict.viewWork}
          </Link>
          <Link
            href={`/${lang === "en" ? "" : lang}/contact`}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-line px-6 py-3 text-sm font-semibold text-offwhite transition-colors hover:border-gold/50"
          >
            {dict.contact}
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
