import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, Lock } from "lucide-react";

import { Chip } from "@/components/ui/chip";
import { PageHero } from "@/components/ui/page-hero";
import { ProjectCard } from "@/components/ui/project-card";
import { SlopeDivider } from "@/components/motion/slope-divider";
import { getProject, getProjects, type ProjectDetail } from "@/lib/api";
import { isLocale, localizedPath, locales } from "@/lib/i18n/config";
import { formatDomain } from "@/lib/format";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export async function generateStaticParams() {
  const projects = await getProjects(locales[0]);
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/projects/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const project = await getProject(slug, lang);
  if (!project) return {};
  return { title: project.title, description: project.tagline };
}

function formatMonth(value: string | null, present: string): string {
  if (!value) return present;
  const [y, m] = value.split("-");
  return new Date(Number(y), Number(m) - 1).toLocaleString("en", {
    month: "short",
    year: "numeric",
  });
}

/** Minimal markdown for case-study sections: paragraphs and "- " lists. */
function MarkdownBlocks({ source }: { source: string }) {
  return (
    <>
      {source
        .trim()
        .split(/\n{2,}/)
        .map((block, index) => {
          const lines = block.split("\n");
          if (lines.every((line) => /^\s*[-*]\s+/.test(line))) {
            return (
              <ul key={index} className="flex flex-col gap-2">
                {lines.map((line) => (
                  <li
                    key={line}
                    className="flex gap-3 text-base leading-relaxed text-silver"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-gold"
                    />
                    {line.replace(/^\s*[-*]\s+/, "")}
                  </li>
                ))}
              </ul>
            );
          }
          return (
            <p key={index} className="text-base leading-relaxed text-silver">
              {block}
            </p>
          );
        })}
    </>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-line-soft py-3 last:border-b-0">
      <dt className="font-display text-[0.65rem] font-semibold tracking-[0.16em] text-silver/70 uppercase">
        {label}
      </dt>
      <dd className="text-end text-sm font-medium text-offwhite capitalize">
        {value}
      </dd>
    </div>
  );
}

export default async function ProjectPage({
  params,
}: PageProps<"/[lang]/projects/[slug]">) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();

  const project: ProjectDetail | null = await getProject(slug, lang);
  if (!project) notFound();

  const dict = getDictionary(lang);
  const page = dict.pages.project;
  const others = (await getProjects(lang))
    .filter((item) => item.slug !== project.slug)
    .slice(0, 3);
  const confidential = project.confidentiality === "summary_only";
  const sections = [...project.sections].sort((a, b) => a.sort - b.sort);

  return (
    <>
      <PageHero
        eyebrow={`${page.types[project.type]} · ${formatDomain(project.domain)}`}
        title={project.title}
        description={project.tagline}
        back={{
          href: localizedPath("/projects", lang),
          label: page.back,
        }}
      >
        <ul className="flex flex-wrap gap-1.5 pt-2">
          {project.technologies.map((tech) => (
            <li key={tech.key}>
              <Chip>{tech.name}</Chip>
            </li>
          ))}
        </ul>
      </PageHero>

      <section className="bg-ink-2 py-20">
        <div className="shell grid gap-12 lg:grid-cols-12">
          <article className="flex flex-col gap-10 lg:col-span-8">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <SlopeDivider className="w-8" />
                <h2 className="eyebrow">{page.overview}</h2>
              </div>
              <p className="text-lg leading-relaxed text-offwhite/90">
                {project.summary || project.tagline}
              </p>
            </div>

            {confidential && (
              <div className="flex gap-4 rounded-card border border-gold/30 bg-gold/5 p-5">
                <Lock
                  className="mt-0.5 h-5 w-5 shrink-0 text-gold"
                  aria-hidden="true"
                />
                <p className="text-sm leading-relaxed text-silver">
                  {page.confidential}
                </p>
              </div>
            )}

            {sections.map((section) => (
              <div key={section.type} className="flex flex-col gap-4">
                <h2 className="text-2xl font-bold text-offwhite">
                  {section.heading}
                </h2>
                <MarkdownBlocks source={section.body_markdown} />
              </div>
            ))}
          </article>

          <aside className="flex flex-col gap-6 lg:col-span-4">
            <div className="rounded-card border border-line bg-surface p-6 shadow-card">
              <dl>
                <MetaRow label={page.role} value={project.role} />
                <MetaRow
                  label={page.period}
                  value={`${formatMonth(project.period.started_on, page.present)} – ${formatMonth(project.period.ended_on, page.present)}`}
                />
                <MetaRow label={page.type} value={page.types[project.type]} />
                <MetaRow
                  label={page.domain}
                  value={formatDomain(project.domain)}
                />
              </dl>
            </div>

            {project.links.length > 0 && (
              <div className="rounded-card border border-line bg-surface p-6 shadow-card">
                <h2 className="eyebrow mb-4">{page.links}</h2>
                <ul className="flex flex-col gap-3">
                  {project.links.map((link) => (
                    <li key={link.url}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-gold transition-colors hover:text-gold-light"
                      >
                        {link.label}
                        <ExternalLink
                          className="h-3.5 w-3.5"
                          aria-hidden="true"
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-col items-start gap-4 rounded-card border border-line bg-surface p-6 shadow-card">
              <h2 className="text-lg font-bold text-offwhite">
                {page.ctaTitle}
              </h2>
              <p className="text-sm leading-relaxed text-silver">
                {page.ctaBody}
              </p>
              <Link
                href={localizedPath("/contact", lang)}
                className="inline-flex h-11 items-center gap-2 rounded-md bg-gold px-6 font-display text-sm font-semibold text-charcoal transition-colors hover:bg-gold-light"
              >
                {page.ctaAction}
                <span aria-hidden="true" className="rtl:rotate-180">
                  →
                </span>
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {others.length > 0 && (
        <section className="border-t border-line-soft bg-ink py-20">
          <div className="shell flex flex-col gap-10">
            <h2 className="text-2xl font-bold text-offwhite sm:text-3xl">
              {page.more}
            </h2>
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((item, index) => (
                <li key={item.slug} className="h-full">
                  <ProjectCard
                    project={item}
                    href={localizedPath(`/projects/${item.slug}`, lang)}
                    featuredLabel={dict.home.featuredProjects.featured}
                    viewLabel={dict.home.featuredProjects.viewProject}
                    plateIndex={index}
                  />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
