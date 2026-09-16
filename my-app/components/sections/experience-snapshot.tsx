import Link from "next/link";

import { Chip } from "@/components/ui/chip";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/motion/reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import type { Locale } from "@/lib/i18n/config";
import type { Experience } from "@/lib/api";

type ExperienceSnapshotProps = {
  experiences: Experience[];
  dict: {
    eyebrow: string;
    title: string;
    present: string;
    viewAll: string;
  };
  lang: Locale;
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
 * Experience snapshot (PR-A6):
 * Latest 3 roles linking to the full timeline.
 */
export function ExperienceSnapshot({
  experiences,
  dict,
  lang,
}: ExperienceSnapshotProps) {
  const latest = experiences.slice(0, 3);
  if (latest.length === 0) return null;

  const prefix = lang === "en" ? "" : `/${lang}`;

  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <Reveal>
        <SectionHeader
          eyebrow={dict.eyebrow}
          title={dict.title}
          className="mb-12"
        />
      </Reveal>

      <Stagger className="flex flex-col gap-8">
        {latest.map((exp) => (
          <StaggerItem key={exp.id}>
            <div className="relative border-s-2 border-line ps-6">
              {/* Timeline dot */}
              <span
                aria-hidden="true"
                className="absolute -start-1.5 top-1 h-3 w-3 rounded-full border-2 border-gold bg-charcoal"
              />
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3">
                <h3 className="font-display text-lg font-bold text-offwhite">
                  {exp.role}
                </h3>
                <span className="text-sm text-silver">{exp.company}</span>
              </div>
              <p className="mt-1 text-xs text-silver/70">
                {formatDate(exp.started_on, dict.present)} –{" "}
                {formatDate(exp.ended_on, dict.present)}
                {exp.location && ` · ${exp.location}`}
              </p>
              {exp.highlights.length > 0 && (
                <ul className="mt-3 flex flex-col gap-1">
                  {exp.highlights.slice(0, 3).map((h, i) => (
                    <li key={i} className="text-sm text-offwhite/80">
                      {h}
                    </li>
                  ))}
                </ul>
              )}
              {exp.project_slugs.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {exp.project_slugs.map((slug) => (
                    <Chip key={slug}>
                      <Link href={`${prefix}/projects/${slug}`}>{slug}</Link>
                    </Chip>
                  ))}
                </div>
              )}
            </div>
          </StaggerItem>
        ))}
      </Stagger>

      <Reveal delay={0.2}>
        <div className="mt-10 text-center">
          <Link
            href={`${prefix}/experience`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-gold transition-colors hover:text-gold-light"
          >
            {dict.viewAll} →
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
