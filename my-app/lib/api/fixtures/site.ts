import type { Site } from "../schemas";

export const siteFixture: Site = {
  availability: "open_to_relocation",
  availability_text: "Open to new opportunities",
  open_to_relocation: true,
  social_links: [
    {
      platform: "linkedin",
      url: "https://linkedin.com/in/karem-metrial",
      sort: 1,
    },
    { platform: "github", url: "https://github.com/KaremMetrial", sort: 2 },
    {
      platform: "email",
      url: "mailto:karem.metrial@hotmail.com",
      sort: 3,
    },
  ],
  contact_channels: [
    { type: "email", value: "karem.metrial@hotmail.com", visible: true },
    { type: "linkedin", value: "https://linkedin.com/in/karem-metrial", visible: true },
    { type: "github", value: "https://github.com/KaremMetrial", visible: true },
  ],
  feature_flags: {
    showcase_console: false,
    showcase_presence: false,
    showcase_github: false,
    home_skills_constellation: false,
    insights: false,
  },
  seo_defaults: {},
  supported_locales: ["en", "ar"],
  cv_updated_at: "2026-09-15T00:00:00Z",
};
