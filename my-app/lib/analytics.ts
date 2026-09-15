/**
 * First-party analytics queue (FR-FE-80–82).
 *
 * FE-0 stub: events are queued and logged in dev. The beacon transport to the
 * backend `/api/events` proxy lands with the analytics work in FE-6.
 */

export type AnalyticsEvent =
  | "page_view"
  | "cv_download"
  | "project_view"
  | "contact_submit"
  | "language_switch";

type Queue = Array<{ event: AnalyticsEvent; props: Record<string, unknown> }>;

const queue: Queue = [];

function respectsPrivacy(): boolean {
  if (typeof window === "undefined") return false;
  const dnt =
    navigator.doNotTrack === "1" ||
    (window as { doNotTrack?: string }).doNotTrack === "1";
  const gpc = (navigator as { globalPrivacyControl?: boolean })
    .globalPrivacyControl;
  return Boolean(dnt || gpc);
}

export function track(
  event: AnalyticsEvent,
  props: Record<string, unknown> = {},
): void {
  if (respectsPrivacy()) return;

  queue.push({ event, props });

  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console -- intentional dev-only output
    console.debug("[analytics]", event, props);
  }
}
