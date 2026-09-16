import Link from "next/link";

import { Card, CardSheen } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/motion/reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import type { Locale } from "@/lib/i18n/config";
import type { ProjectCard } from "@/lib/api";

type FeaturedProjectsProps = {
  projects: ProjectCard[];
  dict: {
    eyebrow: string;
    title: string;
    viewAll: string;
  };
  lang: Locale;
};

/**
 * Featured projects section (PR-A5):
 * Grid of 3–4 cards with domain, stack chips, and hover sheen.
 */
export function FeaturedProjects({ projects, dict, lang }: FeaturedProjectsProps) {
  if (projects.length === 0) return null;

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

      <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <StaggerItem key={project.slug}>
            <Link
              href={`${prefix}/projects/${project.slug}`}
              className="group block"
            >
              <Card interactive className="relative h-full transition-transform duration-300 group-hover:-translate-y-1">
                <CardSheen />
                <div className="mb-3 flex flex-wrap gap-1.5">
                  <Chip>{project.domain}</Chip>
                  {project.type !== "company" && (
                    <Chip>{project.type.replace("_", " ")}</Chip>
                  )}
                </div>
                <h3 className="mb-1 font-display text-lg font-bold text-offwhite">
                  {project.title}
                </h3>
                <p className="mb-3 text-sm text-silver">{project.tagline}</p>
                <div className="flex flex-wrap gap-1.5">
                  {project.technologies.slice(0, 4).map((tech) => (
                    <Chip key={tech.key}>{tech.name}</Chip>
                  ))}
                  {project.technologies.length > 4 && (
                    <Chip>+{project.technologies.length - 4}</Chip>
                  )}
                </div>
              </Card>
            </Link>
          </StaggerItem>
        ))}
      </Stagger>

      <Reveal delay={0.2}>
        <div className="mt-10 text-center">
          <Link
            href={`${prefix}/projects`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-gold transition-colors hover:text-gold-light"
          >
            {dict.viewAll} →
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
