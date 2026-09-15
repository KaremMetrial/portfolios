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

/** Large gold figure + silver label, animating into view (FR-FE-30, PR-A4). */
export function Stat({
  label,
  value,
  format,
  suffix,
  className,
  ...rest
}: StatProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)} {...rest}>
      <dd className="font-display text-3xl font-bold text-gold sm:text-4xl">
        <CountUp to={value} format={format} label={label} />
        {suffix && <span className="ms-0.5 text-2xl">{suffix}</span>}
      </dd>
      <dt className="text-sm text-silver">{label}</dt>
    </div>
  );
}
