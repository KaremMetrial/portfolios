import { MetrialMark } from "./metrial-mark";

type MetrialWordmarkProps = {
  className?: string;
  /** Accessible name; only set when the wordmark stands alone (e.g. footer). */
  label?: string;
};

/**
 * The METRIAL brand lockup: M mark + wordmark (SRS-FE §4.2).
 * Renders as a single non-interactive flex row; pair with a Link/button for
 * navigation. Uses the display face with wide uppercase tracking (brand sheet).
 */
export function MetrialWordmark({ className, label }: MetrialWordmarkProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 font-display text-sm font-semibold tracking-[0.2em] uppercase ${className ?? ""}`}
      role={label ? "img" : undefined}
      aria-label={label}
    >
      <MetrialMark className="h-6 w-auto" />
      <span aria-hidden="true">Metrial</span>
    </span>
  );
}
