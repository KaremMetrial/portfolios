import { ArrowLink } from "@/components/ui/arrow-link";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/motion/reveal";
import { localizedPath, type Locale } from "@/lib/i18n/config";
import type { Experience } from "@/lib/api";

import { ExperienceTimeline } from "./experience-timeline";

type ExperienceSnapshotProps = {
  experiences: Experience[];
  dict: {
    eyebrow: string;
    title: string;
    description: string;
    present: string;
    viewAll: string;
  };
  lang: Locale;
};

/**
 * Experience snapshot (PR-A6): a numbered rail — the comps' process pattern —
 * with each role on its own card, so the highlights read as work shipped
 * rather than a list of dates.
 */
export function ExperienceSnapshot({
  experiences,
  dict,
  lang,
}: ExperienceSnapshotProps) {
  const latest = experiences.slice(0, 3);
  if (latest.length === 0) return null;

  return (
    <section className="border-b border-line-soft bg-ink py-24">
      <div className="shell">
        <Reveal>
          <SectionHeader
            eyebrow={dict.eyebrow}
            title={dict.title}
            description={dict.description}
            action={
              <ArrowLink href={localizedPath("/experience", lang)} underline>
                {dict.viewAll}
              </ArrowLink>
            }
            className="mb-14"
          />
        </Reveal>

        <ExperienceTimeline
          experiences={latest}
          present={dict.present}
          lang={lang}
        />
      </div>
    </section>
  );
}
