import { useId } from "react";

import { cn } from "@/lib/cn";

type MetrialLogotypeProps = {
  className?: string;
  /** Letter spacing in em; the brand sheet sets the word wide. */
  tracking?: number;
};

/**
 * The METRIAL logotype from the brand sheet: gold sheen letters and the A
 * drawn as an open chevron (no crossbar) — "METRIΛL". The chevron is SVG
 * because the display face has no such glyph; both it and the letters use
 * the same top-to-bottom gold ramp so they read as one word. A visually
 * hidden "A" keeps the word whole when it is selected and copied, and the
 * parts stay inline (not flex) so copying adds no line breaks.
 */
export function MetrialLogotype({
  className,
  tracking = 0.3,
}: MetrialLogotypeProps) {
  const gradientId = useId();
  const spacing = { letterSpacing: `${tracking}em` };

  return (
    <span
      role="img"
      aria-label="Metrial"
      className={cn(
        "inline-block font-display leading-none font-semibold whitespace-nowrap uppercase",
        className,
      )}
    >
      <span className="text-gold-sheen" style={spacing}>
        Metri
      </span>
      <span className="sr-only">A</span>
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 74 70"
        className="inline-block h-[0.7em] w-auto overflow-visible"
        // Stroke weight and baseline matched to the display face's caps.
        style={{ marginInlineEnd: `${tracking}em`, verticalAlign: "-0.02em" }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--color-gold-light)" />
            <stop offset=".55" stopColor="var(--color-gold)" />
            <stop offset="1" stopColor="var(--color-gold-dark)" />
          </linearGradient>
        </defs>
        <path
          d="M0 70 30 0h14l30 70H60L37 16.3 14 70Z"
          fill={`url(#${gradientId})`}
        />
      </svg>
      <span className="text-gold-sheen">L</span>
    </span>
  );
}
