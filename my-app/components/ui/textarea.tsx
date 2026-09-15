import { forwardRef, type TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

/** Multi-line field (SRS-FE §4.2). */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ className, invalid = false, ...rest }, ref) {
    return (
      <textarea
        ref={ref}
        aria-invalid={invalid || undefined}
        className={cn(
          "w-full rounded-md border bg-surface p-3 text-sm text-offwhite",
          "placeholder:text-silver/70 focus:outline-2 focus:outline-offset-1",
          invalid
            ? "border-danger/70 focus:outline-danger"
            : "border-line focus:outline-gold",
          className,
        )}
        {...rest}
      />
    );
  },
);
