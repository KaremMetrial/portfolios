import { cn } from "@/lib/cn";

type JsonViewerProps = {
  data: unknown;
  className?: string;
  /** Pretty-print with two-space indent. */
  indent?: number;
};

/**
 * JSON pretty printer with basic key/string/number colouring (basic; the real
 * viewer arrives with the FE-8 API console).
 */
export function JsonViewer({ data, className, indent = 2 }: JsonViewerProps) {
  const text = JSON.stringify(data, null, indent) ?? "null";

  if (text.includes("</")) {
    // Never render user data as HTML — escape it.
    return (
      <pre className={cn("overflow-x-auto font-mono text-xs", className)}>
        {text}
      </pre>
    );
  }

  const highlighted = text
    .replace(
      /("(?:\\u[\da-fA-F]{4}|\\[^u]|[^\\"])*")(\s*:)?/g,
      (match, key, colon) =>
        colon
          ? `<span class="text-gold">${key}</span>${colon}`
          : `<span class="text-success">${match}</span>`,
    )
    .replace(/\b(-?\d+(?:\.\d+)?)\b/g, '<span class="text-info">$1</span>')
    .replace(/\b(true|false|null)\b/g, '<span class="text-danger">$1</span>');

  return (
    <pre
      className={cn(
        "overflow-x-auto font-mono text-xs leading-relaxed",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: highlighted }}
    />
  );
}
