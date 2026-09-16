import Link from "next/link";

import { MetrialMark } from "@/components/brand/metrial-mark";
import { Reveal } from "@/components/motion/reveal";
import type { Locale } from "@/lib/i18n/config";

type ClosingCTAProps = {
  dict: {
    eyebrow: string;
    title: string;
    description: string;
    contact: string;
  };
  lang: Locale;
};

/**
 * Closing CTA (PR-A8):
 * Tagline "Engineering a Smarter Tomorrow" and contact buttons.
 */
export function ClosingCTA({ dict, lang }: ClosingCTAProps) {
  const prefix = lang === "en" ? "" : `/${lang}`;

  return (
    <section className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <div className="relative overflow-hidden rounded-2xl border border-line bg-surface px-8 py-16 text-center sm:px-16 sm:py-24">
        {/* Decorative mark */}
        <MetrialMark
          className="pointer-events-none absolute -end-8 -top-8 h-40 w-auto opacity-5"
          variant="mono"
        />

        <Reveal>
          <p className="font-display text-xs font-semibold tracking-[0.25em] text-gold uppercase">
            {dict.eyebrow}
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <h2 className="mt-4 font-display text-3xl font-bold text-offwhite sm:text-4xl lg:text-5xl">
            {dict.title}
          </h2>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="mx-auto mt-4 max-w-xl text-lg text-silver">
            {dict.description}
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href={`${prefix}/contact`}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-gold px-6 py-3 text-sm font-semibold text-charcoal transition-colors hover:bg-gold-light"
            >
              {dict.contact}
            </Link>
            <Link
              href={`${prefix}/projects`}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-line px-6 py-3 text-sm font-semibold text-offwhite transition-colors hover:border-gold/50"
            >
              View work
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
