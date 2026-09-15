import { cacheLife } from "next/cache";

import type { Dictionary } from "@/lib/i18n/get-dictionary";

/** Cached so the prerender stays static (Cache Components time rule). */
async function CopyrightNotice({ template }: { template: string }) {
  "use cache";
  cacheLife("days");

  return <p>{template.replace("{year}", String(new Date().getFullYear()))}</p>;
}

export function Footer({ dict }: { dict: Dictionary }) {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-silver sm:px-6">
        <p className="font-display font-semibold tracking-wide text-offwhite">
          {dict.footer.tagline}
        </p>
        <p>{dict.footer.builtWith}</p>
        <CopyrightNotice template={dict.footer.rights} />
      </div>
    </footer>
  );
}
