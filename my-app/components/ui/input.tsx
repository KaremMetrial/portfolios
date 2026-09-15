import { forwardRef, type InputHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Error state: gold ring bumped to danger for clear signalling. */
  invalid?: boolean;
}

/** Text / email / … field (SRS-FE §4.2). */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, invalid = false, ...rest },
  ref,
) {
  return (
    <input
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(
        "h-11 w-full rounded-md border bg-surface px-3 text-sm text-offwhite",
        "placeholder:text-silver/70 focus:outline-2 focus:outline-offset-1",
        invalid
          ? "border-danger/70 focus:outline-danger"
          : "border-line focus:outline-gold",
        "aria-[invalid=true]:border-danger aria-[invalid=true]:focus:outline-danger",
        className,
      )}
      {...rest}
    />
  );
});
