"use client";

import {
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";

import { cn } from "@/lib/cn";

export type TabItem = {
  value: string;
  label: ReactNode;
  content: ReactNode;
};

type TabsProps = {
  /** Tabs are identified by `value`; labels render the label. */
  items: ReadonlyArray<TabItem>;
  /** Accessible label for the tab list. */
  label: string;
  className?: string;
  /** Controlled active value. */
  value?: string;
  onValueChange?: (value: string) => void;
  defaultActive?: string;
};

/** Accessible Tabs with full arrow-key navigation (WAI-ARIA tabs pattern). */
export function Tabs({
  items,
  label,
  className,
  value: controlledValue,
  onValueChange,
  defaultActive,
}: TabsProps) {
  const [internal, setInternal] = useState(
    defaultActive ?? items[0]?.value ?? "",
  );
  const active = controlledValue ?? internal;
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const groupId = useId();

  function select(value: string) {
    if (onValueChange) onValueChange(value);
    else setInternal(value);
  }

  function focusAt(index: number) {
    const next = (index + items.length) % items.length;
    select(items[next].value);
    tabRefs.current[next]?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const index = items.findIndex((item) => item.value === active);
    if (event.key === "ArrowRight") {
      event.preventDefault();
      focusAt(index + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      focusAt(index - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      focusAt(0);
    } else if (event.key === "End") {
      event.preventDefault();
      focusAt(items.length - 1);
    }
  }

  const activePanel = items.find((item) => item.value === active);

  return (
    <div className={className}>
      <div
        role="tablist"
        aria-label={label}
        className="inline-flex items-center gap-1 border-b border-line"
        onKeyDown={onKeyDown}
      >
        {items.map((item, index) => {
          const selected = item.value === active;
          const tabId = `${groupId}-tab-${item.value}`;
          return (
            <button
              key={item.value}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              id={tabId}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls={`${groupId}-panel-${item.value}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => select(item.value)}
              className={cn(
                "-mb-px inline-flex items-center gap-1.5 border-b-2 px-4 py-2 text-sm font-medium",
                "transition-colors focus:outline-2 focus:outline-offset-1 focus:outline-gold",
                selected
                  ? "border-gold text-gold"
                  : "border-transparent text-silver hover:text-offwhite",
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      {activePanel && (
        <div
          id={`${groupId}-panel-${activePanel.value}`}
          role="tabpanel"
          aria-labelledby={`${groupId}-tab-${activePanel.value}`}
          tabIndex={0}
          className="pt-4"
        >
          {activePanel.content}
        </div>
      )}
    </div>
  );
}
