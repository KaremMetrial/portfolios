# Product Requirements Document (PRD)

| | |
|---|---|
| **Product** | Metrial Portfolio Platform |
| **Document** | PRD v1.0 |
| **Date** | 2026-09-15 |
| **Owner** | Kareem Sabry Elsayed |
| **Status** | Draft for owner review |
| **Traces to** | [BRS](BRS.md) |
| **Detailed by** | [SRS Frontend](SRS-frontend.md) · [SRS Backend](SRS-backend.md) · [SEO Strategy](SEO.md) |

---

## 1. Vision

> **The portfolio is the proof.**
> A fast, bilingual, gold-on-charcoal experience on the front, powered by a production-grade Laravel API
> Kareem built himself. It doesn't just *say* "RESTful APIs, Redis, queues, WebSockets, Docker": it
> lets a visitor watch them work.

**Positioning line:** *Backend Software Engineer. Build · Solve · Scale.*

## 2. Goals and non-goals

### Goals

| ID | Goal | BRS |
|---|---|---|
| G-1 | A recruiter gets role, stack, location, relocation, and CV in **under 30 seconds on a phone**. | BR-01, BR-05, BR-13 |
| G-2 | A tech lead can **inspect real engineering**: architecture, a live API, real-time events, and system health. | BR-02, BR-07, BR-17 |
| G-3 | A founder or client **trusts the track record** and can reach Kareem in their language. | BR-02, BR-06, BR-09 |
| G-4 | Kareem **updates everything from an admin panel**, and it goes live in minutes. | BR-08 |
| G-5 | The experience feels **premium and alive** without costing speed or accessibility. | BR-12, BR-13 |
| G-6 | Searching Google for **"Karem Metrial"** or **"Kareem Sabry backend developer"** returns the portfolio **first**, and the site competes for "Kareem Sabry" alone. | BR-10, BR-18 |

### Non-goals

- Visitor accounts, comments, likes, or social features.
- A generic website builder or theme system.
- Showing proprietary employer code.
- Pixel-perfect support for legacy browsers (see SRS Frontend §11).

## 3. Personas

| Persona | Context | Primary questions | Win condition |
|---|---|---|---|
| **Rana, Technical Recruiter** (Cairo / Riyadh) | Mobile, from a LinkedIn message, about 30 seconds | Right role? Right stack? Where is he? Will he relocate? Where's the CV? | Downloads the CV or forwards the link |
| **Omar, Backend Tech Lead** (Dubai, hiring) | Desktop, curious, skeptical of buzzwords | How does he design systems? Tests? Real-time? Payments? Is the code clean? | Opens a case study plus the live API console, then sends an interview invite |
| **Khalid, Founder** (GCC, non-technical) | Mobile, prefers Arabic | Has he built something like my product? Can I trust him? How do we start? | Submits the contact form in Arabic |

## 4. Key user journeys

1. **Recruiter quick scan:** LinkedIn link → Home hero (role, location, relocation badge) → *Download CV* → optional *Contact*.
2. **Tech-lead deep dive:** Home → *Featured project* → Case study (architecture diagram, key flows, stack) → *Under the Hood* page (live API console, health, real-time demo) → GitHub → Contact.
3. **Client inquiry (Arabic):** Home → switch to العربية (right-to-left) → Projects filtered by domain (delivery, marketplace) → Case study → Contact form in Arabic → confirmation.
4. **Owner update:** Admin login with MFA → edit a project → Save → the public page updates within 5 minutes, no deploy.

## 5. Information architecture

English lives at the root; Arabic mirrors every page under `/ar` (best for SEO, see [SEO.md §4](SEO.md#4-domain-and-url-decisions)).

```text
/                      /ar                      Home
/projects              /ar/projects             Projects index + filters
/projects/[slug]       /ar/projects/[slug]      Case study
/experience            /ar/experience           Experience timeline, skills, education, certificates
/about                 /ar/about                Story, working style, "Open to relocation"
/under-the-hood        /ar/under-the-hood       Live backend showcase (API console, health, real-time, architecture)
/contact               /ar/contact              Contact form + direct channels
/insights              /ar/insights             Articles index          (Should, v1.1)
/insights/[slug]       /ar/insights/[slug]      Article                 (Should, v1.1)
/cv                                             CV download (tracked redirect to the current PDF)
/sitemap.xml  /robots.txt  /llms.txt  /feed.xml
Global: ⌘K command palette · language switch · sticky "Download CV"
Admin (backend): /admin                         Owner-only content management
```

## 6. Features

Priority is MoSCoW. **Surface** says which side builds it: FE = frontend, BE = backend.
**Release** refers to §9.

### A. Home

| ID | Feature | Pri | Surface | Release |
|---|---|---|---|---|
| PR-A1 | **Hero:** name, role ("Backend Software Engineer"), rotating specialties (APIs · Real-time · Payments · Scalable systems), location, "Open to relocation" availability badge, CTAs *View work* / *Download CV* / *Contact*. | Must | FE+BE | 1.0 |
| PR-A2 | **Animated 3D METRIAL mark** that follows the pointer or scroll, rendered from the brand SVG. Static SVG fallback on low-power devices and with reduced motion. | Should | FE | 1.1 |
| PR-A3 | **Live system strip:** a small "console" line showing a real call to the portfolio API (`GET /api/v1/health` → status, latency in ms, `request_id`). Evidence the site runs on his backend. | Must | FE+BE | 1.0 |
| PR-A4 | **Proof stats**, computed from real content only: number of shipped platforms, companies, public apps, and professional experience since Jan 2025. **No invented metrics.** | Must | FE+BE | 1.0 |
| PR-A5 | **Featured projects:** 3–4 cards with domain, stack chips, and a hover preview. | Must | FE+BE | 1.0 |
| PR-A6 | **Experience snapshot** (latest 3 roles) linking to the full timeline. | Must | FE+BE | 1.0 |
| PR-A7 | **Skills constellation:** interactive skill groups (Backend, Data & Performance, Async & Real-Time, Testing, DevOps, Admin & Front-End, AI-Assisted Engineering); hovering a skill highlights the projects that used it. | Should | FE+BE | 1.1 |
| PR-A8 | **Closing CTA** with the tagline "Engineering a Smarter Tomorrow" and contact buttons. | Must | FE | 1.0 |

### B. Projects and case studies

| ID | Feature | Pri | Surface | Release |
|---|---|---|---|---|
| PR-B1 | **Projects index** with filters by domain (Delivery, Marketplace, E-commerce, Field Service, Booking, E-learning), technology, and type; filters are kept in the URL. | Must | FE+BE | 1.0 |
| PR-B2 | **Case-study template:** summary, context and problem, Kareem's role and responsibilities, backend architecture, key flows, tech stack, challenges and solutions, outcome, public links (Play Store), confidentiality note. | Must | FE+BE | 1.0 |
| PR-B3 | **Interactive architecture diagram** per case study (services, queues, real-time channel, third-party APIs), with a highlight on hover. | Should | FE+BE | 1.1 |
| PR-B4 | **Animated flow / state machine** (for example order lifecycle `pending → assigned → picked_up → delivered`, or the auction bidding loop) that plays on scroll. | Should | FE+BE | 1.1 |
| PR-B5 | **Media gallery** (screenshots, videos) with lazy loading, only where permitted. | Should | FE+BE | 1.0 |
| PR-B6 | **Next / previous project** navigation with shared-element view transitions. | Could | FE | 1.1 |
| PR-B7 | Per-project **confidentiality level**: `public`, `summary_only`, `hidden`. Hidden projects never appear in the API. | Must | BE | 1.0 |

### C. Experience and about

| ID | Feature | Pri | Surface | Release |
|---|---|---|---|---|
| PR-C1 | **Experience timeline:** company, role, dates, location, highlights, linked projects; the current role is marked "Present". | Must | FE+BE | 1.0 |
| PR-C2 | **Skills matrix** grouped as on the CV, with optional "used in N projects" computed from project data. | Must | FE+BE | 1.0 |
| PR-C3 | **Education and certificates** (Mansoura University BSc CS; DEPI, CCIC, NTI). | Must | FE+BE | 1.0 |
| PR-C4 | **About:** short story, working principles (including "AI-assisted engineering with independent validation"), relocation openness. | Must | FE+BE | 1.0 |

### D. CV

| ID | Feature | Pri | Surface | Release |
|---|---|---|---|---|
| PR-D1 | **Download CV** from a sticky header button and the `/cv` route, always serving the current file. | Must | FE+BE | 1.0 |
| PR-D2 | Owner uploads a new CV PDF in the admin; the previous versions are kept. | Must | BE | 1.0 |
| PR-D3 | CV downloads are counted (anonymous event). | Should | FE+BE | 1.0 |
| PR-D4 | Separate Arabic CV file if provided. | Could | BE | 1.2 |

### E. Contact

| ID | Feature | Pri | Surface | Release |
|---|---|---|---|---|
| PR-E1 | **Contact form:** name, email, inquiry type (Full-time role, Freelance, Consulting, Other), message; works in both languages. | Must | FE+BE | 1.0 |
| PR-E2 | **Spam protection:** honeypot, rate limit, bot challenge, minimum fill time. | Must | FE+BE | 1.0 |
| PR-E3 | **Owner notification** by email within 2 minutes, plus a real-time admin notification. | Must | BE | 1.0 |
| PR-E4 | **Visitor confirmation** on screen and an optional auto-reply email in the visitor's language. | Should | FE+BE | 1.0 |
| PR-E5 | **Direct channels:** email, LinkedIn, GitHub. The phone number is hidden by default (owner setting). | Must | FE+BE | 1.0 |
| PR-E6 | Owner **inbox in the admin** with statuses `new → read → replied → archived`, marked spam, and notes. | Must | BE | 1.0 |

### F. Under the Hood (live backend showcase)

The differentiator: the portfolio exposes its own backend as a live exhibit.

| ID | Feature | Pri | Surface | Release |
|---|---|---|---|---|
| PR-F1 | **Live API console:** pick a public endpoint (profile, projects, skills, health), send it, and see the real response (status, latency, headers such as `X-Request-Id` and rate-limit headers, JSON envelope) with syntax highlighting. Read-only endpoints only. | Must | FE+BE | 1.1 |
| PR-F2 | **System status panel:** API health (database, cache), queue heartbeat, last content sync, uptime. | Should | FE+BE | 1.1 |
| PR-F3 | **Real-time demo:** live "visitors online now" counter and an activity ticker ("someone in Riyadh opened the *Barq & Dayem* case study", country-level only), over the Socket.IO realtime service. | Should | FE+BE | 1.1 |
| PR-F4 | **Architecture of this site:** interactive diagram of Next.js → Laravel API → MySQL / Redis / queue → outbox → webhooks → revalidation. | Must | FE | 1.1 |
| PR-F5 | **Engineering highlights of the base code:** modular monolith, transactional outbox, idempotency, circuit breaker, maker-checker, test count, each linked to the explanation. | Should | FE+BE | 1.1 |
| PR-F6 | **GitHub activity:** contribution heatmap, recent public repositories, language mix, synced and cached by the backend. | Could | FE+BE | 1.1 |

### G. Global experience

| ID | Feature | Pri | Surface | Release |
|---|---|---|---|---|
| PR-G1 | **English / Arabic** with full right-to-left layout, translated UI and content, and a language switch that keeps the current page. | Should | FE+BE | 1.0 |
| PR-G2 | **METRIAL dark theme** by default (gold `#C6A86A`, charcoal `#111318`, silver `#8B919B`, off-white `#F4F5F7`); a light theme is optional. | Must / Could | FE | 1.0 / 1.2 |
| PR-G3 | **Motion system:** scroll reveals, magnetic buttons, page transitions, reduced-motion fallbacks everywhere. | Must | FE | 1.0 |
| PR-G4 | **⌘K / Ctrl+K command palette:** jump to pages or projects, copy email, download CV, switch language. | Should | FE | 1.1 |
| PR-G5 | **Offline-tolerant content:** if the API is down, show the last cached content silently. | Must | FE | 1.0 |
| PR-G6 | **Terminal mode easter egg** (`/` then `help`) listing commands such as `whoami`, `projects`, `cv`. | Could | FE | 1.2 |

### H. Admin (owner only)

| ID | Feature | Pri | Surface | Release |
|---|---|---|---|---|
| PR-H1 | Secure admin with **MFA**, owner role only, audit log of every change. | Must | BE | 1.0 |
| PR-H2 | CRUD for **profile, experiences, projects (with media, links, sections), skills, education, certificates, testimonials**, with English and Arabic fields side by side. | Must | BE | 1.0 |
| PR-H3 | Ordering (drag-sort), featured flags, publish / draft, confidentiality level. | Must | BE | 1.0 |
| PR-H4 | **Site settings:** availability status and text, relocation flag, phone visibility, social links, SEO defaults, section feature flags. | Must | BE | 1.0 |
| PR-H5 | **Publish triggers revalidation** of the affected public pages automatically. | Must | BE+FE | 1.0 |
| PR-H6 | Dashboard: visits, CV downloads, contact submissions, top case studies (last 7 / 30 days). | Should | BE | 1.1 |

### I. Analytics

| ID | Feature | Pri | Surface | Release |
|---|---|---|---|---|
| PR-I1 | Cookieless, anonymous **page views and events**: `cv_download`, `project_view`, `contact_submit`, `api_console_request`, `language_switch`. | Should | FE+BE | 1.0 |
| PR-I2 | No personal data stored: IP addresses are never persisted, and a daily-salted hash is used only for unique-visitor counts. | Must | BE | 1.0 |
| PR-I3 | Respect the browser's Do Not Track and Global Privacy Control signals. | Should | FE+BE | 1.0 |

### J. SEO: rank first on Google

Goal and keyword strategy: [SEO.md](SEO.md). Every item below is part of v1.0, because SEO is built in, not added later.

| ID | Feature | Pri | Surface | Release |
|---|---|---|---|---|
| PR-J1 | Per-page metadata from [SEO.md §6](SEO.md#6-on-page-templates) templates, self-referencing canonical URLs, `hreflang` en / ar / x-default, XML sitemap with `lastmod` and images, robots. | Must | FE+BE | 1.0 |
| PR-J2 | **Dynamic Open Graph images** in the METRIAL style (per page and per project, both languages). | Must | FE | 1.0 |
| PR-J3 | **Entity structured data** on every page: `Person` (stable `@id`, `alternateName` "Karem Metrial" and Arabic name, `sameAs` LinkedIn / GitHub / Packagist, `alumniOf`, `knowsAbout`), `WebSite`, `ProfilePage`, `CreativeWork`, `BreadcrumbList`, `BlogPosting`. | Must | FE | 1.0 |
| PR-J4 | **SEO-friendly URLs:** English at the root, Arabic under `/ar`, readable slugs, no automatic language redirect (suggestion banner instead). | Must | FE | 1.0 |
| PR-J5 | **Per-page SEO fields in the admin** (title, description, OG image override, noindex) for both languages, with length counters and a Google result preview. | Must | BE | 1.0 |
| PR-J6 | **Automatic 301 redirects** when a slug changes; real 404 / 410 status codes. | Must | FE+BE | 1.0 |
| PR-J7 | **Instant indexing signals:** IndexNow ping (Bing, Yandex) on publish; sitemap `lastmod` updated immediately. | Should | BE | 1.0 |
| PR-J8 | **Internal linking:** related projects, skills, and articles on every case study; breadcrumbs on nested pages. | Must | FE+BE | 1.0 |
| PR-J9 | **Search-safe environments:** previews and staging are `noindex`; only the production domain is indexable. | Must | FE | 1.0 |
| PR-J10 | **AI search readiness:** `llms.txt` and a plain factual About section so AI answers describe Kareem correctly. | Could | FE | 1.0 |
| PR-J11 | **Launch SEO operations:** Search Console + Bing verification, sitemap submission, indexing requests, every profile (LinkedIn, GitHub, Packagist, CV) linking to the site. | Must | Ops | 1.0 |

### K. Insights (articles)

Moved up to v1.1: articles are the main way to rank beyond the name ([SEO.md §7](SEO.md#7-content-plan-long-tail-authority)).

| ID | Feature | Pri | Surface | Release |
|---|---|---|---|---|
| PR-K1 | Articles written in Markdown with code highlighting, reading time, tags, related case studies, and bilingual variants. | Should | FE+BE | 1.1 |
| PR-K2 | RSS feed. | Should | FE | 1.1 |

## 7. Content inventory (seed data from the CV)

This is the initial source of truth for the database seeders. The owner verifies it in the admin before launch.

### 7.1 Profile

| Field | Value |
|---|---|
| Full name | Kareem Sabry Elsayed *(canonical spelling to confirm, see Q-1)* |
| Headline | Backend Software Engineer · PHP Backend Engineer |
| Location | Mansoura, Egypt · Open to relocation |
| Email | karem.metrial@hotmail.com |
| Phone | +20 100 656 7821, **hidden by default** |
| LinkedIn | linkedin.com/in/karem-metrial |
| GitHub | github.com/KaremMetrial |
| Summary | Backend Software Engineer focused on PHP and Laravel: secure RESTful APIs, business-critical backend services, real-time features, payment integrations, data-driven applications, MySQL design and optimization, Redis, queues, automated testing, Docker, CI/CD, production debugging, and AI-assisted engineering with independent validation. |

### 7.2 Experience

| Company | Role | Period | Highlights (short) |
|---|---|---|---|
| Al Alamiya Elhura | Backend Developer | May 2026 – Present | Laravel + NestJS APIs and services; auth; schema design; query optimization; Redis and queues; code and security reviews; PHPUnit/Pest in Docker and CI/CD; AI-assisted analysis with validation |
| Waitbuzz | Back-End Developer | Apr 2025 – May 2026 | Secure REST APIs for web and mobile; real-time Blade dashboards for hotel booking; room and operations admin; database and logic optimization |
| Rmoztec | Back-End Developer | Jan 2025 – Mar 2025 | Laravel/MySQL MVC apps; Moyasar payment gateway on an e-learning platform; FilamentPHP admin dashboards |
| Digital Egypt Pioneers Initiative (DEPI) | Web Development Intern | Apr 2024 – Nov 2024 | PHP features and debugging; SQL and schema optimization; Agile sprints |

> The CV spells the payment gateway "Moyasser"; the provider's official name is **Moyasar**. Confirm before publishing (Q-8).

### 7.3 Projects

| Slug | Title | Domain | Stack | Public links | Default confidentiality |
|---|---|---|---|---|---|
| `field-service-platform` | Maintenance & Field Service Platform | Field Service | Laravel, MySQL | none | `summary_only` |
| `barq-dayem` | Barq & Dayem, Delivery Platforms | Delivery | PHP, Laravel, MySQL, Pusher, FCM | Play: `com.wb.dayemClient`, `com.barq.client` | `public` (after Q-2) |
| `sharwa` | Sharwa, Auction & Marketplace | Marketplace / Auctions | PHP, Laravel, MySQL, REST, WebSockets | Play: `com.wb.sharwa` | `public` (after Q-2) |
| `samoulla` | E-commerce Platform | E-commerce | Laravel, MySQL, Pusher, Bosta API | Play: `com.wb.samoulla` | `public` (after Q-2) |
| `wathiq` | Wathiq, Service Marketplace | Service Marketplace | PHP, Laravel, MySQL, REST, Real-time | Play: `com.wb.wathq` | `public` (after Q-2) |
| `metrial-base-code` | Metrial Base Code, and this portfolio | Platform / Open source | Laravel 12, MySQL, Redis, Socket.IO, Docker, Next.js 16 | GitHub | `public` |
| `metrial-laravel-rbac` | Metrial RBAC: Laravel authorization package | Open source package | PHP, Laravel | Packagist: `metrial/laravel-rbac` | `public` (confirm, Q-13) |

### 7.4 Skills (groups exactly as on the CV)

Backend · Data & Performance · Async & Real-Time · Testing & Quality · DevOps & Tools · Admin & Front-End · AI-Assisted Engineering.

### 7.5 Education and certificates

- BSc Computer Science, Faculty of Computers & Information, Mansoura University (2018–2022).
- PHP Web Development, DEPI.
- Back-End Development (PHP, MySQL, Laravel), CCIC.
- Web Design (HTML, CSS, Bootstrap, JavaScript), NTI.

## 8. Experience and design direction

- **Mood:** premium, engineered, calm confidence. Dark charcoal canvas, restrained gold accents, precise geometry echoing the M mark (the 0.625 diagonal slope as a recurring motif in dividers and section frames).
- **Typography:** wide-tracked uppercase labels, as in the brand sheet; a geometric sans for headings; a highly legible sans for body; monospace for console and code; a matching Arabic typeface.
- **Motion principles:** motion explains, never decorates. Reveals follow reading order; data "flows" along architecture edges; everything finishes in 600 ms or less; **all motion is disabled or simplified with `prefers-reduced-motion`.**
- **"Dynamic" means:** content comes from the live API; real-time presence; live console; animated architecture and flows; interactive skills. Not autoplay video walls.
- **Imagery:** device mockups for public apps; abstract diagrams where a project is confidential.

## 9. Release plan

| Release | Theme | Contents | Exit criteria |
|---|---|---|---|
| **v1.0 MVP launch** | Credible, fast, complete, **indexed** | A1, A3–A6, A8 · B1, B2, B5, B7 · C1–C4 · D1–D3 · E1–E6 · G1–G3, G5 · H1–H5 · I1–I3 · J1–J11 | All Must items accepted; Lighthouse ≥ 95 (SEO = 100); content verified by owner; deployed on the custom domain; Search Console verified and sitemap submitted |
| **v1.1 Showcase + authority** | Prove backend depth live, rank beyond the name | A2, A7 · B3, B4, B6 · F1–F6 · G4 · H6 · K1–K2 | Under the Hood page live; real-time demo stable under load test; first 2 articles published; no regression in performance budgets |
| **v1.2 Polish** | Extras | D4 · G2 light theme · G6 | Owner acceptance |

## 10. Product metrics (events)

| Event | Trigger | Properties |
|---|---|---|
| `page_view` | Route render | path, lang, referrer domain, device class |
| `cv_download` | `/cv` hit | lang, source (header / hero / palette) |
| `project_view` | Case study viewed ≥ 5 s | slug, lang |
| `contact_submit` | Accepted submission | inquiry type, lang |
| `api_console_request` | Console request sent | endpoint, status |
| `language_switch` | Language changed | from, to |
| `palette_action` | Command executed | command id |

Search performance (rank, impressions, clicks, indexing) is measured in **Google Search Console**, not in site analytics. Targets: [SEO.md §10](SEO.md#10-targets).

## 11. Dependencies and open questions

- The backend depends on the Metrial Base Code modules described in [SRS Backend](SRS-backend.md).
- The frontend depends on the public API contract in SRS Backend §5. Until the API exists it uses typed fixtures.
- Open questions: see [README](README.md#open-questions).
