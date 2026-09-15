/**
 * First-party analytics queue (FR-FE-80–82).
 *
 * FE-0 stub: events are queued and logged in dev. The beacon transport to
 * `POST {API}/analytics/events` lands with the analytics work in FE-6.
 */

export type AnalyticsEvent =
  | "page_view"
  | "cv_download"
  | "project_view"
  | "contact_submit"
  | "language_switch";

type QueuedEvent = {
  event: AnalyticsEvent;
  props: Record<string, unknown>;
  anonymous: boolean;
};

const queue: QueuedEvent[] = [];

function prefersPrivacy(): boolean {
  if (typeof window === "undefined") return false;
  const gpc = (navigator as { globalPrivacyControl?: boolean })
    .globalPrivacyControl;
  return navigator.doNotTrack === "1" || gpc === true;
}

/** FR-FE-81: with DNT or GPC, only an anonymous page_view is sent. */
export function track(
  event: AnalyticsEvent,
  props: Record<string, unknown> = {},
): void {
  const anonymous = prefersPrivacy();
  if (anonymous && event !== "page_view") return;

  const queued: QueuedEvent = anonymous
    ? { event, props: {}, anonymous }
    : { event, props, anonymous };
  queue.push(queued);

  if (process.env.NODE_ENV === "development") {
    console.debug("[analytics]", queued);
  }
}
