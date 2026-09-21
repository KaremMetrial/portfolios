import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Gauge, KeyRound, ShieldCheck, TestTubes } from "lucide-react";

import { ClosingCTA, ProofStats, SkillsSection } from "@/components/sections";
import { SlopeDivider } from "@/components/motion/slope-divider";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { PageHero } from "@/components/ui/page-hero";
import { getProfile, getSkills, getStats } from "@/lib/api";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

const valueIcons = [ShieldCheck, TestTubes, Gauge, KeyRound];

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/about">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = getDictionary(lang);
  return { title: dict.pages.about.metaTitle };
}

/** Whole years since the "YYYY-MM" start, against a fixed prerender date. */
function yearsSince(since: string): number {
  const start = new Date(since + "-01");
  const now = new Date("2026-09-16");
  return Math.max(
    0,
    Math.floor(
      (now.getTime() - start.getTime()) / (365.25 * 24 * 60 * 60 * 1000),
    ),
  );
}

export default async function AboutPage({
  params,
}: PageProps<"/[lang]/about">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = getDictionary(lang);
  const page = dict.pages.about;
  const [profile, skills, stats] = await Promise.all([
    getProfile(lang),
    getSkills(lang),
    getStats(lang),
  ]);

  return (
    <>
      <PageHero
        eyebrow={page.eyebrow}
        title={page.title}
        description={profile.about}
      />

      <ProofStats
        stats={stats}
        yearsOfExperience={yearsSince(stats.experience_since)}
        dict={dict.home.proofStats}
      />

      {/* Studio frame with the brand quote, full width. */}
      <section className="border-b border-line-soft bg-ink py-20">
        <div className="shell">
          <div className="relative aspect-16/9 overflow-hidden rounded-card border border-line shadow-lift sm:aspect-21/9">
            <Image
              src="/brand/studio-hq.webp"
              quality={90}
              alt=""
              fill
              sizes="(min-width: 1280px) 1200px, 100vw"
              className="object-cover"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent"
            />
            <figure className="absolute end-6 bottom-6 max-w-[17rem] border border-line/80 bg-ink/85 px-6 py-5 backdrop-blur-sm sm:end-10 sm:bottom-10">
              <blockquote className="font-display text-lg leading-snug font-medium text-offwhite">
                {dict.home.about.quote}
              </blockquote>
              <SlopeDivider className="mt-4 w-12" />
            </figure>
          </div>
        </div>
      </section>

      <section className="border-b border-line-soft bg-ink-2 py-20">
        <div className="shell flex flex-col gap-12">
          <h2 className="text-3xl font-bold text-offwhite sm:text-4xl">
            {page.valuesTitle}
          </h2>
          <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {page.values.map((value, index) => {
              const Icon = valueIcons[index % valueIcons.length];
              return (
                <StaggerItem key={value.title} className="h-full">
                  <article className="flex h-full flex-col gap-4 rounded-card border border-line bg-surface p-6 shadow-card transition-colors hover:border-gold/45">
                    <span
                      aria-hidden="true"
                      className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-gold/30 bg-gold/10 text-gold"
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="text-lg font-bold text-offwhite">
                      {value.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-silver">
                      {value.body}
                    </p>
                  </article>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </section>

      <SkillsSection skillGroups={skills} dict={dict.home.skills} />

      <ClosingCTA dict={dict.home.cta} lang={lang} />
    </>
  );
}
