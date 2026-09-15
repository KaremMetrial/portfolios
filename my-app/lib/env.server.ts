import "server-only";

import { z } from "zod";

/**
 * Server-only environment variables (SRS-FE §6, NFR-FE-S3).
 * Importing this file from a Client Component fails the build.
 */
const serverEnvSchema = z.object({
  API_INTERNAL_URL: z.url().default("http://localhost:8000"),
  REVALIDATE_SECRET: z.string().min(32).optional(),
  API_MODE: z.enum(["live", "fixtures"]).default("fixtures"),
});

export const serverEnv = serverEnvSchema.parse(process.env);
