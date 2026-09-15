import Link from "next/link";
import { lang } from "next/root-params";

import { defaultLocale, isLocale, localizedPath } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

/** FR-FE-40: localized 404 with links to Home and Projects. */
export default async function NotFound() {
  const param = await lang();
  const locale = isLocale(param) ? param : defaultLocale;
  const dict = getDictionary(locale);

  return (
    <section className="mx-auto flex max-w-2xl flex-col items-start gap-4 px-4 py-24 sm:px-6">
      <p className="font-mono text-sm text-gold">404</p>
      <h1 className="font-display text-3xl font-bold">{dict.notFound.title}</h1>
      <p className="text-offwhite/85">{dict.notFound.body}</p>
      <div className="flex flex-wrap gap-4">
        <Link
          href={localizedPath("/", locale)}
          className="rounded-md bg-gold px-4 py-2 font-semibold text-charcoal hover:bg-gold-light"
        >
          {dict.notFound.home}
        </Link>
        <Link
          href={localizedPath("/projects", locale)}
          className="rounded-md border border-line px-4 py-2 hover:border-gold"
        >
          {dict.notFound.projects}
        </Link>
      </div>
    </section>
  );
}
