import { SectionHeader } from "@/components/ui/section-header";
import { Chip } from "@/components/ui/chip";
import { Reveal } from "@/components/motion/reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import type { SkillGroup } from "@/lib/api";

type SkillsSectionProps = {
  skillGroups: SkillGroup[];
  dict: {
    eyebrow: string;
    title: string;
  };
};

/**
 * Skills section (PR-A7, v1.0 grouped list):
 * Displays skill groups with their skills as chips.
 * The constellation comes in FE-8.
 */
export function SkillsSection({ skillGroups, dict }: SkillsSectionProps) {
  if (skillGroups.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <Reveal>
        <SectionHeader
          eyebrow={dict.eyebrow}
          title={dict.title}
          className="mb-12"
        />
      </Reveal>

      <div className="flex flex-col gap-10">
        {skillGroups.map((group) => (
          <Reveal key={group.key}>
            <div>
              <h3 className="mb-3 font-display text-sm font-semibold tracking-[0.15em] text-gold/80 uppercase">
                {group.name}
              </h3>
              <Stagger className="flex flex-wrap gap-2" interval={0.04}>
                {group.skills.map((skill) => (
                  <StaggerItem key={skill.key}>
                    <Chip>
                      {skill.name}
                      {skill.project_count > 0 && (
                        <span className="ms-1 text-[10px] text-silver/50">
                          {skill.project_count}
                        </span>
                      )}
                    </Chip>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
