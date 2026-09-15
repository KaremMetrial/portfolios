"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

type CountUpProps = {
  /** Final integer value. */
  to: number;
  className?: string;
  /** Animation duration in seconds (ignored with reduced motion). */
  duration?: number;
  /** Optional formatter (e.g. Intl.NumberFormat for locales). */
  format?: (value: number) => string;
  /** ARIA name for the live value; default "Count". */
  label?: string;
};

/** Counts from 0 to `to` once it scrolls into view (FR-FE-30, PR-A4). */
export function CountUp({
  to,
  className,
  duration = 1.2,
  format = String,
  label = "Count",
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduce = useReducedMotion();
  const [value, setValue] = useState(0);
  const reportedStart = useRef<number | null>(null);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      // Reduced motion: jump straight to the target (async to avoid a
      // synchronous setState within the effect body).
      const id = requestAnimationFrame(() => setValue(to));
      return () => cancelAnimationFrame(id);
    }
    let frame: number;
    const tick = (now: number) => {
      if (reportedStart.current === null) reportedStart.current = now;
      const elapsed = now - reportedStart.current;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(to * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      reportedStart.current = null;
    };
  }, [inView, reduce, to, duration]);

  return (
    <span
      ref={ref}
      className={className}
      role="status"
      aria-live="polite"
      aria-label={`${label}: ${format(to)}`}
    >
      {format(value)}
    </span>
  );
}
