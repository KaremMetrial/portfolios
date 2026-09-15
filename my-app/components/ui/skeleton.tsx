import { cn } from "@/lib/cn";

type SkeletonProps = {
  className?: string;
  /** Accessible label while loading. */
  label?: string;
  "data-testid"?: string;
};

/** Shimmer placeholder while content streams in (SRS-FE §4.2). */
export function Skeleton({
  className,
  label = "Loading",
  ...rest
}: SkeletonProps) {
  return (
    <div
      role="status"
      aria-label={label}
      className={cn("animate-pulse rounded-md bg-line/60", className)}
      {...rest}
    />
  );
}
