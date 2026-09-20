import Image from "next/image";
import Link from "next/link";

import { Reveal } from "@/components/motion/reveal";
import { SlopeDivider } from "@/components/motion/slope-divider";
import { localizedPath, type Locale } from "@/lib/i18n/config";

type ClosingCTAProps = {
  dict: {
    eyebrow: string;
    title: string;
    description: string;
    contact: string;
    viewWork: string;
    rail: string[];
  };
  lang: Locale;
};

/**
 * Closing CTA (PR-A8): the comps' full-width band that runs straight into the
 * footer — copy and the gold action on the left, the brand banner ridge
 * lighting the right, keyword rail at the edge.
 */
export function ClosingCTA({ dict, lang }: ClosingCTAProps) {
  return (
    <section className="relative isolate overflow-hidden border-t border-line-soft bg-ink">
      {/* Brand banner: the summit under the gold slope, full width. */}
      <Image
        src="/brand/summit.webp"
        alt=""
        fill
        sizes="100vw"
        className="-z-20 object-cover object-center"
      />

      {/* Scrim: near-solid ink under the copy, the summit lit out to the end. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--color-ink)_0%,rgba(7,10,12,0.92)_28%,rgba(7,10,12,0.62)_52%,rgba(7,10,12,0.45)_100%)] rtl:bg-[linear-gradient(to_left,var(--color-ink)_0%,rgba(7,10,12,0.92)_28%,rgba(7,10,12,0.62)_52%,rgba(7,10,12,0.45)_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t from-ink to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-y-0 end-0 -z-10 w-48 bg-[linear-gradient(to_left,rgba(7,10,12,0.9),transparent)] rtl:bg-[linear-gradient(to_right,rgba(7,10,12,0.9),transparent)]"
      />

      <div className="shell flex flex-col gap-10 py-16 lg:flex-row lg:items-center lg:justify-between lg:gap-16 lg:py-20">
        <div className="flex max-w-xl flex-col items-start gap-4">
          <Reveal>
            <div className="flex items-center gap-4">
              <SlopeDivider className="w-8" />
              <p className="eyebrow">{dict.eyebrow}</p>
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <h2 className="text-3xl font-bold text-balance text-offwhite sm:text-4xl">
              {dict.title}
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="text-base leading-relaxed text-silver">
              {dict.description}
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="flex flex-wrap items-center gap-4 pt-3">
              <Link
                href={localizedPath("/contact", lang)}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-gold px-7 font-display text-sm font-semibold text-charcoal transition-colors hover:bg-gold-light active:bg-gold-dark"
              >
                {dict.contact}
                <span aria-hidden="true" className="rtl:rotate-180">
                  →
                </span>
              </Link>
              <Link
                href={localizedPath("/projects", lang)}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-line bg-ink/40 px-7 font-display text-sm font-semibold text-offwhite backdrop-blur-sm transition-colors hover:border-gold/60 hover:text-gold"
              >
                {dict.viewWork}
              </Link>
            </div>
          </Reveal>
        </div>

        <ul
          aria-hidden="true"
          className="flex flex-col gap-2 font-display text-[0.65rem] font-semibold tracking-[0.36em] text-silver uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] lg:items-end"
        >
          {dict.rail.map((word) => (
            <li key={word}>{word}</li>
          ))}
          <li className="mt-2">
            <SlopeDivider className="w-12" />
          </li>
        </ul>
      </div>
    </section>
  );
}
