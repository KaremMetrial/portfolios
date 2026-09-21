import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ClosingCTA } from "@/components/sections";
import { ProjectsBrowser } from "@/components/sections/projects-browser";
import { PageHero } from "@/components/ui/page-hero";
import { getProjects } from "@/lib/api";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/projects">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = getDictionary(lang);
  return {
    title: dict.pages.projects.metaTitle,
    description: dict.pages.projects.description,
  };
}

export default async function ProjectsPage({
  params,
}: PageProps<"/[lang]/projects">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = getDictionary(lang);
  const page = dict.pages.projects;
  const projects = await getProjects(lang);

  return (
    <>
      <PageHero
        eyebrow={page.eyebrow}
        title={page.title}
        description={page.description}
      />

      <section className="bg-ink-2 py-20">
        <div className="shell">
          <ProjectsBrowser
            projects={projects}
            lang={lang}
            dict={{
              all: page.all,
              filterLabel: page.filterLabel,
              empty: page.empty,
              featured: dict.home.featuredProjects.featured,
              viewProject: dict.home.featuredProjects.viewProject,
            }}
          />
        </div>
      </section>

      <ClosingCTA dict={dict.home.cta} lang={lang} />
    </>
  );
}
