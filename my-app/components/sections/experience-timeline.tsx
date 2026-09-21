import Link from "next/link";
import { Check, MapPin } from "lucide-react";

import { Chip } from "@/components/ui/chip";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { localizedPath, type Locale } from "@/lib/i18n/config";
import type { Experience } from "@/lib/api";

type ExperienceTimelineProps = {
  experiences: Experience[];
  present: string;
  lang: Locale;
  /** Highlights shown per role; the full Experience page shows them all. */
  maxHighlights?: number;
};

function formatDate(dateStr: string | null, presentLabel: string): string {
  if (!dateStr) return presentLabel;
  const [y, m] = dateStr.split("-");
  const month = new Date(Number(y), Number(m) - 1).toLocaleString("en", {
    month: "short",
  });
  return `${month} ${y}`;
}

/**
 * Numbered rail — the comps' process pattern — with each role on its own
 * card, so the highlights read as work shipped rather than a list of dates.
 */
export function ExperienceTimeline({
  experiences,
  present,
  lang,
  maxHighlights = 4,
}: ExperienceTimelineProps) {
  return (
    <Stagger className="relative flex flex-col gap-6">
      {/* Numbered rail, fading out past the last role. */}
      <span
        aria-hidden="true"
        className="absolute inset-y-6 start-6 hidden w-px bg-gradient-to-b from-gold/50 via-line to-transparent sm:block"
      />

      {experiences.map((exp, index) => (
        <StaggerItem key={exp.id}>
          <div className="relative flex items-start gap-6">
            <span
              aria-hidden="true"
              className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-ink font-display text-sm font-bold text-gold shadow-card sm:inline-flex"
            >
              {String(index + 1).padStart(2, "0")}
            </span>

            <article className="group min-w-0 flex-1 rounded-card border border-line bg-surface p-6 shadow-card transition-colors hover:border-gold/45 sm:p-7">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <span className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1 font-display text-[0.65rem] font-semibold tracking-[0.16em] text-gold uppercase">
                  {formatDate(exp.started_on, present)} –{" "}
                  {formatDate(exp.ended_on, present)}
                </span>
                {exp.location && (
                  <span className="inline-flex items-center gap-1.5 font-display text-[0.65rem] font-medium tracking-[0.16em] text-silver/70 uppercase">
                    <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                    {exp.location}
                  </span>
                )}
              </div>

              <div className="mt-4 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3">
                <h3 className="font-display text-xl font-bold text-offwhite sm:text-2xl">
                  {exp.role}
                </h3>
                <span className="font-display text-sm font-semibold tracking-wide text-gold">
                  {exp.company}
                </span>
              </div>

              {exp.highlights.length > 0 && (
                <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                  {exp.highlights.slice(0, maxHighlights).map((highlight) => (
                    <li
                      key={highlight}
                      className="flex gap-2.5 text-sm leading-relaxed text-silver"
                    >
                      <Check
                        className="mt-0.5 h-4 w-4 shrink-0 text-gold/80"
                        aria-hidden="true"
                      />
                      {highlight}
                    </li>
                  ))}
                </ul>
              )}

              {exp.project_slugs.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-1.5 border-t border-line-soft pt-5">
                  {exp.project_slugs.map((slug) => (
                    <Chip key={slug}>
                      <Link href={localizedPath(`/projects/${slug}`, lang)}>
                        {slug}
                      </Link>
                    </Chip>
                  ))}
                </div>
              )}
            </article>
          </div>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
