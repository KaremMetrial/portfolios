"use client";

import {
  forwardRef,
  Children,
  cloneElement,
  type ButtonHTMLAttributes,
  type ReactElement,
} from "react";

import { cn } from "@/lib/cn";
import { Magnetic } from "@/components/motion/magnetic";

type ButtonVariant = "primary" | "ghost" | "link";
type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Wrap the interactive element in the magnetic hover effect. */
  magnetic?: boolean;
  /** Render the child (e.g. next/link) with button styles instead of <button>. */
  asChild?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-gold text-charcoal hover:bg-gold-light active:bg-gold-dark disabled:bg-gold/60",
  ghost:
    "border border-line text-offwhite hover:bg-surface active:bg-surface/70",
  link: "text-gold underline-offset-4 hover:underline",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

function baseClasses(
  variant: ButtonVariant,
  size: ButtonSize,
  className?: string,
) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-md font-semibold",
    "transition-colors disabled:pointer-events-none disabled:opacity-60",
    "text-center select-none focus-visible:outline-2 focus-visible:outline-gold",
    variant === "link" ? "p-0" : sizeClasses[size],
    variantClasses[variant],
    className,
  );
}

/**
 * Button (SRS-FE §4.2): primary gold / ghost / link, optional magnetic hover.
 * Pass `asChild` to apply styles to a single child (e.g. <Link>).
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      size = "md",
      magnetic,
      asChild,
      className,
      children,
      ...rest
    },
    ref,
  ) {
    const classes = baseClasses(variant, size, className);
    const element = asChild ? (
      cloneElement(
        Children.only(children) as ReactElement<{
          className?: string;
        }>,
        {
          className: cn(
            classes,
            (children as { props?: { className?: string } }).props?.className,
          ),
        },
      )
    ) : (
      <button ref={ref} className={classes} {...rest}>
        {children}
      </button>
    );

    if (magnetic) return <Magnetic className="inline-flex">{element}</Magnetic>;
    return element;
  },
);
