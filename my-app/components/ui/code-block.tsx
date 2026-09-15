"use client";

import { useState } from "react";

import { cn } from "@/lib/cn";

type CodeBlockProps = {
  /** Raw code string (rendered as plain text — no HTML). */
  code: string;
  /** Filename or language label shown in the header. */
  title?: string;
  className?: string;
  copyLabel?: string;
  copiedLabel?: string;
};

/** Plain-text `<pre>` block with a copy button (basic; Shiki in FE-4). */
export function CodeBlock({
  code,
  title,
  className,
  copyLabel = "Copy",
  copiedLabel = "Copied",
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable — ignore */
    }
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-md border border-line bg-[#0d0f13]",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2 border-b border-line/70 px-3 py-1.5">
        {title ? (
          <span className="font-mono text-xs text-silver">{title}</span>
        ) : (
          <span />
        )}
        <button
          type="button"
          onClick={copy}
          className="rounded px-2 py-0.5 font-mono text-xs text-silver transition-colors hover:text-gold focus:outline-2 focus:outline-gold"
        >
          {copied ? copiedLabel : copyLabel}
        </button>
      </div>
      <pre className="overflow-x-auto p-3 font-mono text-xs leading-relaxed text-offwhite/90">
        <code>{code}</code>
      </pre>
    </div>
  );
}
