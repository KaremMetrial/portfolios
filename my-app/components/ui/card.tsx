import type { HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  /** Card for a project: adds the gold border sheen on hover. */
  interactive?: boolean;
};

/** Surface card (SRS-FE §4.2). `interactive` shows a gold sheen on hover. */
export function Card({ className, interactive = false, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        "relative rounded-[--radius-card] border border-line bg-surface",
        "p-5 text-offwhite shadow-sm",
        interactive &&
          "transition-colors hover:border-gold/50 group-hover:border-gold/50",
        className,
      )}
      {...rest}
    />
  );
}

/**
 * Gold border sheen used with an `<a>`/`<Link>` wrapper:
 * wraps a Card's top edge in a gradient that appears on hover.
 */
export function CardSheen({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0",
        "bg-gradient-to-r from-transparent via-gold to-transparent",
        "transition-transform duration-500 group-hover:scale-x-100",
        className,
      )}
    />
  );
}
