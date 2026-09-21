import Link from "next/link";

import { Reveal } from "@/components/motion/reveal";
import { SlopeDivider } from "@/components/motion/slope-divider";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description?: string;
  /** Optional "back" link above the eyebrow (e.g. case study → all projects). */
  back?: { href: string; label: string };
  children?: React.ReactNode;
};

/**
 * Inner-page header band: the home hero's light and grid, scaled down to an
 * eyebrow, the page H1 and a lede.
 */
export function PageHero({
  eyebrow,
  title,
  description,
  back,
  children,
}: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden border-b border-line-soft">
      <div aria-hidden="true" className="gold-glow absolute inset-0 -z-10" />
      <div aria-hidden="true" className="grid-veil absolute inset-0 -z-10" />

      <div className="shell flex flex-col items-start gap-5 py-16 lg:py-24">
        {back && (
          <Reveal>
            <Link
              href={back.href}
              className="group inline-flex items-center gap-2 font-display text-xs font-semibold tracking-[0.14em] text-gold uppercase transition-colors hover:text-gold-light"
            >
              <span
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:-translate-x-1 rtl:rotate-180 rtl:group-hover:translate-x-1"
              >
                ←
              </span>
              {back.label}
            </Link>
          </Reveal>
        )}

        <Reveal>
          <div className="flex items-center gap-4">
            <SlopeDivider className="w-10" />
            <p className="eyebrow">{eyebrow}</p>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <h1 className="max-w-3xl text-4xl leading-[1.1] font-bold text-balance text-offwhite sm:text-5xl lg:text-6xl">
            {title}
          </h1>
        </Reveal>

        {description && (
          <Reveal delay={0.1}>
            <p className="max-w-2xl text-base leading-relaxed text-silver sm:text-lg">
              {description}
            </p>
          </Reveal>
        )}

        {children}
      </div>
    </section>
  );
}
