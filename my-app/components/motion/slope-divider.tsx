import { cn } from "@/lib/cn";

type SlopeDividerProps = {
  className?: string;
};

/**
 * Short gold accent bar with a slanted end matching the M-mark diagonal
 * (`--slope`, SRS-FE §4.1). Used under section eyebrows.
 */
export function SlopeDivider({ className }: SlopeDividerProps) {
  return (
    <span
      aria-hidden="true"
      className={cn("block h-1 w-16 bg-gold", className)}
      style={{
        clipPath:
          "polygon(0 0, calc(100% - (var(--slope) * 100%)) 0, 100% 100%, 0 100%)",
      }}
    />
  );
}
