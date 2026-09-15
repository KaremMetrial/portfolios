import type { Metadata } from "next";
import Link from "next/link";

import { MetrialMark } from "@/components/brand/metrial-mark";
import { fontVariables } from "@/lib/fonts";
import { getDictionary } from "@/lib/i18n/get-dictionary";

import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "404 · Kareem Sabry",
  robots: { index: false },
};

/**
 * Unmatched URLs skip the [lang] layout, so the locale is unknown here:
 * show both languages (FR-FE-40). notFound() inside a page still renders the
 * localized app/[lang]/not-found.tsx.
 */
export default function GlobalNotFound() {
  const en = getDictionary("en");
  const ar = getDictionary("ar");

  return (
    <html lang="en" dir="ltr" className={fontVariables}>
      <body>
        <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center gap-12 px-4 py-24 sm:px-6">
          <Link href="/" aria-label={en.nav.home} className="w-fit">
            <MetrialMark className="h-12 w-auto" />
          </Link>
          <div className="grid gap-12 md:grid-cols-2">
            <section className="flex flex-col items-start gap-4">
              <p className="font-mono text-sm text-gold">404</p>
              <h1 className="font-display text-3xl font-bold">
                {en.notFound.title}
              </h1>
              <p className="text-offwhite/85">{en.notFound.body}</p>
              <Link
                href="/"
                className="rounded-md bg-gold px-4 py-2 font-semibold text-charcoal hover:bg-gold-light"
              >
                {en.notFound.home}
              </Link>
            </section>
            <section
              lang="ar"
              dir="rtl"
              className="flex flex-col items-start gap-4 font-[family-name:var(--font-arabic)]"
            >
              <p className="font-mono text-sm text-gold">404</p>
              <h2 className="text-3xl font-bold">{ar.notFound.title}</h2>
              <p className="text-offwhite/85">{ar.notFound.body}</p>
              <Link
                href="/ar"
                className="rounded-md bg-gold px-4 py-2 font-semibold text-charcoal hover:bg-gold-light"
              >
                {ar.notFound.home}
              </Link>
            </section>
          </div>
        </main>
      </body>
    </html>
  );
}
