/**
 * The one place that knows the production origin (FR-FE-96).
 *
 * Pending decision Q-3 (domain). Everything that is not this exact origin is
 * treated as non-production: noindex headers, robots disallow, dev-only UI.
 */
export const PRODUCTION_ORIGIN = "https://kareemsabry.dev";

export function isProductionOrigin(siteUrl: string | undefined): boolean {
  if (!siteUrl) return false;
  try {
    return new URL(siteUrl).origin === PRODUCTION_ORIGIN;
  } catch {
    return false;
  }
}
