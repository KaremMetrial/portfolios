import { notFound } from "next/navigation";

import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import {
  getProfile,
  getExperiences,
  getSkills,
  getProjects,
  getStats,
  type SkillGroup,
} from "@/lib/api";

import { hasTechLogo } from "@/components/brand/tech-logo";
import type { TechItem } from "@/components/sections/tech-strip";

import {
  Hero,
  ProofStats,
  TechStrip,
  FeaturedProjects,
  ExperienceSnapshot,
  SkillsSection,
  ClosingCTA,
} from "@/components/sections";

/**
 * The stack that actually appears in the work: technologies with a brand mark
 * first (they carry the strip visually), then the rest by project count.
 */
function topTechnologies(groups: SkillGroup[], limit = 9): TechItem[] {
  return groups
    .flatMap((group) => group.skills)
    .map((skill) => ({
      key: skill.key,
      name: skill.name,
      hasLogo: hasTechLogo(skill.key),
      count: skill.project_count,
    }))
    .sort((a, b) => Number(b.hasLogo) - Number(a.hasLogo) || b.count - a.count)
    .slice(0, limit)
    .map(({ key, name, hasLogo }) => ({ key, name, hasLogo }));
}

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = getDictionary(lang);
  const homeDict = dict.home;

  // Fetch all data in parallel.
  const [profile, experiences, skills, projects, stats] = await Promise.all([
    getProfile(lang as Locale),
    getExperiences(lang as Locale),
    getSkills(lang as Locale),
    getProjects(lang as Locale, { featured: true }),
    getStats(lang as Locale),
  ]);

  // Years of experience: computed from the static experience_since date.
  // Uses build-time date for consistency during prerendering.
  const yearsOfExperience = (() => {
    const since = new Date(stats.experience_since + "-01");
    const now = new Date("2026-09-16"); // Current date (stable for prerender)
    return Math.max(
      0,
      Math.floor(
        (now.getTime() - since.getTime()) / (365.25 * 24 * 60 * 60 * 1000),
      ),
    );
  })();

  return (
    <>
      <Hero
        profile={profile}
        dict={{
          eyebrow: homeDict.eyebrow,
          role: homeDict.role,
          specialties: homeDict.specialties,
          rail: homeDict.rail,
          viewWork: homeDict.viewWork,
          letsTalk: homeDict.letsTalk,
          contact: homeDict.contact,
        }}
        lang={lang as Locale}
      />

      <ProofStats
        stats={stats}
        yearsOfExperience={yearsOfExperience}
        dict={{
          eyebrow: homeDict.proofStats.eyebrow,
          title: homeDict.proofStats.title,
          platforms: homeDict.proofStats.platforms,
          companies: homeDict.proofStats.companies,
          apps: homeDict.proofStats.apps,
          experience: homeDict.proofStats.experience,
          years: homeDict.proofStats.years,
        }}
      />

      <TechStrip
        items={topTechnologies(skills)}
        label={homeDict.techStrip.label}
      />

      <FeaturedProjects
        projects={projects}
        dict={{
          eyebrow: homeDict.featuredProjects.eyebrow,
          title: homeDict.featuredProjects.title,
          description: homeDict.featuredProjects.description,
          viewAll: homeDict.featuredProjects.viewAll,
          featured: homeDict.featuredProjects.featured,
          viewProject: homeDict.featuredProjects.viewProject,
        }}
        lang={lang as Locale}
      />

      <ExperienceSnapshot
        experiences={experiences}
        dict={{
          eyebrow: homeDict.experience.eyebrow,
          title: homeDict.experience.title,
          description: homeDict.experience.description,
          present: homeDict.experience.present,
          viewAll: homeDict.experience.viewAll,
        }}
        lang={lang as Locale}
      />

      <SkillsSection
        skillGroups={skills}
        dict={{
          eyebrow: homeDict.skills.eyebrow,
          title: homeDict.skills.title,
          description: homeDict.skills.description,
        }}
      />

      <ClosingCTA
        dict={{
          eyebrow: homeDict.cta.eyebrow,
          title: homeDict.cta.title,
          description: homeDict.cta.description,
          contact: homeDict.cta.contact,
          viewWork: homeDict.cta.viewWork,
          rail: homeDict.cta.rail,
        }}
        lang={lang as Locale}
      />
    </>
  );
}
