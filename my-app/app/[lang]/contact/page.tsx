import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Clock, Mail, MapPin } from "lucide-react";

import { SocialIcon, socialLabel } from "@/components/brand/social-icon";
import { ContactForm } from "@/components/sections/contact-form";
import { PageHero } from "@/components/ui/page-hero";
import { getProfile } from "@/lib/api";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/contact">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = getDictionary(lang);
  return {
    title: dict.pages.contact.metaTitle,
    description: dict.pages.contact.description,
  };
}

export default async function ContactPage({
  params,
}: PageProps<"/[lang]/contact">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = getDictionary(lang);
  const page = dict.pages.contact;
  const profile = await getProfile(lang);
  const socials = profile.social_links.filter(
    (link) => link.platform !== "email",
  );

  const channels = [
    {
      icon: Mail,
      label: page.email,
      value: profile.email,
      href: `mailto:${profile.email}`,
    },
    { icon: MapPin, label: page.location, value: profile.location },
    { icon: Clock, label: page.response, value: page.responseValue },
  ];

  return (
    <>
      <PageHero
        eyebrow={page.eyebrow}
        title={page.title}
        description={page.description}
      />

      <section className="bg-ink-2 py-20">
        <div className="shell grid gap-12 lg:grid-cols-12">
          <div className="flex flex-col gap-8 lg:col-span-5">
            <ul className="flex flex-col gap-4">
              {channels.map(({ icon: Icon, label, value, href }) => (
                <li
                  key={label}
                  className="flex items-center gap-4 rounded-card border border-line bg-surface p-5 shadow-card"
                >
                  <span
                    aria-hidden="true"
                    className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-gold/30 bg-gold/10 text-gold"
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <span className="font-display text-[0.65rem] font-semibold tracking-[0.16em] text-silver/70 uppercase">
                      {label}
                    </span>
                    {href ? (
                      <a
                        href={href}
                        className="truncate font-medium text-offwhite transition-colors hover:text-gold"
                      >
                        {value}
                      </a>
                    ) : (
                      <span className="font-medium text-offwhite">{value}</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-4">
              <h2 className="eyebrow">{page.social}</h2>
              <ul className="flex flex-col gap-2">
                {socials.map((link) => (
                  <li key={link.platform}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="group flex items-center gap-3 rounded-md border border-line-soft px-4 py-3 text-sm text-silver transition-colors hover:border-gold/45 hover:text-offwhite"
                    >
                      <SocialIcon
                        platform={link.platform}
                        className="h-4 w-4 text-silver group-hover:text-gold"
                      />
                      <span className="flex-1">
                        {socialLabel(link.platform)}
                      </span>
                      <span
                        aria-hidden="true"
                        className="text-gold transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
                      >
                        →
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-7">
            <ContactForm to={profile.email} dict={page.form} />
          </div>
        </div>
      </section>
    </>
  );
}
