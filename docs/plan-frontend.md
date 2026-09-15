# Implementation Plan: Frontend

|                            |                                      |
| -------------------------- | ------------------------------------ |
| **Scope**            | `my-app/` (Next.js 16.3 portfolio) |
| **Implements**       | [SRS Frontend](SRS-frontend.md)       |
| **Coordinates with** | [Plan Backend](plan-backend.md)       |
| **Date**             | 2026-09-15                           |

---

## 1. Approach

- **Read the bundled Next.js docs before each feature** (`node_modules/next/dist/docs/`). This version
  changes caching (`cacheComponents`, `'use cache'`), middleware (`proxy.ts`), and revalidation signatures.
- **Fixtures first, live API second.** Build every page against typed fixtures (`API_MODE=fixtures`) so work
  is never blocked by the backend. Switch to live data at M1.
- **Static, fast, accessible core; dynamic islands on top.** v1.0 is server-rendered content with tasteful
  motion. The "wow" islands (3D, console, presence, diagrams) arrive in v1.1 behind feature flags and budgets.
- **Every phase ends green:** lint, typecheck, unit tests, Playwright e2e, axe, and Lighthouse budgets.

Effort is in **focused developer days** (about 6 productive hours).

## 2. Phase overview

| Phase | Name                                                                      | Effort                      | Release | Depends on                                                |
| ----- | ------------------------------------------------------------------------- | --------------------------- | ------- | --------------------------------------------------------- |
| FE-0  | Foundation: tooling, i18n routing, layout shell                           | 3 d                         | 1.0     | –                                                        |
| FE-1  | Design system + motion primitives                                         | 4 d                         | 1.0     | FE-0                                                      |
| FE-2  | Data layer, fixtures, snapshot, revalidation →**M1**               | 3 d                         | 1.0     | FE-0, BE-2 fixtures (or hand-written fixtures until then) |
| FE-3  | Home page                                                                 | 4 d                         | 1.0     | FE-1, FE-2                                                |
| FE-4  | Projects index + case study                                               | 4 d                         | 1.0     | FE-1, FE-2                                                |
| FE-5  | Experience, About, CV, Contact                                            | 4 d                         | 1.0     | FE-1, FE-2, BE-4 (for live contact)                       |
| FE-6  | **Technical SEO**, analytics, accessibility, performance, Arabic QA | 5 d                         | 1.0     | FE-3–FE-5, BE-5                                          |
| FE-7  | Production launch +**search engine launch** → **M3 v1.0**    | 3 d                         | 1.0     | FE-6, BE-6                                                |
| FE-8  | Dynamic showcase (3D, console, presence, diagrams, palette, transitions)  | 8 d                         | 1.1     | FE-7, BE-7                                                |
| FE-9  | Insights (articles) + RSS, the long-tail SEO lever                        | 3 d                         | 1.1     | FE-7, BE-9                                                |
| FE-10 | Light theme, terminal mode                                                | 2 d                         | 1.2     | FE-8                                                      |
|       | **Total**                                                           | **43 d** (v1.0: 30 d) |         |                                                           |

## 3. Phases in detail

### FE-0 · Foundation (3 d)

- [ ] Read docs: `02-guides/internationalization.md`, `03-file-conventions/proxy.md`, `01-directives/use-cache.md`, `02-guides/content-security-policy.md`.
- [ ] Install and pin: `motion`, `zod`, `cmdk`, `server-only`, `clsx`, `tailwind-merge`, icon set, `@formatjs/intl-localematcher`, `negotiator`; dev: `vitest`, `@testing-library/react`, `@playwright/test`, `@axe-core/playwright`, `prettier`, `@lhci/cli`.
- [ ] `next.config.ts`: `cacheComponents: true`, image remote patterns for the API media origin.
- [ ] Move the app under `app/[lang]` (layout, page, not-found); keep `favicon.ico`, `icon.svg`, and `apple-icon.png` at `app/` root (FR-FE-01).
- [ ] `proxy.ts`: rewrite unprefixed paths to `en`, 308 `/en/*` → unprefixed, **no language auto-redirect** (FR-FE-02); `X-Robots-Tag: noindex` outside production (FR-FE-96); security headers (NFR-FE-S2); a CSP stub.
- [ ] `lib/i18n`: config, server-only `getDictionary`, `en.json` / `ar.json` skeletons (FR-FE-04).
- [ ] Root layout: `lang` + `dir`, fonts via `next/font` (Montserrat, Inter, JetBrains Mono, IBM Plex Sans Arabic), skip link, header and footer shells, language switch (FR-FE-03, FR-FE-05).
- [ ] `lib/env.ts` with Zod-validated env vars (SRS-FE §6).
- [ ] CI: lint, `tsc --noEmit`, Vitest, Playwright smoke, build.
- [ ] Remove the create-next-app leftovers (`public/*.svg`, default page content).

**Done when:** `/` serves English with status 200 (no redirect); `/en` 308-redirects to `/`; `/ar` renders RTL; an Arabic-preferring browser sees the language banner; CI is green.

### FE-1 · Design system + motion (4 d)

- [ ] `styles/tokens.css` with `@theme` tokens from SRS-FE §4.1; verify contrast pairs and record the results in the file header.
- [ ] Global styles: charcoal canvas, selection color, focus ring, reduced-motion media query resets.
- [ ] Brand assets: inline SVG components `<MetrialMark>` and `<MetrialWordmark>` from `images/metrial-mark*.svg`.
- [ ] UI components (SRS-FE §4.2): Button, Badge (availability pulse), Chip, Card, SectionHeader, Stat, Tabs, Dialog/Sheet, Tooltip, Input, Textarea, SegmentedControl, Toast, Skeleton, CodeBlock, JsonViewer (basic).
- [ ] Motion primitives: `Reveal`, `Stagger`, `CountUp`, `MagneticButton`, `SlopeDivider`, all using `useReducedMotion()` (FR-FE-73).
- [ ] Dev showcase route `/[lang]/dev/ui`, excluded from production builds.
- [ ] Component tests for keyboard and RTL behavior of Dialog, Tabs, and SegmentedControl.

**Done when:** every component renders correctly in en and ar, dark theme, with and without reduced motion; the axe check passes on `/dev/ui`.

### FE-2 · Data layer, fixtures, snapshot, revalidation (3 d) → M1

- [ ] `lib/api/schemas.ts`: Zod schemas for the envelope and every resource in SRS-BE §5 (FR-FE-11).
- [ ] `lib/api/tags.ts`: tag constants matching FR-BE-51.
- [ ] `lib/api/client.ts`: server-only fetch with timeout, `?lang=`, schema parse, `'use cache'` + `cacheTag` + `cacheLife` (FR-FE-12); fixtures mode (FR-FE-15); snapshot fallback (FR-FE-13).
- [ ] Fixtures: hand-write from PRD §7 now; replace with BE-2 exported fixtures at M1.
- [ ] `scripts/snapshot.ts` + `npm run snapshot` (FR-FE-14).
- [ ] `app/api/revalidate/route.ts`: HMAC verify, timestamp window, dedupe, `revalidateTag(tag, 'max')` (FR-FE-20, FR-FE-21), tested with the backend's shared signature test vector.
- [ ] Contract test: all fixtures and snapshot files validate against the schemas; CI fails on drift.

**Done when (M1):** the schemas validate the backend's exported fixtures; the revalidate route passes the shared test vector; pages can switch between fixtures and live with one env var.

### FE-3 · Home page (4 d)

- [ ] Hero with static SVG mark (3D comes in FE-8), H1, rotating specialties, availability badge, three CTAs (FR-FE-31).
- [ ] Live strip island with browser `health` call, latency, and request id (FR-FE-32).
- [ ] Proof stats with `CountUp` (FR-FE-30, PR-A4).
- [ ] Featured projects cards with hover sheen.
- [ ] Experience snapshot (latest 3).
- [ ] Skills grouped list (the constellation comes in FE-8).
- [ ] Closing CTA with tagline.
- [ ] e2e: hero content visible without scroll at 375×667 in en and ar; CV link points to `/cv`.

**Done when:** Home meets PRD A1, A3–A6, A8; Lighthouse mobile ≥ 95 locally with fixtures.

### FE-4 · Projects index + case study (4 d)

- [ ] Index with server-rendered URL filters (domain, skill) and empty state (FR-FE-33).
- [ ] `generateStaticParams` for public slugs; case-study layout with sticky section nav on desktop.
- [ ] Server-side Markdown pipeline (`react-markdown` + `rehype-sanitize` + Shiki) (FR-FE-34, NFR-FE-S4).
- [ ] Media gallery with `next/image` and an accessible lightbox; store badges; tech list; prev/next.
- [ ] `summary_only` layout variant and confidentiality note (PR-B7).
- [ ] Static architecture fallback (list or simple SVG) until React Flow in FE-8.
- [ ] e2e: filters update URL and results; unknown slug returns 404; a summary-only project shows no sections.

### FE-5 · Experience, About, CV, Contact (4 d)

- [ ] Experience page: timeline, Present badge, highlights, project chips, skills matrix, education and certificates (FR-FE-35).
- [ ] About page (FR-FE-36).
- [ ] `/cv` route handler → backend `/cv` with `lang` and `source` (FR-FE-39).
- [ ] Contact page: form with shared Zod schema, honeypot, elapsed time, challenge widget, Server Action with `useActionState`, error mapping, confirmation panel with focus management (FR-FE-50–52).
- [ ] Direct channels from `site.contact_channels` (FR-FE-37).
- [ ] e2e: successful submission (mocked API), 422 field errors, 429 message, no-JS submission path.

### FE-6 · Technical SEO, analytics, accessibility, performance, Arabic QA (5 d)

**Technical SEO** (goal: first Google result for name, brand, and role, see [SEO.md](SEO.md)):

- [ ] Read `01-metadata/*` and `04-functions/generate-metadata.md` in the bundled Next.js docs.
- [ ] `lib/seo.ts`: title and description builders from API `seo` fields with [SEO.md §6](SEO.md#6-on-page-templates) fallbacks; canonical and `hreflang` (en unprefixed, `/ar`, x-default) helpers.
- [ ] `generateMetadata` on every page; filtered URLs canonicalize to the unfiltered page (FR-FE-90).
- [ ] `opengraph-image.tsx` for Home, projects, and articles in both locales with an Arabic font; admin override support (FR-FE-91).
- [ ] `sitemap.ts` with `lastmod`, hreflang alternates, and images; `robots.ts` (FR-FE-92).
- [ ] JSON-LD graph: `Person` (`@id`, `alternateName`, `sameAs` from `/site`), `WebSite`, `ProfilePage`, `CreativeWork`, `BreadcrumbList`; safe serialization; schema unit tests (FR-FE-93).
- [ ] 301 redirects from API `/redirects`; real 404s (FR-FE-95).
- [ ] Visible breadcrumbs and related projects on case studies (FR-FE-97).
- [ ] `/llms.txt` route (FR-FE-98) and the IndexNow key file route `/{INDEXNOW_KEY}.txt` (FR-BE-85).
- [ ] e2e: every route fetched **with JavaScript disabled** contains its H1 and key text (FR-FE-94); `/en/*` returns 308; unknown slug returns 404; non-production responses carry `noindex` (FR-FE-96).
- [ ] Lighthouse SEO = 100 on all audited routes.

**Other quality work:**

- [ ] `lib/analytics.ts` beacon queue, DNT/GPC handling, and `page_view`, `cv_download`, `project_view`, `contact_submit`, `language_switch` events (FR-FE-80–82).
- [ ] Full CSP with nonce via `proxy.ts` (NFR-FE-S1); verify no violations across routes.
- [ ] Playwright + axe across all routes, en and ar, desktop and mobile (NFR-FE-A6).
- [ ] Lighthouse CI with budgets from SRS-FE §5.1; fix regressions.
- [ ] Arabic QA pass: RTL mirroring, typography, line height, number and date formats, truncation.
- [ ] Backend-down e2e test: API mocked to fail, so all pages render from the snapshot (NFR-FE-R1).

**Done when:** all quality gates in SRS-FE §5.6 pass.

### FE-7 · Production launch + search engine launch (3 d) → M3

- [ ] Hosting decision (Q-4): Vercel project or Docker `next start` behind the VPS reverse proxy.
- [ ] Domain + TLS; production env vars; `REVALIDATE_SECRET` shared with the backend webhook registration.
- [ ] Run the snapshot against production API; build; deploy.
- [ ] Smoke test on production: locales, CV download, contact end to end (real email), admin edit → page updates ≤ 5 min.
- [ ] Share-preview check (LinkedIn Post Inspector, WhatsApp) for Home and one case study.
- [ ] Owner content sign-off (PRD §7 verified, Arabic copy approved).
- [ ] **Search launch** ([SEO.md §9](SEO.md#9-launch-and-ongoing-operations)):
  - [ ] Google Search Console domain property verified (with BE-6 DNS); submit `sitemap.xml`.
  - [ ] URL Inspection → *Request indexing* for Home, About, Projects, Experience, and each case study (en and ar).
  - [ ] Bing Webmaster Tools verified; sitemap submitted; IndexNow key confirmed.
  - [ ] Rich Results Test passes for Home (Person), About (ProfilePage), and a case study (Breadcrumb).
  - [ ] PageSpeed Insights mobile "Good" Core Web Vitals on Home and a case study.
  - [ ] Owner updates every profile the same day: LinkedIn website + Featured, GitHub profile + README, Packagist homepage, CV PDF with the site URL.
- [ ] Set a monthly calendar reminder for the SEO review checklist (SEO.md §9).

**Done when:** PRD v1.0 exit criteria are met and Search Console shows the sitemap as processed.

### FE-8 · Dynamic showcase (8 d) · v1.1

| Item                                                                                                     | Effort | Requirement  |
| -------------------------------------------------------------------------------------------------------- | ------ | ------------ |
| Hero 3D METRIAL mark (R3F, extruded from SVG polygons, pointer tilt, capability gating, offscreen pause) | 1.5 d  | FR-FE-72     |
| API console (allowlist, params, timing, headers, JSON viewer, curl copy, 429 countdown)                  | 1.5 d  | FR-FE-60, 61 |
| Status panel with visibility-aware polling                                                               | 0.5 d  | FR-FE-62     |
| Presence counter + activity ticker (lazy socket.io)                                                      | 1 d    | FR-FE-63     |
| Architecture diagrams (React Flow) for case studies and "this site" + accessible fallback                | 1.5 d  | FR-FE-64     |
| Flow / state machine animation                                                                           | 0.5 d  | FR-FE-65     |
| Skills constellation (hover skill → highlight projects)                                                 | 0.5 d  | PR-A7        |
| GitHub heatmap                                                                                           | 0.5 d  | FR-FE-66     |
| Command palette (⌘K)                                                                                    | 0.5 d  | FR-FE-71     |
| View transitions: route crossfade + card → hero morph (read`02-guides/view-transitions.md`)           | 0.5 d  | FR-FE-74     |

- [ ] Each island is lazy, feature-flagged (`site.flags`), fails closed, and has a reduced-motion or text fallback.
- [ ] Re-run budgets: Home initial JS still ≤ 170 KB; 3D chunk ≤ 250 KB and loads after LCP.

**Done when:** PRD v1.1 exit criteria are met, with no regression in Lighthouse scores.

### FE-9 · Insights (articles) + RSS (3 d) · v1.1

- [ ] Insights index and article pages, tag filter, reading time, code highlighting, related case study links (PR-K1, FR-FE-97).
- [ ] `BlogPosting` JSON-LD with `author` → person `@id`; OG image per article; sitemap entries (FR-FE-91–93).
- [ ] `/feed.xml` per locale (FR-FE-99).
- [ ] Publish the first two articles from [SEO.md §7](SEO.md#7-content-plan-long-tail-authority); request indexing in Search Console.

### FE-10 · Light theme, terminal mode (2 d) · v1.2

- [ ] Light theme tokens + toggle (PR-G2), contrast verified.
- [ ] Terminal mode overlay (FR-FE-75).

## 4. Page-to-requirement map

Public URLs: English unprefixed, Arabic under `/ar` (internally `app/[lang]`).

| Route (en · ar)                                                | Key requirements                 | Release   |
| --------------------------------------------------------------- | -------------------------------- | --------- |
| `/` · `/ar`                                                | FR-FE-30–32, 72, 73, 90–93     | 1.0 / 1.1 |
| `/projects` · `/ar/projects`                               | FR-FE-33, 90                     | 1.0       |
| `/projects/[slug]` · `/ar/projects/[slug]`                 | FR-FE-34, 64, 65, 74, 91, 95, 97 | 1.0 / 1.1 |
| `/experience` · `/ar/experience`                           | FR-FE-35                         | 1.0       |
| `/about` · `/ar/about`                                     | FR-FE-36, 93 (ProfilePage)       | 1.0       |
| `/contact` · `/ar/contact`                                 | FR-FE-37, 50–52                 | 1.0       |
| `/under-the-hood` · `/ar/under-the-hood`                   | FR-FE-38, 60–66                 | 1.1       |
| `/insights` · `/ar/insights` (+ `[slug]`)                | PR-K1, FR-FE-99                  | 1.1       |
| `/cv`                                                         | FR-FE-39                         | 1.0       |
| `/sitemap.xml`, `/robots.txt`, `/llms.txt`, `/feed.xml` | FR-FE-92, 98, 99                 | 1.0 / 1.1 |
| `/api/revalidate`                                             | FR-FE-20, 21                     | 1.0       |

## 5. Definition of done (every task)

1. Works in **en and ar** (RTL verified), mobile (375 px) through desktop (1440 px).
2. Keyboard accessible, axe-clean, and reduced-motion-safe.
3. Data parsed through Zod schemas; no untyped API access.
4. Within performance budgets; no new client JS on pages that don't need it.
5. Tests added (unit for `lib/`, e2e for user-visible behavior).
6. No secrets in client bundles; CSP still passes.

## 6. Risks specific to the frontend

| Risk                                    | Mitigation                                                                         |
| --------------------------------------- | ---------------------------------------------------------------------------------- |
| Next.js 16 API differences cause rework | Read bundled docs per feature (FE-0 checklist); small spikes before large features |
| 3D and diagrams inflate bundles         | Dynamic imports, capability gating, Lighthouse CI budgets that fail the build      |
| RTL layout bugs discovered late         | Logical properties from day 1; every e2e test runs in both locales                 |
| Visual ambition slips the launch        | v1.0 ships without FE-8 islands; they are additive behind flags                    |
| Backend contract drift                  | Contract test against exported fixtures in CI (FE-2)                               |
