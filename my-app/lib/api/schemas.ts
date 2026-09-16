/**
 * Zod schemas for the Metrial Portfolio API responses (FR-FE-11, SRS-BE §5).
 * Mirrors the backend envelope and every public resource shape.
 *
 * Uses Zod v4 which requires `z.record(keySchema, valueSchema)`.
 */
import { z } from "zod";

// ---------------------------------------------------------------------------
// Shared / envelope
// ---------------------------------------------------------------------------

export type LocaleMeta = {
  locale: string;
  direction: "ltr" | "rtl";
};

const metaEnvelope = z
  .object({
    request_id: z.string().optional(),
    pagination: z
      .object({
        current_page: z.number(),
        last_page: z.number(),
        per_page: z.number(),
        total: z.number(),
      })
      .optional(),
    locale: z.string().optional(),
    direction: z.enum(["ltr", "rtl"]).optional(),
  })
  .passthrough();

/** Generic API envelope: { success, message, data, meta }. */
export function envelopeSchema(
  dataSchema: z.ZodTypeAny,
) {
  return z.object({
    success: z.boolean(),
    message: z.string().nullable().optional(),
    data: dataSchema,
    meta: metaEnvelope.optional(),
  });
}

// ---------------------------------------------------------------------------
// Site settings (GET /site)
// ---------------------------------------------------------------------------

const availabilityEnum = z.enum([
  "open",
  "open_to_relocation",
  "not_available",
]);

const socialLink = z.object({
  platform: z.enum(["linkedin", "github", "x", "email", "website"]),
  url: z.string(),
  sort: z.number(),
});

const featureFlags = z
  .object({
    showcase_console: z.boolean(),
    showcase_presence: z.boolean(),
    showcase_github: z.boolean(),
    home_skills_constellation: z.boolean(),
    insights: z.boolean(),
  })
  .passthrough();

export const siteSchema = z
  .object({
    availability: availabilityEnum,
    availability_text: z.string(),
    open_to_relocation: z.boolean(),
    social_links: z.array(socialLink),
    contact_channels: z.array(
      z.object({
        type: z.enum(["email", "phone", "linkedin", "github"]),
        value: z.string(),
        visible: z.boolean(),
      }),
    ),
    feature_flags: featureFlags,
    seo_defaults: z.record(z.string(), z.string()).optional(),
    supported_locales: z.array(z.string()),
    cv_updated_at: z.string().nullable(),
  })
  .passthrough();

export type Site = z.infer<typeof siteSchema>;
export type SocialLink = z.infer<typeof socialLink>;
export type FeatureFlags = z.infer<typeof featureFlags>;

// ---------------------------------------------------------------------------
// Profile (GET /profile)
// ---------------------------------------------------------------------------

const proofStats = z.object({
  shipped_platforms: z.number(),
  companies: z.number(),
  public_apps: z.number(),
  experience_since: z.string(),
});

export const profileSchema = z
  .object({
    name: z.string(),
    headline: z.string(),
    summary: z.string(),
    about: z.string(),
    location: z.string(),
    availability: availabilityEnum,
    availability_text: z.string(),
    open_to_relocation: z.boolean(),
    email: z.string(),
    phone: z.string().optional(),
    phone_visible: z.boolean(),
    social_links: z.array(socialLink),
    stats: proofStats,
  })
  .passthrough();

export type Profile = z.infer<typeof profileSchema>;
export type ProofStats = z.infer<typeof proofStats>;

// ---------------------------------------------------------------------------
// Experience (GET /experiences)
// ---------------------------------------------------------------------------

export const experienceSchema = z
  .object({
    id: z.string(),
    company: z.string(),
    company_url: z.string().nullable(),
    role: z.string(),
    employment_type: z.enum([
      "full_time",
      "internship",
      "contract",
      "freelance",
    ]),
    location: z.string(),
    started_on: z.string(),
    ended_on: z.string().nullable(),
    highlights: z.array(z.string()),
    sort: z.number(),
    project_slugs: z.array(z.string()),
  })
  .passthrough();

export type Experience = z.infer<typeof experienceSchema>;

// ---------------------------------------------------------------------------
// Skills (GET /skills)
// ---------------------------------------------------------------------------

const skillSchema = z.object({
  key: z.string(),
  name: z.string(),
  icon: z.string().nullable(),
  sort: z.number(),
  project_count: z.number(),
});

export const skillGroupSchema = z.object({
  key: z.string(),
  name: z.string(),
  sort: z.number(),
  skills: z.array(skillSchema),
});

export type Skill = z.infer<typeof skillSchema>;
export type SkillGroup = z.infer<typeof skillGroupSchema>;

// ---------------------------------------------------------------------------
// Credentials (GET /credentials)
// ---------------------------------------------------------------------------

export const educationSchema = z
  .object({
    id: z.string(),
    institution: z.string(),
    degree: z.string(),
    field: z.string(),
    started_year: z.number(),
    ended_year: z.number().nullable(),
    location: z.string(),
  })
  .passthrough();

export const certificateSchema = z
  .object({
    id: z.string(),
    issuer: z.string(),
    title: z.string(),
    issued_on: z.string().nullable(),
    credential_url: z.string().nullable(),
    sort: z.number(),
  })
  .passthrough();

export type Education = z.infer<typeof educationSchema>;
export type Certificate = z.infer<typeof certificateSchema>;

// ---------------------------------------------------------------------------
// Projects (GET /projects)
// ---------------------------------------------------------------------------

const projectPeriod = z.object({
  started_on: z.string().nullable(),
  ended_on: z.string().nullable(),
});

const projectTechnology = z.object({
  key: z.string(),
  name: z.string(),
  group: z.string(),
});

const projectLink = z.object({
  kind: z.enum(["play_store", "app_store", "website", "github", "demo"]),
  url: z.string(),
  label: z.string(),
});

const projectMedia = z.object({
  type: z.enum(["image", "video"]),
  alt: z.string(),
  variants: z.record(z.string(), z.string()),
  width: z.number().optional(),
  height: z.number().optional(),
});

const projectSection = z.object({
  type: z.enum([
    "context",
    "role",
    "architecture",
    "flows",
    "challenges",
    "outcome",
  ]),
  heading: z.string(),
  body_markdown: z.string(),
  sort: z.number(),
});

/** Card-level project (list endpoint). */
export const projectCardSchema = z
  .object({
    slug: z.string(),
    title: z.string(),
    tagline: z.string(),
    domain: z.string(),
    type: z.enum(["company", "freelance", "personal", "open_source"]),
    confidentiality: z.enum(["public", "summary_only"]),
    period: projectPeriod,
    role: z.string(),
    technologies: z.array(projectTechnology),
    is_featured: z.boolean(),
    cover: projectMedia.nullable(),
    updated_at: z.string(),
  })
  .passthrough();

/** Full case-study project (detail endpoint). */
export const projectDetailSchema = projectCardSchema.extend({
  summary: z.string(),
  sections: z.array(projectSection),
  links: z.array(projectLink),
  media: z.array(projectMedia),
  architecture: z
    .object({
      nodes: z.array(z.record(z.string(), z.unknown())),
      edges: z.array(z.record(z.string(), z.unknown())),
    })
    .nullable(),
  flow: z
    .object({
      states: z.array(z.record(z.string(), z.unknown())),
      transitions: z.array(z.record(z.string(), z.unknown())),
    })
    .nullable(),
});

export type ProjectCard = z.infer<typeof projectCardSchema>;
export type ProjectDetail = z.infer<typeof projectDetailSchema>;
export type ProjectTechnology = z.infer<typeof projectTechnology>;
export type ProjectSection = z.infer<typeof projectSection>;

// ---------------------------------------------------------------------------
// Stats (GET /stats)
// ---------------------------------------------------------------------------

export const statsSchema = proofStats;

// ---------------------------------------------------------------------------
// Sitemap (GET /sitemap)
// ---------------------------------------------------------------------------

const sitemapEntry = z.object({
  path: z.string(),
  updated_at: z.string(),
  image: z
    .object({
      url: z.string(),
      alt: z.string(),
      width: z.number(),
      height: z.number(),
    })
    .optional(),
});

export const sitemapSchema = z.array(sitemapEntry);
export type SitemapEntry = z.infer<typeof sitemapEntry>;

// ---------------------------------------------------------------------------
// Redirects (GET /redirects)
// ---------------------------------------------------------------------------

export const redirectSchema = z.object({
  type: z.enum(["project", "article"]),
  old_slug: z.string(),
  new_slug: z.string(),
});

export type Redirect = z.infer<typeof redirectSchema>;

// ---------------------------------------------------------------------------
// Testimonials (GET /testimonials)
// ---------------------------------------------------------------------------

export const testimonialSchema = z
  .object({
    id: z.string(),
    author: z.string(),
    role: z.string(),
    company: z.string().nullable(),
    quote: z.string(),
  })
  .passthrough();

export type Testimonial = z.infer<typeof testimonialSchema>;

// ---------------------------------------------------------------------------
// GitHub snapshot (GET /showcase/github)
// ---------------------------------------------------------------------------

export const githubSchema = z
  .object({
    username: z.string(),
    avatar_url: z.string().url(),
    public_repos: z.number(),
    followers: z.number(),
    pinned_repos: z.array(
      z.object({
        name: z.string(),
        url: z.string().url(),
        description: z.string().nullable(),
        language: z.string().nullable(),
        stars: z.number(),
      }),
    ),
    languages: z.record(z.string(), z.number()),
    contributions: z.array(
      z.object({
        date: z.string(),
        count: z.number(),
      }),
    ),
    meta: z.object({ stale: z.boolean() }),
  })
  .passthrough();

export type GithubData = z.infer<typeof githubSchema>;

// ---------------------------------------------------------------------------
// SEO page fields (GET /seo/pages/{page})
// ---------------------------------------------------------------------------

export const seoPageSchema = z.object({
  title: z.string().nullable(),
  description: z.string().nullable(),
  og_image: z.string().nullable(),
  noindex: z.boolean(),
});

export type SeoPage = z.infer<typeof seoPageSchema>;
