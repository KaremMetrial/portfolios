import Image from "next/image";

import { ArrowLink } from "@/components/ui/arrow-link";
import { Reveal } from "@/components/motion/reveal";
import { SlopeDivider } from "@/components/motion/slope-divider";
import { localizedPath, type Locale } from "@/lib/i18n/config";

type AboutSplitProps = {
  /** Long-form intro from the profile endpoint. */
  about: string;
  dict: {
    eyebrow: string;
    title: string;
    cta: string;
    quote: string;
  };
  lang: Locale;
};

/**
 * About band (brand comps): copy on the ink side, the studio frame on the
 * other, split down the page with no gutter between them.
 */
export function AboutSplit({ about, dict, lang }: AboutSplitProps) {
  return (
    <section className="border-b border-line-soft bg-ink">
      <div className="grid items-stretch lg:grid-cols-2">
        <div className="flex items-center px-5 py-16 sm:px-8 lg:justify-end lg:py-24 lg:pe-16">
          <div className="flex max-w-xl flex-col items-start gap-5 lg:max-w-[34rem]">
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
              <p className="text-base leading-relaxed text-silver">{about}</p>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="pt-2">
                <ArrowLink href={localizedPath("/about", lang)} underline>
                  {dict.cta}
                </ArrowLink>
              </div>
            </Reveal>
          </div>
        </div>

        <Reveal delay={0.1} className="relative min-h-[18rem] lg:min-h-[32rem]">
          <Image
            src="/brand/studio.webp"
            alt=""
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
          {/* Ties the frame back into the ink column on the other side. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-ink)_0%,transparent_22%),linear-gradient(to_top,rgba(7,10,12,0.75)_0%,transparent_45%)] rtl:bg-[linear-gradient(to_left,var(--color-ink)_0%,transparent_22%),linear-gradient(to_top,rgba(7,10,12,0.75)_0%,transparent_45%)]"
          />

          {/* The comps' quote card, as real text rather than baked pixels. */}
          <figure className="absolute end-6 bottom-6 max-w-[17rem] border border-line/80 bg-ink/85 px-6 py-5 backdrop-blur-sm sm:end-10 sm:bottom-10">
            <blockquote className="font-display text-lg leading-snug font-medium text-offwhite">
              {dict.quote}
            </blockquote>
            <SlopeDivider className="mt-4 w-12" />
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
