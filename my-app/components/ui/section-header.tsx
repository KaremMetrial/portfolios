import { cn } from "@/lib/cn";

type SectionHeaderProps = {
  /** Small uppercase eyebrow label above the title. */
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "start" | "center";
  /** Right-aligned slot (e.g. a "View all" link) on the title row. */
  action?: React.ReactNode;
  className?: string;
  /** Unique id for anchoring / scroll navigation. */
  id?: string;
};

/**
 * Section heading block: eyebrow + title (+ description), with an optional
 * action pinned to the end of the title row — the pattern the brand comps
 * use for "Featured Work … View All →".
 */
export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "start",
  action,
  className,
  id,
}: SectionHeaderProps) {
  return (
    <header
      id={id}
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}

      <div
        className={cn(
          "flex flex-col gap-4",
          action &&
            align === "start" &&
            "sm:flex-row sm:items-end sm:justify-between sm:gap-8",
        )}
      >
        <h2 className="max-w-2xl text-3xl font-bold text-balance text-offwhite sm:text-4xl">
          {title}
        </h2>
        {action && <div className="shrink-0 pb-1">{action}</div>}
      </div>

      {description && (
        <p
          className={cn(
            "max-w-2xl text-base leading-relaxed text-silver",
            align === "center" && "mx-auto",
          )}
        >
          {description}
        </p>
      )}
    </header>
  );
}
