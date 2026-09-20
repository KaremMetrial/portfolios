import {
  Boxes,
  Database,
  GitBranch,
  Layers,
  Server,
  ShieldCheck,
  Workflow,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/motion/reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import type { SkillGroup } from "@/lib/api";

type SkillsSectionProps = {
  skillGroups: SkillGroup[];
  dict: {
    eyebrow: string;
    title: string;
    description: string;
  };
};

/** Group key → glyph, with a neutral fallback for groups added later. */
const groupIcons: Record<string, LucideIcon> = {
  backend: Server,
  "data-performance": Database,
  "async-realtime": Zap,
  "testing-quality": ShieldCheck,
  devops: GitBranch,
  infrastructure: Boxes,
  frontend: Layers,
  practices: Workflow,
};

/**
 * Capability grid (PR-A7) in the comps' service-card language: a bordered
 * card per skill group, gold glyph, and the group's skills as a gold-bulleted
 * list. The constellation comes in FE-8.
 */
export function SkillsSection({ skillGroups, dict }: SkillsSectionProps) {
  if (skillGroups.length === 0) return null;

  return (
    <section className="border-b border-line-soft bg-ink-2 py-24">
      <div className="shell">
        <Reveal>
          <SectionHeader
            eyebrow={dict.eyebrow}
            title={dict.title}
            description={dict.description}
            className="mb-14"
          />
        </Reveal>

        <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group) => {
            const Icon = groupIcons[group.key] ?? Layers;

            return (
              <StaggerItem key={group.key} className="h-full">
                <article className="flex h-full flex-col gap-5 rounded-card border border-line bg-surface p-6 shadow-card transition-colors hover:border-gold/45">
                  <span
                    aria-hidden="true"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-gold/30 bg-gold/10 text-gold"
                  >
                    <Icon className="h-5 w-5" />
                  </span>

                  <h3 className="font-display text-lg font-bold text-offwhite">
                    {group.name}
                  </h3>

                  <ul className="flex flex-col gap-2.5">
                    {group.skills.map((skill) => (
                      <li
                        key={skill.key}
                        className="flex items-center gap-3 text-sm text-silver"
                      >
                        <span
                          aria-hidden="true"
                          className="h-1 w-1 shrink-0 rounded-full bg-gold/70"
                        />
                        <span className="flex-1">{skill.name}</span>
                        {skill.project_count > 0 && (
                          <span className="font-mono text-[0.65rem] text-silver/50">
                            {skill.project_count}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </article>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
