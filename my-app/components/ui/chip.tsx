import { cn } from "@/lib/cn";

type ChipProps = {
  children: React.ReactNode;
  className?: string;
  active?: boolean;
  /** Render as a button so the filter variant is plain <li>. */
  onSelect?: () => void;
  "data-testid"?: string;
};

/** Technology / skill chip (SRS-FE §4.2). */
export function Chip({
  children,
  className,
  active = false,
  onSelect,
}: ChipProps) {
  const classes = cn(
    "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium",
    "transition-colors",
    active
      ? "border-gold/60 bg-gold/15 text-gold"
      : "border-line text-offwhite/80 hover:border-gold/40 hover:text-offwhite",
    className,
  );

  if (onSelect) {
    return (
      <button
        type="button"
        aria-pressed={active}
        onClick={onSelect}
        className={classes}
      >
        {children}
      </button>
    );
  }
  return <span className={classes}>{children}</span>;
}
