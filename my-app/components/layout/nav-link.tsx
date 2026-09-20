"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/cn";
import { unprefixedPath } from "@/lib/i18n/config";

type NavLinkProps = {
  /** Already localized href. */
  href: string;
  children: React.ReactNode;
  className?: string;
  onNavigate?: () => void;
};

/**
 * Header link with the comps' gold underline on the current section.
 * Active = exact match for "/", prefix match for everything else.
 */
export function NavLink({ href, children, className, onNavigate }: NavLinkProps) {
  const pathname = unprefixedPath(usePathname());
  const target = unprefixedPath(href);
  const active =
    target === "/" ? pathname === "/" : pathname.startsWith(target);

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      onClick={onNavigate}
      className={cn(
        "relative py-1 text-sm transition-colors",
        active ? "text-gold" : "text-offwhite/75 hover:text-offwhite",
        className,
      )}
    >
      {children}
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-x-0 -bottom-0.5 h-px origin-center bg-gold transition-transform duration-300",
          active ? "scale-x-100" : "scale-x-0",
        )}
      />
    </Link>
  );
}
