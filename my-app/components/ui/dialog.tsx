"use client";

import { useEffect, useRef, type KeyboardEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/cn";

type DialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Accessible title, read by screen readers. */
  title: string;
  children: ReactNode;
  variant?: "dialog" | "sheet";
  /** Which edge a sheet slides from (RTL-aware when "start"/"end"). */
  side?: "start" | "end" | "bottom";
  className?: string;
  /** Optional close label for the built-in button. */
  closeLabel?: string;
};

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Accessible modal dialog / side sheet (SRS-FE §4.2):
 * focus trap, Escape to close, overlay click to close, scroll lock.
 */
export function Dialog({
  open,
  onOpenChange,
  title,
  children,
  variant = "dialog",
  side = "end",
  className,
  closeLabel = "Close",
}: DialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  // Scroll lock + focus setup on open.
  useEffect(() => {
    if (!open) return;
    previousFocus.current = document.activeElement as HTMLElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const frame = requestAnimationFrame(() => {
      const panel = panelRef.current;
      if (!panel) return;
      const focusable = panel.querySelector<HTMLElement>(FOCUSABLE);
      (focusable ?? panel).focus();
    });
    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = prevOverflow;
      previousFocus.current?.focus();
    };
  }, [open]);

  function onDialogKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      onOpenChange(false);
      return;
    }
    const panel = panelRef.current;
    if (!panel || event.key !== "Tab") return;
    const focusables = Array.from(
      panel.querySelectorAll<HTMLElement>(FOCUSABLE),
    );
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  if (!open) return null;

  const sheetSide =
    side === "start"
      ? "inset-inline-start-0 inset-y-0 h-full w-full max-w-sm border-inline-end"
      : side === "end"
        ? "inset-inline-end-0 inset-y-0 h-full w-full max-w-sm border-inline-start"
        : "inset-x-0 bottom-0 w-full border-t";

  const panelClass =
    variant === "sheet"
      ? cn(
          "fixed bg-charcoal text-offwhite",
          sheetSide,
          "p-5 shadow-2xl",
          className,
        )
      : cn(
          "fixed left-1/2 top-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2",
          "rounded-[--radius-card] border border-line bg-charcoal p-5 text-offwhite shadow-2xl",
          className,
        );

  return createPortal(
    <div className="fixed inset-0 z-50 flex">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={() => onOpenChange(false)}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        onKeyDown={onDialogKeyDown}
        className={panelClass}
      >
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2
            id="dialog-title"
            className="font-display text-lg font-semibold text-offwhite"
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label={closeLabel}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-line text-silver transition-colors hover:text-offwhite focus:outline-2 focus:outline-gold"
          >
            ✕
          </button>
        </div>
        <div className="text-sm text-offwhite/90">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
