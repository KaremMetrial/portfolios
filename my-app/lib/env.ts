import { z } from "zod";

/**
 * Environment variables (SRS-FE §6).
 *
 * Public vars are inlined into the client bundle; server-only secrets are
 * validated through `serverEnv` and must never be imported from client
 * components (NFR-FE-S3) — pair with the `server-only` package.
 */
const publicEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z
    .url()
    .default("http://localhost:3000"),
  NEXT_PUBLIC_API_URL: z
    .url()
    .default("http://localhost:8000/api/v1"),
  NEXT_PUBLIC_REALTIME_URL: z
    .url()
    .default("http://localhost:6001"),
  NEXT_PUBLIC_BOT_CHALLENGE_SITE_KEY: z.string().min(1).optional(),
});

const serverEnvSchema = z.object({
  API_INTERNAL_URL: z.url().default("http://localhost:8000"),
  REVALIDATE_SECRET: z.string().min(32).optional(),
  API_MODE: z.enum(["live", "fixtures"]).default("fixtures"),
});

export const env = publicEnvSchema.parse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_REALTIME_URL: process.env.NEXT_PUBLIC_REALTIME_URL,
  NEXT_PUBLIC_BOT_CHALLENGE_SITE_KEY:
    process.env.NEXT_PUBLIC_BOT_CHALLENGE_SITE_KEY,
});

export const serverEnv = serverEnvSchema.parse(process.env);

/**
 * FR-FE-96: anything that is not the production origin is treated as
 * non-production (noindex headers, robots disallow, dev-only UI).
 */
export const isProduction =
  process.env.NEXT_PUBLIC_SITE_URL === "https://kareemsabry.dev";
