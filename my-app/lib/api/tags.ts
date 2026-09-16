/**
 * Cache tag constants shared with the backend (SRS-BE FR-BE-51).
 * Used with Next.js `cacheTag()` and `revalidateTag()`.
 */

export const TAGS = {
  profile: "profile",
  site: "site",
  experiences: "experiences",
  skills: "skills",
  credentials: "credentials",
  projects: "projects",
  stats: "stats",
  testimonials: "testimonials",
  sitemap: "sitemap",
  redirects: "redirects",
  seo: "seo",
  insights: "insights",
  github: "github",
} as const;

/** Dynamic tag for a single project by slug. */
export function projectTag(slug: string): string {
  return `project:${slug}`;
}

/** Dynamic tag for a single article by slug. */
export function articleTag(slug: string): string {
  return `article:${slug}`;
}
