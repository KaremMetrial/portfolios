import { notFound } from "next/navigation";

import { env } from "@/lib/env";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import {
  getProfile,
  getExperiences,
  getSkills,
  getProjects,
  getStats,
} from "@/lib/api";

import {
  Hero,
  LiveStrip,
  ProofStats,
  FeaturedProjects,
  ExperienceSnapshot,
  SkillsSection,
  ClosingCTA,
} from "@/components/sections";

export default async function HomePage({
  params,
}: PageProps<"/[lang]">) {
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
        (now.getTime() - since.getTime()) /
          (365.25 * 24 * 60 * 60 * 1000),
      ),
    );
  })();

  return (
    <>
      <Hero
        profile={profile}
        dict={{
          role: homeDict.role,
          specialties: homeDict.specialties,
          viewWork: homeDict.viewWork,
          downloadCv: homeDict.downloadCv,
          contact: homeDict.contact,
        }}
        lang={lang as Locale}
      />

      <LiveStrip
        apiUrl={env.NEXT_PUBLIC_API_URL}
        operational={homeDict.liveStrip.operational}
        unavailable={homeDict.liveStrip.unavailable}
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
        }}
      />

      <FeaturedProjects
        projects={projects}
        dict={{
          eyebrow: homeDict.featuredProjects.eyebrow,
          title: homeDict.featuredProjects.title,
          viewAll: homeDict.featuredProjects.viewAll,
        }}
        lang={lang as Locale}
      />

      <ExperienceSnapshot
        experiences={experiences}
        dict={{
          eyebrow: homeDict.experience.eyebrow,
          title: homeDict.experience.title,
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
        }}
      />

      <ClosingCTA
        dict={{
          eyebrow: homeDict.cta.eyebrow,
          title: homeDict.cta.title,
          description: homeDict.cta.description,
          contact: homeDict.cta.contact,
        }}
        lang={lang as Locale}
      />
    </>
  );
}
