import { notFound } from "next/navigation";

import { MetrialMark } from "@/components/brand/metrial-mark";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

/** Placeholder home (FE-0). The real sections arrive in FE-3. */
export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <section className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-24 sm:px-6">
      <MetrialMark className="h-16 w-auto" />
      <h1 className="font-display text-4xl font-bold sm:text-6xl">
        {dict.meta.siteName}
      </h1>
      <p className="font-display text-sm font-semibold tracking-[0.2em] text-gold uppercase">
        {dict.home.role}
      </p>
      <p className="max-w-2xl text-lg text-offwhite/85">{dict.home.intro}</p>
    </section>
  );
}
