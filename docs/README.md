# Metrial Portfolio: Project Documents

Planning documents for Kareem Sabry's portfolio platform: a Next.js 16 frontend (`my-app/`) powered by
a Laravel 12 API built on the Metrial Base Code (`backend-api/`).

**Top goals:** prove backend depth live, win interviews and clients, and **be the first Google result** for Kareem's name, brand, and role.

## Documents

| Doc | Answers | Read it when |
|---|---|---|
| [BRS](BRS.md) | **Why** build it, and what the business needs | Deciding scope or priorities |
| [PRD](PRD.md) | **What** the product does: features, journeys, content, releases | Designing pages and features |
| [SEO Strategy](SEO.md) | **How to rank first on Google:** keywords, identity, technical SEO, content, targets | Anything touching URLs, metadata, content, launch |
| [SRS Backend](SRS-backend.md) | **How** the API, admin, and pipelines must behave | Implementing `backend-api/` |
| [SRS Frontend](SRS-frontend.md) | **How** the web app must behave | Implementing `my-app/` |
| [Plan Backend](plan-backend.md) | **In what order** to build the backend | Planning backend work |
| [Plan Frontend](plan-frontend.md) | **In what order** to build the frontend | Planning frontend work |

Traceability: `BR-xx` (BRS) → `PR-xx` (PRD) → `FR-BE-xx` / `FR-FE-xx` (SRS) → plan tasks.

## Key decisions

| Decision | Choice | Why |
|---|---|---|
| Backend foundation | Extend the existing Metrial Base Code; disable payment, wallet, communication, and OAuth modules | Reuses auth, MFA, RBAC, media, audit, outbox webhooks, and realtime; the base itself is a showcase |
| Admin UI | FilamentPHP panel at `/admin` | Fast CRUD, matches CV skills; fallback documented |
| Frontend | Next.js 16.3 App Router with Cache Components | Existing app; static speed with on-demand freshness |
| **URLs** | **English at the root, Arabic under `/ar`, no automatic language redirects** | Clean URLs that Google crawls fully in both languages |
| **SEO** | Built in from v1.0: entity structured data, per-page SEO fields, sitemap, redirects, IndexNow, Search Console at launch | First Google result for name, brand, and role queries |
| **Articles** | Moved from v1.2 to **v1.1** | Main lever to rank beyond the name |
| Content freshness | Admin save → outbox event → signed webhook → `revalidateTag` | No redeploys; uses the base's outbox and webhook features |
| Resilience | Build-time content snapshot as fallback | Site stays up if the API is down |
| Differentiator | "Under the Hood" live backend showcase | Makes backend skill visible and verifiable |

## Search reality check (2026-09-15)

| Query | Competition today | Target |
|---|---|---|
| "Karem Metrial" | Almost none | **#1** |
| "Kareem Sabry backend developer" | None specific | **#1** |
| "Kareem Sabry" alone | 90+ LinkedIn profiles, a CFO, a TV journalist, an IEEE author | Top 3, then #1 over months |
| "Metrial" alone | Medical dictionary term | Not a target alone |

Details and timeframes: [SEO.md §2](SEO.md#2-current-search-landscape-checked-2026-09-15) and [§10](SEO.md#10-targets).

## Milestones

| Milestone | Meaning | Backend | Frontend |
|---|---|---|---|
| **M0** Kickoff | Docs approved, open questions answered, domain bought | – | – |
| **M1** Contract freeze | Public API, SEO data, fixtures, cache tags, and webhook signature agreed | BE-2 | FE-2 |
| **M2** Content complete | All CV content and SEO fields entered and verified in the admin, Arabic approved | BE-3 | – |
| **M3** v1.0 launch | Public site live on the custom domain, **Search Console verified, sitemap submitted** | BE-6 | FE-7 |
| **M4** v1.1 | Under the Hood showcase live, **first 2 articles published** | BE-7, BE-8, BE-9 | FE-8, FE-9 |
| **M5** v1.2 | Light theme, terminal mode | – | FE-10 |

## Suggested build order (one developer)

| # | Work | Effort |
|---|---|---|
| 1 | BE-0 Foundation · FE-0 Foundation (incl. SEO-friendly routing) | 5 d |
| 2 | BE-1 Domain + seed content | 4 d |
| 3 | FE-1 Design system | 4 d |
| 4 | BE-2 Public API + SEO data → FE-2 Data layer → **M1** | 8 d |
| 5 | FE-3 Home · FE-4 Projects | 8 d |
| 6 | BE-3 Admin + media + CV + SEO editing → **M2** | 5 d |
| 7 | BE-4 Contact · FE-5 Experience/About/CV/Contact | 7 d |
| 8 | BE-5 Revalidation + analytics + IndexNow · FE-6 Technical SEO + quality pass | 9 d |
| 9 | BE-6 Deploy · FE-7 Launch + search engine launch → **M3 v1.0** | 6 d |
| 10 | BE-7 + BE-8 Showcase · FE-8 Dynamic islands | 15 d |
| 11 | BE-9 + FE-9 Articles → **M4 v1.1** | 6 d |
| 12 | FE-10 Extras → **M5 v1.2** | 2 d |

**v1.0 ≈ 56 focused days · v1.1 +21 d · v1.2 +2 d.** At about 15 focused hours per week alongside a full-time job,
v1.0 is roughly 5 months; at 30 hours per week, about 2.5–3 months. The fastest way to launch sooner is to ship
English first (Arabic in v1.1). SEO work should **not** be cut: it's cheap to build in and expensive to retrofit.

**Start SEO before the site is finished:** buy the domain now and put a simple one-page placeholder live
(name, role, links) so Google starts indexing and trusting the domain months earlier.

## Open questions

Answer these before M0. Each one blocks or changes specific requirements.

| ID | Question | Affects | Default if unanswered |
|---|---|---|---|
| **Q-1** | Canonical name spelling: **Kareem** Sabry (CV) or **Karem** Sabry (brand sheet, LinkedIn handle)? **Critical for SEO.** | Titles, JSON-LD, OG images, all profiles | Visible name "Kareem Sabry"; "Karem Metrial" as `alternateName` everywhere |
| **Q-2** | Do you have permission to show architecture detail and screenshots for Barq, Dayem, Sharwa, Samoulla, Wathiq, and the Field Service platform? | PR-B2, B5, B7; seed confidentiality | Public store links + generic diagrams; no screenshots; field service `summary_only` |
| **Q-3** | Domain name? For search, a **name-based domain** (e.g. `kareemsabry.dev` or `karemmetrial.dev`) is recommended over `metrial.*`, because "metrial" is a medical word. | Deployment, SEO, email DNS | Blocks launch (M3). Buy early. |
| **Q-4** | Hosting: Vercel for frontend + VPS for API, or everything on one VPS? | SRS-FE §7, FE-7, BE-6 | Vercel + VPS |
| **Q-5** | Public contact email: `karem.metrial@hotmail.com` (CV) or a domain address? Show phone number? | PR-E5, FR-BE-01 | Domain email once available; phone hidden |
| **Q-6** | Bot challenge provider (e.g. Cloudflare Turnstile) acceptable? | FR-BE-41, FR-FE-50, CSP | Turnstile |
| **Q-7** | Who writes or approves the Arabic copy? (Unreviewed machine translation can hurt Arabic rankings.) | BR-09, M2 | Owner approves AI-drafted copy |
| **Q-8** | Payment gateway name on the CV is "Moyasser". Confirm it is **Moyasar**. | PRD §7.2 content | Use "Moyasar" |
| **Q-9** | Transactional email provider (SMTP host, Resend, Mailgun, SES…)? | FR-BE-43, BE-6 | Any SMTP with SPF/DKIM |
| **Q-10** | CI provider (GitHub Actions?) and repository visibility (a public repo helps BR-07 and backlinks)? | BE-0, FE-0 | GitHub Actions, public frontend repo |
| **Q-11** | Include a professional photo on About? (Helps entity recognition and trust.) | PR-C4, SEO.md §3 | No photo; brand mark only |
| **Q-12** | Testimonials: any colleagues or clients willing to provide one? | Testimonials | Section hidden until at least 2 exist |
| **Q-13** | Is `metrial/laravel-rbac` on Packagist yours, and should it be listed as a project? Any other public profiles (Stack Overflow, dev.to, Medium, Mostaql, Upwork) to add to `sameAs`? | PRD §7.3, FR-BE-84 | List the package; LinkedIn + GitHub + Packagist only |
| **Q-14** | Will you commit to the article cadence (2 per month for 3 months after v1.1)? | SEO.md §7, BR-16 | Ranking beyond the name will be slower |

## Source material

- CV: [`images/Kareem_Sabry_Backend_Software_Engineer_CV.pdf`](../images/Kareem_Sabry_Backend_Software_Engineer_CV.pdf)
- Brand sheet: [`images/branding.png`](../images/branding.png)
- Brand marks and icons: [`images/metrial-mark.svg`](../images/metrial-mark.svg), [`images/metrial-mark-mono.svg`](../images/metrial-mark-mono.svg), [`images/metrial-icon.svg`](../images/metrial-icon.svg)
- Base code docs: [`backend-api/README.md`](../backend-api/README.md), [`backend-api/ARCHITECTURE.md`](../backend-api/ARCHITECTURE.md)
