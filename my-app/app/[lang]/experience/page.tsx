import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Award, ExternalLink, GraduationCap } from "lucide-react";

import { ClosingCTA } from "@/components/sections";
import { ExperienceTimeline } from "@/components/sections/experience-timeline";
import { PageHero } from "@/components/ui/page-hero";
import { getCredentials, getExperiences } from "@/lib/api";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/experience">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = getDictionary(lang);
  return {
    title: dict.pages.experience.metaTitle,
    description: dict.pages.experience.description,
  };
}

export default async function ExperiencePage({
  params,
}: PageProps<"/[lang]/experience">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = getDictionary(lang);
  const page = dict.pages.experience;
  const [experiences, credentials] = await Promise.all([
    getExperiences(lang),
    getCredentials(lang),
  ]);

  return (
    <>
      <PageHero
        eyebrow={page.eyebrow}
        title={page.title}
        description={page.description}
      />

      <section className="bg-ink-2 py-20">
        <div className="shell">
          <ExperienceTimeline
            experiences={experiences}
            present={dict.home.experience.present}
            lang={lang}
            maxHighlights={12}
          />
        </div>
      </section>

      <section className="border-t border-line-soft bg-ink py-20">
        <div className="shell grid gap-12 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold text-offwhite sm:text-3xl">
              {page.education}
            </h2>
            <ul className="flex flex-col gap-4">
              {credentials.education.map((item) => (
                <li
                  key={item.id}
                  className="flex gap-4 rounded-card border border-line bg-surface p-6 shadow-card"
                >
                  <span
                    aria-hidden="true"
                    className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-gold/30 bg-gold/10 text-gold"
                  >
                    <GraduationCap className="h-5 w-5" />
                  </span>
                  <div className="flex flex-col gap-1">
                    <p className="font-display text-xs font-semibold tracking-[0.16em] text-gold uppercase">
                      {item.started_year} – {item.ended_year ?? "…"}
                    </p>
                    <h3 className="text-lg font-bold text-offwhite">
                      {item.degree}, {item.field}
                    </h3>
                    <p className="text-sm text-silver">
                      {item.institution} · {item.location}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold text-offwhite sm:text-3xl">
              {page.certificates}
            </h2>
            <ul className="flex flex-col gap-4">
              {[...credentials.certificates]
                .sort((a, b) => a.sort - b.sort)
                .map((item) => (
                  <li
                    key={item.id}
                    className="flex gap-4 rounded-card border border-line bg-surface p-6 shadow-card"
                  >
                    <span
                      aria-hidden="true"
                      className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-gold/30 bg-gold/10 text-gold"
                    >
                      <Award className="h-5 w-5" />
                    </span>
                    <div className="flex flex-col gap-1">
                      <p className="font-display text-xs font-semibold tracking-[0.16em] text-gold uppercase">
                        {item.issuer}
                      </p>
                      <h3 className="text-lg font-bold text-offwhite">
                        {item.title}
                      </h3>
                      {item.credential_url && (
                        <a
                          href={item.credential_url}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold hover:text-gold-light"
                        >
                          {page.viewCredential}
                          <ExternalLink
                            className="h-3.5 w-3.5"
                            aria-hidden="true"
                          />
                        </a>
                      )}
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </section>

      <ClosingCTA dict={dict.home.cta} lang={lang} />
    </>
  );
}
