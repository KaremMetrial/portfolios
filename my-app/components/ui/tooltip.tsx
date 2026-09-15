"use client";

import { useState, type ReactNode } from "react";

import { cn } from "@/lib/cn";

type TooltipProps = {
  label: string;
  children: ReactNode;
  /** Placement relative to the trigger. */
  side?: "top" | "bottom";
  className?: string;
};

/** Hover/focus tooltip (SRS-FE §4.2). Trigger keeps its own label if needed. */
export function Tooltip({
  label,
  children,
  side = "top",
  className,
}: TooltipProps) {
  const [open, setOpen] = useState(false);

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      {open && (
        <span
          role="tooltip"
          className={cn(
            "pointer-events-none absolute left-1/2 z-40 -translate-x-1/2",
            "whitespace-nowrap rounded-md border border-line bg-charcoal px-2 py-1",
            "text-xs text-offwhite shadow-lg",
            side === "top" ? "bottom-full mb-2" : "top-full mt-2",
            className,
          )}
        >
          {label}
        </span>
      )}
    </span>
  );
}
