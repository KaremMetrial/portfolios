import { cn } from "@/lib/cn";

type BadgeProps = {
  children: React.ReactNode;
  className?: string;
  /** Show the colour is a live/available state via a pulsing dot. */
  pulse?: boolean;
  /** Background tone. */
  tone?: "gold" | "neutral" | "success" | "danger";
  "data-testid"?: string;
};

const toneDot: Record<NonNullable<BadgeProps["tone"]>, string> = {
  gold: "bg-gold",
  neutral: "bg-silver",
  success: "bg-success",
  danger: "bg-danger",
};

const toneText: Record<NonNullable<BadgeProps["tone"]>, string> = {
  gold: "text-gold",
  neutral: "text-silver",
  success: "text-success",
  danger: "text-danger",
};

/** Compact status label, e.g. the availability pulse (SRS-FE §4.2). */
export function Badge({
  children,
  className,
  pulse = false,
  tone = "gold",
  ...rest
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-line",
        "px-2.5 py-0.5 text-xs font-semibold tracking-wide",
        toneText[tone],
        className,
      )}
      {...rest}
    >
      <span
        aria-hidden="true"
        className={cn(
          "h-2 w-2 rounded-full",
          toneDot[tone],
          pulse && "animate-pulse",
        )}
      />
      {children}
    </span>
  );
}
