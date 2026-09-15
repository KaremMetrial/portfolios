"use client";

import { useId, useRef, type KeyboardEvent, type ReactNode } from "react";

import { cn } from "@/lib/cn";

type Option<T extends string> = {
  value: T;
  label: ReactNode;
  /** Optional icon/element rendered before the label. */
  icon?: ReactNode;
};

type SegmentedControlProps<T extends string> = {
  options: ReadonlyArray<Option<T>>;
  value: T;
  onChange: (value: T) => void;
  /** Accessible label for the group. */
  label: string;
  className?: string;
  name?: string;
};

/** Single-choice segmented control with full keyboard arrow support. */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  label,
  className,
  name,
}: SegmentedControlProps<T>) {
  const groupId = useId();
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});

  function activate(next: T) {
    onChange(next);
    refs.current[next]?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>, current: T) {
    const index = options.findIndex((o) => o.value === current);
    if (event.key === "ArrowRight") {
      event.preventDefault();
      activate(options[(index + 1) % options.length].value);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      activate(options[(index - 1 + options.length) % options.length].value);
    } else if (event.key === "Home") {
      event.preventDefault();
      activate(options[0].value);
    } else if (event.key === "End") {
      event.preventDefault();
      activate(options[options.length - 1].value);
    }
  }

  return (
    <div
      id={groupId}
      role="radiogroup"
      aria-label={label}
      className={cn(
        "inline-flex items-center gap-1 rounded-lg border border-line bg-surface p-1",
        className,
      )}
      onKeyDown={(event) => onKeyDown(event, value)}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            ref={(node) => {
              refs.current[option.value] = node;
            }}
            type="button"
            role="radio"
            name={name}
            value={option.value}
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(option.value)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium",
              "transition-colors focus:outline-2 focus:outline-offset-1 focus:outline-gold",
              selected
                ? "bg-gold text-charcoal"
                : "text-offwhite/80 hover:bg-surface-strong hover:text-offwhite",
            )}
          >
            {option.icon}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
