import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { LanguageBanner } from "@/components/layout/language-banner";
import { SkipLink } from "@/components/layout/skip-link";
import { getProfile } from "@/lib/api";
import { env } from "@/lib/env";
import { fontVariables } from "@/lib/fonts";
import { dir, isLocale, locales, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

import "@/styles/globals.css";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

/** Baseline metadata; per-page SEO (canonical, hreflang, JSON-LD) is FE-6. */
export async function generateMetadata({
  params,
}: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = getDictionary(lang);

  return {
    metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
    title: { default: dict.meta.title, template: `%s · ${dict.meta.siteName}` },
    description: dict.meta.description,
  };
}

export default async function LangLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const other: Locale = lang === "ar" ? "en" : "ar";
  const dict = getDictionary(lang);
  const otherDict = getDictionary(other);
  const profile = await getProfile(lang);

  return (
    <html lang={lang} dir={dir(lang)} className={fontVariables}>
      <body>
        <SkipLink label={dict.header.skipToContent} />
        <LanguageBanner
          lang={lang}
          question={otherDict.language.suggest.question}
          action={otherDict.language.suggest.action}
          dismiss={otherDict.language.suggest.dismiss}
        />
        <Header lang={lang} dict={dict} otherDict={otherDict} />
        <main id="content" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
        <Footer
          dict={dict}
          lang={lang}
          location={profile.location}
          email={profile.email}
          socialLinks={profile.social_links}
        />
      </body>
    </html>
  );
}
