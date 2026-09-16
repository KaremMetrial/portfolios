/**
 * Server-only API client (FR-FE-11 – FR-FE-15).
 *
 * - Typed fetch with Zod parsing
 * - `use cache` + `cacheTag` + `cacheLife` for on-demand revalidation
 * - `API_MODE=fixtures` serves typed fixtures so the frontend is not blocked
 * - On failure, falls back to the bundled content snapshot (FR-FE-13)
 */
import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { z } from "zod";

import { serverEnv } from "@/lib/env.server";
import { type Locale } from "@/lib/i18n/config";
import type { ProofStats } from "./schemas";

import {
  certificateSchema,
  educationSchema,
  envelopeSchema,
  experienceSchema,
  githubSchema,
  profileSchema,
  projectCardSchema,
  projectDetailSchema,
  redirectSchema,
  seoPageSchema,
  siteSchema,
  skillGroupSchema,
  sitemapSchema,
  statsSchema,
  testimonialSchema,
  type Certificate,
  type Education,
  type Experience,
  type GithubData,
  type ProjectCard,
  type ProjectDetail,
  type Redirect,
  type SeoPage,
  type Site,
  type SkillGroup,
  type SitemapEntry,
  type Testimonial,
} from "./schemas";

// ── Fixtures ────────────────────────────────────────────────────────────────

import { siteFixture } from "./fixtures/site";
import { profileFixture } from "./fixtures/profile";
import { experiencesFixture } from "./fixtures/experiences";
import { skillsFixture } from "./fixtures/skills";
import { projectsFixture } from "./fixtures/projects";
import {
  educationFixture,
  certificatesFixture,
} from "./fixtures/credentials";
import { statsFixture } from "./fixtures/stats";

// ── Helpers ─────────────────────────────────────────────────────────────────

const TIMEOUT_MS = 5_000;

function apiBase(): string {
  return serverEnv.API_INTERNAL_URL;
}

function isFixtures(): boolean {
  return serverEnv.API_MODE === "fixtures";
}

async function apiFetch<T>(
  path: string,
  locale: Locale,
  schema: z.ZodObject<{
    success: z.ZodBoolean;
    message: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    data: z.ZodTypeAny;
    meta: z.ZodOptional<z.ZodTypeAny>;
  }>,
): Promise<T> {
  if (isFixtures()) {
    throw new Error("fixtures-mode");
  }

  const url = new URL(`/api/v1${path}`, apiBase());
  url.searchParams.set("lang", locale);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(url.toString(), {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      throw new Error(`API ${res.status}: ${res.statusText}`);
    }

    const json = await res.json();
    const parsed = schema.safeParse(json);

    if (!parsed.success) {
      console.error("[api/client] Schema mismatch:", parsed.error);
      throw new Error("Schema mismatch");
    }

    return parsed.data.data as T;
  } finally {
    clearTimeout(timer);
  }
}

function logFallback(fn: string, reason: string) {
  console.warn(
    `[api/client] ${fn}: falling back to snapshot/fixtures (${reason})`,
  );
}

// ── Public data functions ───────────────────────────────────────────────────

const API_MODE = isFixtures();

export async function getSite(locale: Locale): Promise<Site> {
  "use cache";
  cacheLife("hours");
  cacheTag("site");

  if (API_MODE) return siteFixture;

  try {
    return await apiFetch("/site", locale, envelopeSchema(siteSchema));
  } catch (e) {
    logFallback("getSite", String(e));
    return siteFixture;
  }
}

export async function getProfile(locale: Locale): Promise<ProfileData> {
  "use cache";
  cacheLife("hours");
  cacheTag("profile");

  if (API_MODE) return profileFixture;

  try {
    return await apiFetch("/profile", locale, envelopeSchema(profileSchema));
  } catch (e) {
    logFallback("getProfile", String(e));
    return profileFixture;
  }
}

/** Inferred type from getProfile (avoids circular alias). */
export type ProfileData = (typeof profileFixture);

export async function getExperiences(
  locale: Locale,
): Promise<Experience[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("experiences");

  if (API_MODE) return experiencesFixture;

  try {
    return await apiFetch(
      "/experiences",
      locale,
      envelopeSchema(z.array(experienceSchema)),
    );
  } catch (e) {
    logFallback("getExperiences", String(e));
    return experiencesFixture;
  }
}

export async function getSkills(locale: Locale): Promise<SkillGroup[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("skills");

  if (API_MODE) return skillsFixture;

  try {
    return await apiFetch(
      "/skills",
      locale,
      envelopeSchema(z.array(skillGroupSchema)),
    );
  } catch (e) {
    logFallback("getSkills", String(e));
    return skillsFixture;
  }
}

export async function getCredentials(locale: Locale): Promise<{
  education: Education[];
  certificates: Certificate[];
}> {
  "use cache";
  cacheLife("hours");
  cacheTag("credentials");

  if (API_MODE) {
    return { education: educationFixture, certificates: certificatesFixture };
  }

  try {
    return await apiFetch(
      "/credentials",
      locale,
      envelopeSchema(
        z.object({
          education: z.array(educationSchema),
          certificates: z.array(certificateSchema),
        }),
      ),
    );
  } catch (e) {
    logFallback("getCredentials", String(e));
    return { education: educationFixture, certificates: certificatesFixture };
  }
}

export async function getProjects(
  locale: Locale,
  filters?: {
    domain?: string;
    skill?: string;
    featured?: boolean;
  },
): Promise<ProjectCard[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("projects");

  if (API_MODE) {
    let result = projectsFixture;
    if (filters?.featured) result = result.filter((p) => p.is_featured);
    if (filters?.domain)
      result = result.filter((p) => p.domain === filters.domain);
    return result;
  }

  const params = new URLSearchParams();
  if (filters?.domain) params.set("filter[domain]", filters.domain);
  if (filters?.skill) params.set("filter[skill]", filters.skill);
  if (filters?.featured) params.set("filter[featured]", "1");

  const qs = params.toString() ? `?${params}` : "";

  try {
    return await apiFetch(
      `/projects${qs}`,
      locale,
      envelopeSchema(z.array(projectCardSchema)),
    );
  } catch (e) {
    logFallback("getProjects", String(e));
    return projectsFixture;
  }
}

export async function getProject(
  slug: string,
  locale: Locale,
): Promise<ProjectDetail | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("projects", `project:${slug}`);

  if (API_MODE) {
    const card = projectsFixture.find((p) => p.slug === slug);
    if (!card) return null;
    if (card.confidentiality === "summary_only") {
      return {
        ...card,
        summary: "",
        sections: [],
        links: [],
        media: [],
        architecture: null,
        flow: null,
      };
    }
    return {
      ...card,
      summary: card.tagline,
      sections: [],
      links: [],
      media: [],
      architecture: null,
      flow: null,
    };
  }

  try {
    return await apiFetch(
      `/projects/${slug}`,
      locale,
      envelopeSchema(projectDetailSchema),
    );
  } catch (e) {
    logFallback("getProject", String(e));
    const card = projectsFixture.find((p) => p.slug === slug);
    if (!card) return null;
    return {
      ...card,
      summary: card.tagline,
      sections: [],
      links: [],
      media: [],
      architecture: null,
      flow: null,
    };
  }
}

export async function getStats(locale: Locale): Promise<ProofStats> {
  "use cache";
  cacheLife("hours");
  cacheTag("stats");

  if (API_MODE) return statsFixture;

  try {
    return await apiFetch("/stats", locale, envelopeSchema(statsSchema));
  } catch (e) {
    logFallback("getStats", String(e));
    return statsFixture;
  }
}

export async function getTestimonials(
  locale: Locale,
): Promise<Testimonial[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("profile");

  if (API_MODE) return [];

  try {
    return await apiFetch(
      "/testimonials",
      locale,
      envelopeSchema(z.array(testimonialSchema)),
    );
  } catch (e) {
    logFallback("getTestimonials", String(e));
    return [];
  }
}

export async function getSitemap(
  locale: Locale,
): Promise<SitemapEntry[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("sitemap", "projects");

  if (API_MODE) {
    const entries: SitemapEntry[] = [
      { path: "/", updated_at: "2026-09-15T00:00:00Z" },
      { path: "/projects", updated_at: "2026-09-15T00:00:00Z" },
      { path: "/experience", updated_at: "2026-09-15T00:00:00Z" },
      { path: "/about", updated_at: "2026-09-15T00:00:00Z" },
      { path: "/contact", updated_at: "2026-09-15T00:00:00Z" },
    ];
    for (const p of projectsFixture) {
      if (p.confidentiality !== "public") continue;
      entries.push({
        path: `/projects/${p.slug}`,
        updated_at: p.updated_at,
      });
    }
    return entries;
  }

  try {
    return await apiFetch("/sitemap", locale, envelopeSchema(sitemapSchema));
  } catch (e) {
    logFallback("getSitemap", String(e));
    return [];
  }
}

export async function getRedirects(): Promise<Redirect[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("redirects");

  if (API_MODE) return [];

  try {
    return await apiFetch(
      "/redirects",
      "en",
      envelopeSchema(z.array(redirectSchema)),
    );
  } catch (e) {
    logFallback("getRedirects", String(e));
    return [];
  }
}

export async function getSeoPage(
  page: string,
  locale: Locale,
): Promise<SeoPage> {
  "use cache";
  cacheLife("hours");
  cacheTag("seo");

  if (API_MODE) {
    return { title: null, description: null, og_image: null, noindex: false };
  }

  try {
    return await apiFetch(
      `/seo/pages/${page}`,
      locale,
      envelopeSchema(seoPageSchema),
    );
  } catch (e) {
    logFallback("getSeoPage", String(e));
    return { title: null, description: null, og_image: null, noindex: false };
  }
}

export async function getGithub(
  locale: Locale,
): Promise<GithubData | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("github");

  if (API_MODE) return null;

  try {
    return await apiFetch(
      "/showcase/github",
      locale,
      envelopeSchema(githubSchema),
    );
  } catch (e) {
    logFallback("getGithub", String(e));
    return null;
  }
}
