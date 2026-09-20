import { cn } from "@/lib/cn";
import { CountUp } from "@/components/motion/count-up";

type StatProps = {
  label: string;
  value: number;
  format?: (value: number) => string;
  suffix?: string;
  className?: string;
  "data-testid"?: string;
};

/**
 * Display figure + silver label, animating into view (FR-FE-30, PR-A4).
 * Emits `<dt>` before `<dd>` for a valid description list and flips the
 * visual order so the figure still reads first, as in the brand comps.
 */
export function Stat({
  label,
  value,
  format,
  suffix,
  className,
  ...rest
}: StatProps) {
  return (
    <div
      className={cn("flex flex-col-reverse gap-1", className)}
      {...rest}
    >
      <dt className="font-display text-xs font-medium tracking-[0.12em] text-silver uppercase">
        {label}
      </dt>
      <dd className="font-display text-3xl font-bold text-offwhite sm:text-4xl">
        <CountUp to={value} format={format} label={label} />
        {suffix && <span className="ms-0.5 text-2xl text-gold">{suffix}</span>}
      </dd>
    </div>
  );
}
