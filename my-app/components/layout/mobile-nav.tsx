"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

import { MetrialWordmark } from "@/components/brand/metrial-wordmark";

import { NavLink } from "./nav-link";

type MobileNavProps = {
  links: { href: string; label: string }[];
  /** Localized contact href for the gold CTA. */
  ctaHref: string;
  ctaLabel: string;
  openLabel: string;
  closeLabel: string;
};

/**
 * Mobile navigation sheet (FR-FE-70). Closes on Escape and on navigation,
 * and locks background scroll while open.
 */
export function MobileNav({
  links,
  ctaHref,
  ctaLabel,
  openLabel,
  closeLabel,
}: MobileNavProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? closeLabel : openLabel}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-line text-offwhite transition-colors hover:border-gold/50 hover:text-gold"
      >
        {open ? (
          <X className="h-5 w-5" aria-hidden="true" />
        ) : (
          <Menu className="h-5 w-5" aria-hidden="true" />
        )}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex flex-col bg-ink/98 backdrop-blur-xl">
          <div className="flex h-18 items-center justify-between border-b border-line px-5">
            <MetrialWordmark label="Metrial" />
            <button
              type="button"
              aria-label={closeLabel}
              onClick={() => setOpen(false)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-line text-offwhite"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <nav className="flex flex-col gap-1 px-5 py-8">
            {links.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                onNavigate={() => setOpen(false)}
                className="border-b border-line-soft py-4 font-display text-lg font-semibold tracking-wide"
              >
                {link.label}
              </NavLink>
            ))}

            <a
              href={ctaHref}
              onClick={() => setOpen(false)}
              className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-md bg-gold px-6 font-display text-sm font-semibold text-charcoal transition-colors hover:bg-gold-light"
            >
              {ctaLabel}
              <span aria-hidden="true" className="rtl:rotate-180">
                →
              </span>
            </a>
          </nav>
        </div>
      )}
    </div>
  );
}
