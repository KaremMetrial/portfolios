import { TechLogo } from "@/components/brand/tech-logo";
import { Reveal } from "@/components/motion/reveal";

export type TechItem = { key: string; name: string; hasLogo: boolean };

type TechStripProps = {
  /** Technologies, already ordered by relevance. */
  items: TechItem[];
  label: string;
};

/**
 * "Technologies I work with" band (brand comps' trusted-technologies strip):
 * the stack that actually shows up in the project data, so it can never drift
 * from the work on the page.
 */
export function TechStrip({ items, label }: TechStripProps) {
  if (items.length === 0) return null;

  return (
    <section aria-label={label} className="border-b border-line-soft bg-ink-2">
      <div className="shell flex flex-col gap-8 py-10">
        <p className="eyebrow text-center text-silver/70 lg:text-start">
          {label}
        </p>

        <Reveal delay={0.05}>
          <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 lg:justify-between">
            {items.map((item) => (
              <li key={item.key}>
                <span className="group inline-flex items-center gap-2.5 text-silver transition-colors hover:text-offwhite">
                  {item.hasLogo ? (
                    <TechLogo
                      techKey={item.key}
                      className="h-7 w-7 text-silver/80 transition-colors group-hover:text-gold"
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="h-1.5 w-1.5 rounded-full bg-gold/70"
                    />
                  )}
                  <span className="font-display text-xs font-semibold tracking-[0.12em] uppercase">
                    {item.name}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
