# SEO Strategy: Rank First on Google

| | |
|---|---|
| **Document** | SEO Strategy v1.0 |
| **Date** | 2026-09-15 |
| **Owner** | Kareem Sabry Elsayed |
| **Traces to** | [BRS](BRS.md) BO-6, BR-10, BR-16, BR-18 |
| **Implemented in** | [SRS Frontend §3.9](SRS-frontend.md#39-seo-and-sharing) · [SRS Backend §3.9](SRS-backend.md#39-site-and-seo-support) · both plans |

---

## 1. Goal, stated honestly

**Goal:** when someone searches for Kareem, the portfolio is the **first organic result on Google**, and for
the backend topics he works on, it appears on **page one**.

Nobody can guarantee a Google position. Ranking depends on competition, and Google decides. What we *can*
control is choosing winnable queries, building the site so Google understands exactly who it is about,
and earning trust signals over time. This document does that.

## 2. Current search landscape (checked 2026-09-15)

| Query | What ranks today | Difficulty | Realistic target |
|---|---|---|---|
| `Karem Metrial` / `KaremMetrial` | Only a ZoomInfo profile and the `metrial/laravel-rbac` package on Packagist | **Very low** | **#1** within weeks of indexing |
| `Kareem Sabry backend developer` / `… Laravel` | Nothing specific | **Low** | **#1** |
| `كريم صبري مطور باك اند` | Nothing specific | **Low** | **#1** (needs the Arabic version) |
| `Kareem Sabry` (name only) | 90+ LinkedIn profiles; a CFO (ZoomInfo), a TV journalist, an IEEE author, Facebook and Instagram accounts | **High** | **Top 3**, then #1 over months as authority grows. Not guaranteed. |
| `Metrial` (brand only) | A medical term: Merriam-Webster, Wiktionary, PubMed "metrial gland" papers; a Spotify artist | **Very high** | Not a target alone. Always pair it: **"Metrial Laravel"**, **"Karem Metrial"**. |
| `Laravel backend developer Egypt / Mansoura` | Freelance marketplaces, agencies | **High** | Page 1 over time, through content |
| Long-tail technical (`Laravel transactional outbox`, `Paymob Fawry Laravel integration`) | Blog posts, docs | **Medium** | Page 1 with strong articles (§6) |
| `backend developer`, `Laravel developer` | Job boards, huge sites | **Extreme** | Not a target |

**Implication:** the fastest win is the **name + brand + role** combination. The name alone is the long-term
prize, and it is won by being the most authoritative "Kareem Sabry" *for software*.

## 3. Identity (entity) strategy

Google ranks people by understanding them as an **entity**. Make every signal point to one identity.

1. **Pick one canonical display name** (Open Question Q-1). Recommended: **Kareem Sabry** as the visible name,
   with **Karem Metrial** declared as the alternate name, because that spelling already appears on LinkedIn,
   GitHub, ZoomInfo, and Packagist.
2. **Say it on the page, in plain text:** About page includes "Kareem Sabry Elsayed (known online as *Karem Metrial*)
   is a Backend Software Engineer based in Mansoura, Egypt."
3. **Structured data** on every page (`Person` with a stable `@id`): `name`, `alternateName`
   (`Karem Metrial`, `Kareem Sabry Elsayed`, `كريم صبري`), `jobTitle`, `worksFor`, `alumniOf` (Mansoura University),
   `address` (Mansoura, EG), `knowsAbout`, and `sameAs` (LinkedIn, GitHub, Packagist, and any other profile you control).
   Plus `WebSite` with `alternateName` `Metrial`.
4. **Link every profile back to the site** (the other half of `sameAs`):
   - LinkedIn: *Website* field + Featured section + headline mention.
   - GitHub: profile website field, profile README, pinned repositories linking to case studies.
   - Packagist `metrial/*` packages: homepage URL → site.
   - CV PDF: add the website URL under the name.
   - Email signature, Upwork/Mostaql/Freelancer profiles if used.
5. **Consistent photo and headline** across LinkedIn, GitHub, and the About page (if a photo is used, Q-11).

## 4. Domain and URL decisions

- **Domain (Q-3):** a name-based domain is the strongest choice for name searches, for example
  `kareemsabry.dev` or `karemmetrial.dev`. A brand-only domain (`metrial.dev`) is weaker because "metrial" is an
  existing medical word. Exact-match domains are a small factor; consistency matters more.
- **One host:** `https://` on the apex **or** `www`; the other 301-redirects.
- **English at the root, Arabic under `/ar`:** `/`, `/projects/barq-dayem`, `/ar`, `/ar/projects/barq-dayem`.
  No automatic language redirects (Google may not crawl the other language); suggest the other language with a banner instead.
- **Stable, readable English slugs** in both locales; a slug change creates a 301 redirect automatically.
- No trailing slashes; lowercase; no query-string duplicates in the index (canonical strips filters).

## 5. Technical SEO checklist

| # | Item | Where specified |
|---|---|---|
| T-1 | All indexable content is in the **server-rendered HTML** (no content that only appears after JavaScript) | FR-FE-94 |
| T-2 | Unique `<title>` (≤ 60 chars) and meta description (140–160 chars) per page and locale, editable in admin | FR-FE-90, FR-BE-82 |
| T-3 | Self-referencing absolute canonical; `hreflang` en / ar / x-default in HTML **and** sitemap | FR-FE-90, FR-FE-92 |
| T-4 | XML sitemap with accurate `lastmod` and image entries; `robots.txt` references it | FR-FE-92, FR-BE-81 |
| T-5 | Structured data: `Person`, `WebSite`, `ProfilePage` (About), `BreadcrumbList`, `CreativeWork` (projects), `BlogPosting` (articles); validated in CI | FR-FE-93 |
| T-6 | Core Web Vitals "Good" (LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1) on mobile | SRS-FE §5.1 |
| T-7 | Real `404` / `410` status codes; 301 for moved slugs; no soft 404s; no redirect chains | FR-FE-95, FR-BE-83 |
| T-8 | Semantic HTML: one H1, heading hierarchy, descriptive link text, `lang` / `dir` | NFR-FE-A2 |
| T-9 | Images: descriptive file names and required alt text, modern formats, explicit dimensions | FR-BE-22, NFR-FE-P7 |
| T-10 | Non-production deployments send `X-Robots-Tag: noindex`; `/dev/*` is noindex | FR-FE-96 |
| T-11 | Internal links: every case study links to related projects, skills, and articles; breadcrumbs everywhere | FR-FE-97 |
| T-12 | Search Console (domain property) and Bing Webmaster verified; IndexNow ping on publish | FR-BE-85, plans |
| T-13 | Open Graph and social cards per page (click-through from LinkedIn and WhatsApp) | FR-FE-91 |
| T-14 | `llms.txt` and a plain factual "About" so AI search answers cite the site correctly | FR-FE-98 |

## 6. On-page templates

| Page | Title (en) | Title (ar) | H1 |
|---|---|---|---|
| Home | `Kareem Sabry (Karem Metrial) · Backend Software Engineer` | `كريم صبري · مهندس برمجيات باك اند` | Kareem Sabry |
| About | `About Kareem Sabry · Laravel Backend Engineer in Egypt` | `عن كريم صبري · مطور لارافيل في مصر` | About Kareem |
| Projects | `Backend Projects & Case Studies · Kareem Sabry` | `مشاريع ودراسات حالة · كريم صبري` | Selected work |
| Case study | `{Project}: {Domain} Backend Case Study · Kareem Sabry` | `{المشروع}: دراسة حالة باك اند · كريم صبري` | {Project} |
| Experience | `Experience & Skills · Kareem Sabry, PHP/Laravel Engineer` | `الخبرات والمهارات · كريم صبري` | Experience |
| Article | `{Article title} · Kareem Sabry` | `{عنوان المقال} · كريم صبري` | {Article title} |

Rules: the name appears in every title; the first 100 words of Home and About mention name, role, stack
(PHP, Laravel), and location naturally; no keyword stuffing.

## 7. Content plan (long-tail authority)

Articles (Insights, moved to **v1.1**) are the main lever for ranking beyond the name. Each article must come
from **real experience** (no invented numbers or claims) and link to the related case study.

| # | Topic (working title) | Target query cluster | Links to |
|---|---|---|---|
| 1 | Transactional outbox in Laravel: never lose a webhook | laravel outbox pattern, laravel reliable webhooks | Metrial Base Code |
| 2 | One contract, four gateways: Stripe, Paymob, Fawry, and PayTabs in Laravel | paymob laravel, fawry laravel integration | Metrial Base Code |
| 3 | Real-time delivery tracking with Laravel, Pusher, and FCM | laravel real time order tracking | Barq & Dayem |
| 4 | Designing an auction bidding backend that stays consistent under load | laravel auction bidding websockets | Sharwa |
| 5 | Idempotency keys: stop double charges in your API | laravel idempotency key | Metrial Base Code |
| 6 | Wallets, escrow, and row-level locking in MySQL | laravel wallet lockForUpdate escrow | Metrial Base Code |
| 7 | Shipping integration with Bosta APIs in Laravel | bosta api laravel | Samoulla |
| 8 | Moyasar payment integration for an e-learning platform | moyasar laravel | Rmoztec experience |
| 9 | Building operations dashboards fast with FilamentPHP | filament admin laravel | Field Service / Rmoztec |
| 10 | Arabic: كيف تبني API قابل للتوسع بلارافيل | لارافيل API باك اند | Home (ar) |

Cadence: 2 articles per month for the first 3 months after v1.1, then 1 per month. Cross-post to dev.to,
Hashnode, or Medium **with `rel=canonical` pointing to the site**. Confidential details from employer projects
stay out (BR-03).

## 8. Off-page authority

- GitHub: public repositories with README links to the site (portfolio frontend, `metrial/*` packages, base code if public).
- Packagist package pages → site homepage.
- LinkedIn posts announcing each case study and article (people search the name after seeing a post).
- Community: DEPI alumni, Laravel Egypt groups, local meetups or talks; answers on Stack Overflow with profile link.
- Guest posts or interviews on reputable tech blogs when possible.
- **Never** buy links, join link networks, or use automated spam directories. These get sites penalized.

## 9. Launch and ongoing operations

**At launch (FE-7 / BE-6):**
1. Verify the **domain property** in Google Search Console (DNS TXT) and in Bing Webmaster Tools.
2. Submit `sitemap.xml`; use URL Inspection → *Request indexing* for Home, About, Projects, and each case study.
3. Update all profiles in §3.4 with the URL on launch day.
4. Test pages with Google's Rich Results Test and PageSpeed Insights.

**Monthly (30 minutes):**
- Search Console → Performance: impressions, clicks, and average position for target queries.
- Search Console → Pages: indexing errors; Core Web Vitals report.
- Check the name queries in an incognito window (and from an Egypt and a GCC location if possible).
- Refresh one older case study or article; publish scheduled content.

## 10. Targets

Timeframes start from the date Google first indexes the site. They are targets, not guarantees.

| Query group | 30 days | 90 days | 6 months |
|---|---|---|---|
| `Karem Metrial`, `KaremMetrial` | #1 | #1 | #1 |
| `Kareem Sabry backend developer` / `Laravel` / `software engineer` | Top 3 | #1 | #1 |
| `كريم صبري مطور` (Arabic) | Top 5 | #1 | #1 |
| `Kareem Sabry` (name only) | Page 1 | Top 3 | #1 (stretch) |
| `Metrial Laravel`, `Metrial Base Code` | Top 3 | #1 | #1 |
| Long-tail article queries | Indexed | Page 1 for ≥ 2 | Page 1 for ≥ 5 |
| All public pages indexed | 100% | 100% | 100% |

## 11. What not to do

- Keyword stuffing, hidden text, or city "doorway" pages ("Laravel developer in Riyadh", "… in Dubai").
- Machine-translated Arabic pages published without review (thin or low-quality content).
- Publishing the same CV text on many other sites or domains (duplicate content).
- Fake testimonials or reviews (also violates BR C-4 truthfulness).
- Changing slugs or domains after launch without 301 redirects.
