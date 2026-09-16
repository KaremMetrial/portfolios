import type { Profile } from "../schemas";

export const profileFixture: Profile = {
  name: "Kareem Sabry Elsayed",
  headline: "Backend Software Engineer · PHP Backend Engineer",
  summary:
    "Backend Software Engineer focused on PHP and Laravel: secure RESTful APIs, business-critical backend services, real-time features, payment integrations, data-driven applications, MySQL design and optimization, Redis, queues, automated testing, Docker, CI/CD, production debugging, and AI-assisted engineering with independent validation.",
  about:
    "I build backend systems that hold up under real traffic. From payment integrations and ledger systems to real-time delivery tracking and auction platforms, I focus on writing code that is secure, testable, and maintainable. I believe in AI-assisted engineering with independent validation — leveraging modern tools while maintaining rigorous quality standards.",
  location: "Mansoura, Egypt",
  availability: "open_to_relocation",
  availability_text: "Open to new opportunities",
  open_to_relocation: true,
  email: "karem.metrial@hotmail.com",
  phone_visible: false,
  social_links: [
    {
      platform: "linkedin",
      url: "https://linkedin.com/in/karem-metrial",
      sort: 1,
    },
    { platform: "github", url: "https://github.com/KaremMetrial", sort: 2 },
    { platform: "email", url: "mailto:karem.metrial@hotmail.com", sort: 3 },
  ],
  stats: {
    shipped_platforms: 7,
    companies: 4,
    public_apps: 5,
    experience_since: "2024-04",
  },
};
