/**
 * Generate content snapshot files for offline fallback (FR-FE-14).
 *
 * Usage: npx tsx scripts/snapshot.ts
 *
 * Fetches all public endpoints for both locales and writes
 * content/snapshot/{en,ar}.json. Used by CI before `next build`.
 */
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const API_BASE = process.env.API_INTERNAL_URL || "http://localhost:8000";
const API_MODE = process.env.API_MODE || "fixtures";
const LOCALES = ["en", "ar"] as const;

interface SnapshotData {
  site: Record<string, unknown>;
  profile: Record<string, unknown>;
  experiences: unknown[];
  skills: unknown[];
  credentials: { education: unknown[]; certificates: unknown[] };
  projects: unknown[];
  stats: Record<string, unknown>;
}

async function fetchJson(path: string, lang: string): Promise<unknown> {
  const url = new URL(`/api/v1${path}`, API_BASE);
  url.searchParams.set("lang", lang);
  const res = await fetch(url.toString(), {
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`Fetch ${path} failed: ${res.status}`);
  const json = await res.json();
  return json.data ?? json;
}

async function buildSnapshot(lang: string): Promise<SnapshotData> {
  console.log(`  Fetching snapshot for ${lang}...`);

  const [site, profile, experiences, skills, credentials, projects, stats] =
    await Promise.all([
      fetchJson("/site", lang),
      fetchJson("/profile", lang),
      fetchJson("/experiences", lang),
      fetchJson("/skills", lang),
      fetchJson("/credentials", lang),
      fetchJson("/projects", lang),
      fetchJson("/stats", lang),
    ]);

  return {
    site: site as Record<string, unknown>,
    profile: profile as Record<string, unknown>,
    experiences: experiences as unknown[],
    skills: skills as unknown[],
    credentials: credentials as { education: unknown[]; certificates: unknown[] },
    projects: projects as unknown[],
    stats: stats as Record<string, unknown>,
  };
}

async function main() {
  if (API_MODE !== "live") {
    console.log(
      `[snapshot] API_MODE=${API_MODE} — skipping snapshot generation (only needed for live mode).`,
    );
    process.exit(0);
  }

  const outDir = resolve(__dirname, "../content/snapshot");

  for (const lang of LOCALES) {
    try {
      const data = await buildSnapshot(lang);
      const outPath = resolve(outDir, `${lang}.json`);
      writeFileSync(outPath, JSON.stringify(data, null, 2));
      console.log(`  ✓ ${outPath}`);
    } catch (e) {
      console.error(`  ✗ Failed to build snapshot for ${lang}:`, e);
      process.exit(1);
    }
  }

  console.log("[snapshot] Done.");
}

main();
