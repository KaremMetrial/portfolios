import { cn } from "@/lib/cn";
import { SlopeDivider } from "@/components/motion/slope-divider";

type SectionHeaderProps = {
  /** Small uppercase eyebrow label above the title. */
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "start" | "center";
  className?: string;
  /** Unique id for anchoring / scroll navigation. */
  id?: string;
};

/** Section heading block: eyebrow + slope divider + title (+ description). */
export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "start",
  className,
  id,
}: SectionHeaderProps) {
  return (
    <header
      id={id}
      className={cn(
        "flex flex-col gap-3",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {eyebrow && (
        <p className="font-display text-xs font-semibold tracking-[0.25em] text-gold uppercase">
          {eyebrow}
        </p>
      )}
      <SlopeDivider />
      <h2 className="font-display text-2xl font-bold text-offwhite sm:text-3xl">
        {title}
      </h2>
      {description && (
        <p className="max-w-2xl text-base text-silver">{description}</p>
      )}
    </header>
  );
}
