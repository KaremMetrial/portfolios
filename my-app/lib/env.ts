import { z } from "zod";

import { isProductionOrigin } from "./site";

/**
 * Public environment variables (SRS-FE §6), safe for client bundles.
 * Server-only secrets live in `lib/env.server.ts` (NFR-FE-S3).
 *
 * Each var is referenced literally so Next.js can inline it into the client.
 */
const publicEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.url().default("http://localhost:3000"),
  NEXT_PUBLIC_API_URL: z.url().default("http://localhost:8000/api/v1"),
  NEXT_PUBLIC_REALTIME_URL: z.url().default("http://localhost:6001"),
  NEXT_PUBLIC_BOT_CHALLENGE_SITE_KEY: z.string().min(1).optional(),
});

export const env = publicEnvSchema.parse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_REALTIME_URL: process.env.NEXT_PUBLIC_REALTIME_URL,
  NEXT_PUBLIC_BOT_CHALLENGE_SITE_KEY:
    process.env.NEXT_PUBLIC_BOT_CHALLENGE_SITE_KEY || undefined,
});

/** FR-FE-96: only the production origin may be indexed. */
export const isProduction = isProductionOrigin(env.NEXT_PUBLIC_SITE_URL);
