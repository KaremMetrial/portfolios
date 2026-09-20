import { ArrowLink } from "@/components/ui/arrow-link";
import { ProjectCard } from "@/components/ui/project-card";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/motion/reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { localizedPath, type Locale } from "@/lib/i18n/config";
import type { ProjectCard as ProjectCardData } from "@/lib/api";

type FeaturedProjectsProps = {
  projects: ProjectCardData[];
  dict: {
    eyebrow: string;
    title: string;
    description: string;
    viewAll: string;
    featured: string;
    viewProject: string;
  };
  lang: Locale;
};

/**
 * Featured projects (PR-A5): the comps' three-up work grid with the section
 * action pinned to the heading row.
 */
export function FeaturedProjects({
  projects,
  dict,
  lang,
}: FeaturedProjectsProps) {
  if (projects.length === 0) return null;

  return (
    <section className="border-b border-line-soft bg-ink-2 py-24">
      <div className="shell">
        <Reveal>
          <SectionHeader
            eyebrow={dict.eyebrow}
            title={dict.title}
            description={dict.description}
            action={
              <ArrowLink href={localizedPath("/projects", lang)} underline>
                {dict.viewAll}
              </ArrowLink>
            }
            className="mb-14"
          />
        </Reveal>

        <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.slice(0, 3).map((project, index) => (
            <StaggerItem key={project.slug} className="h-full">
              <ProjectCard
                project={project}
                href={localizedPath(`/projects/${project.slug}`, lang)}
                featuredLabel={dict.featured}
                viewLabel={dict.viewProject}
                plateIndex={index}
              />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
