import { Activity, Boxes, Building2, CalendarClock } from "lucide-react";

import { Stat } from "@/components/ui/stat";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/cn";

type ProofStatsProps = {
  stats: {
    shipped_platforms: number;
    companies: number;
    public_apps: number;
    experience_since: string;
  };
  yearsOfExperience: number;
  dict: {
    eyebrow: string;
    title: string;
    platforms: string;
    companies: string;
    apps: string;
    experience: string;
    years: string;
  };
};

/**
 * Proof stats (FR-FE-30, PR-A4) as the comps' hairline stat bar sitting
 * straight under the hero. Every figure is computed from real content — no
 * invented metrics.
 */
export function ProofStats({
  stats,
  yearsOfExperience,
  dict,
}: ProofStatsProps) {
  const items = [
    {
      icon: CalendarClock,
      value: yearsOfExperience,
      suffix: "+",
      label: dict.years,
    },
    {
      icon: Boxes,
      value: stats.shipped_platforms,
      suffix: "+",
      label: dict.platforms,
    },
    { icon: Building2, value: stats.companies, label: dict.companies },
    {
      icon: Activity,
      value: stats.public_apps,
      suffix: "+",
      label: dict.apps,
    },
  ];

  return (
    <section
      aria-label={dict.title}
      className="border-b border-line-soft bg-ink-2"
    >
      <Reveal>
        <dl className="shell grid grid-cols-2 lg:grid-cols-4">
          {items.map(({ icon: Icon, value, suffix, label }, index) => (
            <div
              key={label}
              className={cn(
                "flex items-center gap-4 py-8 sm:px-6",
                // Hairline rules between columns, per row on narrow screens.
                index % 2 === 1 && "border-s border-line-soft ps-4 sm:ps-6",
                index >= 2 && "border-t border-line-soft lg:border-t-0",
                index === 2 && "lg:border-s lg:border-line-soft lg:ps-6",
              )}
            >
              <span
                aria-hidden="true"
                className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-md border border-line text-gold sm:inline-flex"
              >
                <Icon className="h-5 w-5" />
              </span>
              <Stat value={value} suffix={suffix} label={label} />
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  );
}
