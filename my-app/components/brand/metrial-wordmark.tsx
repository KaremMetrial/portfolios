import { cn } from "@/lib/cn";

import { MetrialMark } from "./metrial-mark";

type MetrialWordmarkProps = {
  className?: string;
  /** Accessible name; only set when the wordmark stands alone (e.g. footer). */
  label?: string;
  /** Lockup scale. `lg` is the footer / brand-sheet size. */
  size?: "sm" | "md" | "lg";
  /** Show the "Karem Sabry" sub-line from the brand sheet lockup. */
  subline?: string;
};

const markSize = {
  sm: "h-5 w-auto",
  md: "h-6 w-auto",
  lg: "h-9 w-auto",
} as const;

const textSize = {
  sm: "text-xs tracking-[0.22em]",
  md: "text-sm tracking-[0.24em]",
  lg: "text-lg tracking-[0.3em]",
} as const;

/**
 * The METRIAL brand lockup: M mark + wordmark (SRS-FE §4.2, brand sheet).
 * Renders as a single non-interactive flex row; pair with a Link/button for
 * navigation. Uses the display face with wide uppercase tracking.
 */
export function MetrialWordmark({
  className,
  label,
  size = "md",
  subline,
}: MetrialWordmarkProps) {
  return (
    <span
      className={cn("inline-flex items-center gap-2.5", className)}
      role={label ? "img" : undefined}
      aria-label={label}
    >
      <MetrialMark className={markSize[size]} />
      <span className="inline-flex flex-col leading-none" aria-hidden="true">
        <span
          className={cn(
            "font-display font-semibold text-offwhite uppercase",
            textSize[size],
          )}
        >
          Metrial
        </span>
        {subline && (
          <span className="mt-1 font-display text-[0.5rem] font-medium tracking-[0.34em] text-silver uppercase">
            {subline}
          </span>
        )}
      </span>
    </span>
  );
}
