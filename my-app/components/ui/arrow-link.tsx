import Link from "next/link";

import { cn } from "@/lib/cn";

type ArrowLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  /** Underline the label, as the comps' "View All Projects" links do. */
  underline?: boolean;
};

/**
 * Gold text link with a trailing arrow that slides on hover (brand comps).
 * The arrow mirrors under `dir="rtl"` so Arabic reads the same way.
 */
export function ArrowLink({
  href,
  children,
  className,
  underline = false,
}: ArrowLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-2 font-display text-sm font-semibold",
        "text-gold transition-colors hover:text-gold-light",
        underline && "underline decoration-gold/40 underline-offset-[6px]",
        className,
      )}
    >
      {children}
      <span
        aria-hidden="true"
        className="transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
      >
        →
      </span>
    </Link>
  );
}
