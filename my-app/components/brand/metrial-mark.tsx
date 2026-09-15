import { useId } from "react";

/** Polygons from images/metrial-mark.svg (viewBox 625 × 615). */
const MARK_PATH =
  "M0 0 312.5 195.31 625 0 625 105 312.5 300.31 0 105ZM0 165 90 221.25 90 565 0 508.75ZM150 258.75 287.5 344.69 287.5 449.69 150 363.75ZM337.5 344.69 625 165 625 508.75 535 565 535 326.25 337.5 449.69ZM337.5 509.69 475 423.75 475 528.75 337.5 614.69Z";

type MetrialMarkProps = {
  className?: string;
  /** Gold gradient (default) or `currentColor`. */
  variant?: "gold" | "mono";
  /** Accessible name; omit when the mark sits next to visible text. */
  title?: string;
};

export function MetrialMark({
  className,
  variant = "gold",
  title,
}: MetrialMarkProps) {
  const gradientId = useId();

  return (
    <svg
      viewBox="0 0 625 615"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {variant === "gold" && (
        <defs>
          <linearGradient
            id={gradientId}
            x1="0"
            y1="0"
            x2="625"
            y2="615"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="var(--color-gold-light)" />
            <stop offset=".5" stopColor="var(--color-gold)" />
            <stop offset="1" stopColor="var(--color-gold-dark)" />
          </linearGradient>
        </defs>
      )}
      <path
        fill={variant === "gold" ? `url(#${gradientId})` : "currentColor"}
        d={MARK_PATH}
      />
    </svg>
  );
}
