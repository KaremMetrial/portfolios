import Image from "next/image";
import Link from "next/link";

import { MetrialMark } from "@/components/brand/metrial-mark";
import { Chip } from "@/components/ui/chip";
import { cn } from "@/lib/cn";
import type { ProjectCard as ProjectCardData } from "@/lib/api";

type ProjectCardProps = {
  project: ProjectCardData;
  /** Varies the brand-plate crop so a row of cards is not three identical
   * pictures; ignored when the project has its own cover. */
  plateIndex?: number;
  /** Already localized href to the case study. */
  href: string;
  featuredLabel: string;
  viewLabel: string;
  className?: string;
};

/** Widest available variant of a cover, or null when there is no cover. */
function coverSrc(project: ProjectCardData): string | null {
  if (!project.cover) return null;
  const variants = Object.values(project.cover.variants);
  return variants.at(-1) ?? null;
}

/**
 * Project card (brand comps): visual plate, title with the gold "Featured"
 * flag, tagline, stack chips and the arrow affordance. Projects without a
 * cover fall back to the brand plate rather than an empty box.
 */
/** Fallback plates cut from the brand banner, alternated across a row. */
const plates = [
  { src: "/brand/ridge-peak.webp", className: "object-center" },
  { src: "/brand/ridge.webp", className: "object-center" },
  { src: "/brand/ridge-peak.webp", className: "object-left" },
];

export function ProjectCard({
  project,
  href,
  featuredLabel,
  viewLabel,
  plateIndex = 0,
  className,
}: ProjectCardProps) {
  const src = coverSrc(project);

  return (
    <Link href={href} className={cn("group block h-full", className)}>
      <article className="flex h-full flex-col overflow-hidden rounded-card border border-line bg-surface shadow-card transition duration-300 group-hover:-translate-y-1 group-hover:border-gold/50 group-hover:shadow-lift">
        <div className="relative aspect-16/10 overflow-hidden border-b border-line-soft bg-ink-2">
          {src ? (
            <Image
              src={src}
              alt={project.cover?.alt ?? project.title}
              fill
              sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <>
              {/* Brand banner ridge as the house plate for work without its
                  own cover art. */}
              <Image
                src={plates[plateIndex % plates.length].src}
                alt=""
                fill
                sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
                className={cn(
                  "object-cover opacity-75 transition-transform duration-500 group-hover:scale-105",
                  plates[plateIndex % plates.length].className,
                )}
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[radial-gradient(80%_70%_at_50%_10%,rgba(198,168,106,0.16),transparent_70%)]"
              />
              <MetrialMark className="absolute top-1/2 left-1/2 h-14 w-auto -translate-x-1/2 -translate-y-1/2 opacity-70 drop-shadow-[0_10px_24px_rgba(0,0,0,0.8)] transition-transform duration-500 group-hover:scale-110" />
            </>
          )}

          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-surface to-transparent"
          />

          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 p-4">
            <span className="rounded-full border border-line bg-ink/80 px-3 py-1 font-display text-[0.6rem] font-semibold tracking-[0.18em] text-silver uppercase backdrop-blur-sm">
              {project.domain}
            </span>
            {project.is_featured && (
              <span className="rounded-full bg-gold px-3 py-1 font-display text-[0.6rem] font-semibold tracking-[0.18em] text-charcoal uppercase">
                {featuredLabel}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-3 p-6">
          <h3 className="font-display text-lg font-bold text-offwhite transition-colors group-hover:text-gold">
            {project.title}
          </h3>
          <p className="text-sm leading-relaxed text-silver">
            {project.tagline}
          </p>

          <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
            {project.technologies.slice(0, 4).map((tech) => (
              <Chip key={tech.key}>{tech.name}</Chip>
            ))}
            {project.technologies.length > 4 && (
              <Chip>+{project.technologies.length - 4}</Chip>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-line-soft pt-4">
            <span className="font-display text-xs font-semibold tracking-[0.14em] text-gold uppercase">
              {viewLabel}
            </span>
            <span
              aria-hidden="true"
              className="text-gold transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
            >
              →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
