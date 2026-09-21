"use client";

import { useMemo, useState } from "react";

import { Chip } from "@/components/ui/chip";
import { ProjectCard } from "@/components/ui/project-card";
import { formatDomain } from "@/lib/format";
import { localizedPath, type Locale } from "@/lib/i18n/config";
import type { ProjectCard as ProjectCardData } from "@/lib/api";

type ProjectsBrowserProps = {
  projects: ProjectCardData[];
  lang: Locale;
  dict: {
    all: string;
    filterLabel: string;
    empty: string;
    featured: string;
    viewProject: string;
  };
};

/** Projects index: domain filter chips over the card grid. */
export function ProjectsBrowser({
  projects,
  lang,
  dict,
}: ProjectsBrowserProps) {
  const domains = useMemo(
    () => Array.from(new Set(projects.map((project) => project.domain))),
    [projects],
  );
  const [domain, setDomain] = useState<string | null>(null);
  const visible = domain
    ? projects.filter((project) => project.domain === domain)
    : projects;

  return (
    <div className="flex flex-col gap-10">
      <div
        role="group"
        aria-label={dict.filterLabel}
        className="flex flex-wrap gap-2"
      >
        <Chip active={domain === null} onSelect={() => setDomain(null)}>
          {dict.all}
        </Chip>
        {domains.map((value) => (
          <Chip
            key={value}
            active={domain === value}
            onSelect={() => setDomain(value)}
            className="capitalize"
          >
            {formatDomain(value)}
          </Chip>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="text-silver">{dict.empty}</p>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((project, index) => (
            <li key={project.slug} className="h-full">
              <ProjectCard
                project={project}
                href={localizedPath(`/projects/${project.slug}`, lang)}
                featuredLabel={dict.featured}
                viewLabel={dict.viewProject}
                plateIndex={index}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
