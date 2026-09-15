# Implementation Plan: Backend

| | |
|---|---|
| **Scope** | `backend-api/` (Metrial Base Code → Portfolio API) |
| **Implements** | [SRS Backend](SRS-backend.md) |
| **Coordinates with** | [Plan Frontend](plan-frontend.md) |
| **Date** | 2026-09-15 |

---

## 1. Approach

- **Build on the base, don't fork it mentally.** Every new module copies the shape of an existing one
  (`modules/{Module}/{Domain,Infrastructure,Presentation}`, provider in `bootstrap/providers.php`,
  route file gated by a `config/modules.php` flag).
- **Contract first.** The public API (SRS-BE §5) is frozen at milestone **M1**, so the frontend can build against fixtures in parallel.
- **Ship v1.0 before anything "wow".** Showcase, presence, and GitHub sync come in v1.1.
- **Every phase ends green:** `make lint`, `make phpstan`, `make test`, and the OpenAPI export succeed.

Effort is in **focused developer days** (about 6 productive hours). Convert to calendar time based on your weekly availability.

## 2. Phase overview

| Phase | Name | Effort | Release | Depends on |
|---|---|---|---|---|
| BE-0 | Foundation and cleanup | 2 d | 1.0 | – |
| BE-1 | Portfolio domain and seed content | 4 d | 1.0 | BE-0 |
| BE-2 | Public read API + caching + **SEO data (fields, redirects, sitemap)** + OpenAPI → **M1 contract freeze** | 5 d | 1.0 | BE-1 |
| BE-3 | Admin panel (Filament) + media + CV + SEO editing | 5 d | 1.0 | BE-1 |
| BE-4 | Contact pipeline | 3 d | 1.0 | BE-2 |
| BE-5 | Revalidation webhooks + analytics + **IndexNow** | 4 d | 1.0 | BE-2, FE-2 |
| BE-6 | Production deployment and operations + **search engine verification** → **M3 v1.0 launch** | 3 d | 1.0 | BE-3, BE-4, BE-5 |
| BE-7 | Showcase: status, console allowlist, GitHub, presence | 5 d | 1.1 | BE-6 |
| BE-8 | Admin analytics + SEO health dashboard | 2 d | 1.1 | BE-5 |
| BE-9 | Insights (articles), the long-tail SEO lever | 3 d | 1.1 | BE-6 |
| | **Total** | **36 d** (v1.0: 26 d) | | |

## 3. Phases in detail

### BE-0 · Foundation and cleanup (2 d)

- [ ] Rename app identity: `APP_NAME="Metrial Portfolio API"`, OpenAPI title and description, `COMPOSE_PROJECT_NAME`.
- [ ] Disable unused modules in `.env.example` and `.env.docker`: payment, wallet, communication, integration_oauth (SRS-BE §2.2); confirm `php artisan route:list` no longer shows their routes.
- [ ] Remove the demo enterprise data from the local seeding path, or gate it behind `SEED_ENTERPRISE_DEMO=false`, so portfolio seeders are the default.
- [ ] Disable public registration routes (FR-BE-25); add the `portfolio:create-owner` artisan command (name, email, password prompt, assigns `super-admin`, forces MFA enrollment on first login).
- [ ] Add env vars from SRS-BE §7 to `.env.example` with comments.
- [ ] Configure CORS origins (FR-BE-14).
- [ ] Recreate a CI workflow (GitHub Actions or your chosen CI) that runs `make ci-test` plus the OpenAPI export (the previous `.github/workflows` were removed).
- [ ] Add module flags for new modules: `portfolio`, `contact`, `analytics`, `showcase`, `insights`.

**Done when:** a fresh clone runs `make up && make fresh` with portfolio defaults, disabled module routes return 404, CI is green.

### BE-1 · Portfolio domain and seed content (4 d)

- [ ] Scaffold `modules/Portfolio` (Domain / Infrastructure / Presentation, provider, config, lang `en` + `ar`).
- [ ] Migrations and models for every table in SRS-BE §4 up to `cv_files` (UUIDs, translatable JSON via `HasTranslations`, enums as PHP backed enums).
- [ ] Relationships, sort scopes, `published()` scope, and a `publiclyVisible()` scope that implements confidentiality (FR-BE-04).
- [ ] `Auditable` on every content model (FR-BE-08).
- [ ] `ProofStatsService` computing stats from data only (FR-BE-07), with unit tests.
- [ ] Factories for all models.
- [ ] Idempotent seeders from PRD §7 (profile, 4 experiences, 6 projects with links, 7 skill groups with all CV skills, education, 3 certificates); Arabic fields seeded with placeholders marked `TODO-AR` for owner review (FR-BE-09).
- [ ] RBAC permissions for new resources (`projects.view`, `projects.manage`, …) added to `RolesAndPermissionsSeeder`.

**Tests:** confidentiality scope matrix (published/draft × public/summary_only/hidden), stats computation, seeders are idempotent (run twice → same counts).

**Done when:** `make fresh` gives a database that matches the CV content; the tests pass.

### BE-2 · Public read API + caching + SEO data + OpenAPI (5 d) → M1

- [ ] Controllers + API Resources for the `/site`, `/profile`, `/experiences`, `/skills`, `/credentials`, `/testimonials`, `/projects`, `/projects/{slug}`, `/stats`, `/sitemap` endpoints (SRS-BE §5.2).
- [ ] Locale resolution and `meta.direction` (inherited); translatable fields resolved in resources.
- [ ] Filters and pagination on `/projects` (`filter[domain]`, `filter[skill]`, `filter[featured]`).
- [ ] `summary_only` resource variant; `project_not_found` for draft or hidden projects (FR-BE-04, §5.6).
- [ ] `PublicCache` service: Redis keys `portfolio:{resource}:{locale}:{hash(params)}`, tagged invalidation on model events (FR-BE-11).
- [ ] ETag, `Cache-Control`, and `304` middleware for public GET routes (FR-BE-12).
- [ ] Rate limiters `api`, `showcase`, `contact`, `analytics` with rate-limit headers (FR-BE-13).
- [ ] `ServerTiming` middleware: app, db, cache hit/miss (FR-BE-71).
- [ ] `Model::preventLazyLoading()` outside production; query-count assertions in tests (NFR-P2).
- [ ] **SEO data:** `seo_meta` and `slug_redirects` tables; `seo` block in page and project resources; `GET /seo/pages/{page}`; `GET /redirects` with chain collapsing; slug-change observer that writes redirects (FR-BE-82, FR-BE-83).
- [ ] **Sitemap:** `GET /sitemap` with accurate `updated_at` (touch parent on section, link, media, or skill changes) and cover images (FR-BE-81).
- [ ] **Entity settings:** `person.alternate_names`, `person.same_as`, `person.knows_about` in `/site` (FR-BE-84); seed with `Karem Metrial`, `Kareem Sabry Elsayed`, `كريم صبري`, LinkedIn, GitHub, Packagist.
- [ ] Scramble export of `api.json`; commit it to `artifacts/openapi/` (FR-BE-15).
- [ ] **Export frontend fixtures:** an artisan command `portfolio:export-fixtures` writes seeded responses for both locales to `artifacts/fixtures/{en,ar}/*.json` for the frontend (FE-2).

**Tests per endpoint:** 200 in en and ar, RTL meta, confidentiality, filters, 304 with ETag, 429 after limit, and no N+1.
**SEO tests:** renaming a slug creates a redirect; chains collapse; hidden or draft items never appear in `/sitemap` or `/redirects` targets; `updated_at` changes when a section changes.

**Done when (M1):** OpenAPI and fixtures are published, and the frontend confirms its Zod schemas validate against the fixtures. After M1, breaking changes to the contract require a version note and a fixture update.

### BE-3 · Admin panel + media + CV (5 d)

- [ ] Install FilamentPHP (version compatible with Laravel 12; check docs) with the panel at `/admin`; theme with METRIAL colors and logo (`images/metrial-mark.svg`).
- [ ] Panel access gate: `super-admin` or `editor`; **mandatory MFA** using the Auth module's MFA service (FR-BE-20, NFR-S1).
- [ ] Resources: Profile (single record), Experiences, Projects (with relation managers for sections, links, media, skills), Skill groups and Skills, Education, Certificates, Testimonials (FR-BE-21).
- [ ] English and Arabic tabs per translatable field; Markdown editor with preview for sections; reorderable tables (drag-and-drop).
- [ ] Architecture and flow JSON editors, validated against a JSON schema (so the frontend diagrams never break).
- [ ] Media: bridge Filament uploads to the Media module pipeline (presign → upload → confirm → verify); variants; alt text required (FR-BE-22, NFR-S5).
- [ ] CV management: upload per locale, set current, version list (FR-BE-30).
- [ ] Site Settings page (Governance Settings) and Feature Flags page (FR-BE-23, FR-BE-24), including the entity settings from FR-BE-84.
- [ ] **SEO tab** on projects (and a "Page SEO" resource for static pages): per-locale title and description with character counters, a Google-result preview, OG image override, noindex toggle; alt text required on every image (FR-BE-82, SEO.md T-9).
- [ ] Audit log viewer (read-only) filtered to content models.

**Tests:** access denied without role or MFA; saving a project writes an audit log; an invalid architecture JSON is rejected; media confirm flow.

**Done when:** the owner can edit every piece of CV content and upload the CV entirely from `/admin`.

### BE-4 · Contact pipeline (3 d)

- [ ] `modules/Contact`: migration, model, enums, `SubmitContactMessage` action (FR-BE-40).
- [ ] Anti-spam: honeypot, `elapsed_ms`, bot challenge verifier via `ApiClient` + circuit breaker, spam scorer, silent success for bots (FR-BE-41, FR-BE-42).
- [ ] `ContactMessageReceived` event → queued listeners: owner email (Markdown mailable, METRIAL styled), realtime admin notification, optional auto-reply in `lang` (FR-BE-43).
- [ ] Retry and backoff; failed-notification visibility in admin (FR-BE-44).
- [ ] Filament Inbox resource: status workflow, spam toggle, notes, `mailto:` reply (FR-BE-45).
- [ ] Scheduled retention purge (FR-BE-46).

**Tests:** validation (en and ar messages), bot paths return 201 without storing or notifying, the notification is queued once after commit, 5/hour limit, purge job.

**Done when:** a real submission reaches the owner's inbox in under 2 minutes locally (use a mail catcher in dev).

### BE-5 · Revalidation webhooks + analytics + IndexNow (4 d)

- [ ] `PortfolioContentChanged` event implementing `StoredInOutbox`, emitted from model observers and publish actions with the tag mapping from FR-BE-51 (FR-BE-50).
- [ ] Coalescing: debounce identical tag sets within 10 s before outbox insert (FR-BE-52).
- [ ] Artisan `portfolio:register-frontend-webhook` creates or updates the `WebhookEndpoint` from env (URL + secret).
- [ ] Admin: last delivery status widget + "Revalidate all" action (FR-BE-53).
- [ ] `modules/Analytics`: event ingestion endpoint with an allowlist of names and props, device class, country lookup, daily salted visitor hash, DNT/GPC handling (FR-BE-60–62).
- [ ] Hourly rollup job into `analytics_daily`; 90-day raw retention (FR-BE-63).
- [ ] **IndexNow** job: on publish, update, or unpublish, submit affected URLs in both locales, coalesced per 10 minutes, max 3 retries (FR-BE-85). Emit tags `seo` and `redirects` when SEO fields or slugs change.

**Tests:** changing a project → one outbox row with the correct tags; signature format matches the frontend verifier (shared test vector JSON in `artifacts/fixtures/webhook-signature.json`); analytics never stores raw IP or full UA; DNT path.

**Done when:** editing a project in the admin revalidates the local frontend page within 1 minute (joint test with FE-2).

### BE-6 · Production deployment and operations (3 d) → M3

- [ ] Provision the VPS; Docker + compose prod overlay; reverse proxy with TLS (Caddy or nginx + certbot), HSTS; `api.<domain>` and realtime routing.
- [ ] Secrets as `*_FILE` or env on the server; `APP_DEBUG=false`; Scramble docs disabled in production.
- [ ] Queue workers, scheduler, and realtime healthy under supervisor; heartbeat (FR-BE-72 prerequisite).
- [ ] Mail provider configured with SPF, DKIM, and DMARC for the domain.
- [ ] Daily backups off-server + a documented restore test (NFR-R3).
- [ ] Uptime monitor on `/health`, error tracking, log retention (NFR-R4).
- [ ] Load test public endpoints (for example k6: 50 VUs, 5 min), then verify NFR-P1.
- [ ] Runbook in `backend-api/docs/portfolio-runbook.md`: deploy, rollback, rotate secrets, restore backup, re-run fixtures.
- [ ] **Search engines** (with FE-7): DNS TXT verification for the Google Search Console domain property and Bing Webmaster Tools; set `INDEXNOW_KEY`; confirm the API subdomain itself is not indexable (`X-Robots-Tag: noindex` on `api.<domain>` and `/admin`).

**Done when:** v1.0 exit criteria in PRD §9 are met on production together with FE-7.

### BE-7 · Showcase endpoints (5 d) · v1.1

- [ ] `modules/Showcase`: `/showcase/endpoints` allowlist (FR-BE-70), `/showcase/status` (FR-BE-72), `/showcase/engineering` facts generated at deploy (FR-BE-76).
- [ ] GitHub sync job + snapshot + stale fallback via `ApiClient` circuit breaker (FR-BE-75).
- [ ] Realtime service: anonymous `public` namespace, receive-only sockets, per-IP limits, `presence.count` and `activity.project_view` events with strict schemas and tests; `contact.received` for admins (FR-BE-73, FR-BE-74). Update `docs/realtime/event-contract.md`.
- [ ] Emit `activity.project_view` from the analytics ingestion (country-level only, throttled).
- [ ] Load test realtime: 500 sockets (NFR-P4).

**Done when:** the frontend Under the Hood page runs fully against production with flags on.

### BE-8 · Admin analytics + SEO health dashboard (2 d) · v1.1

- [ ] Filament dashboard widgets: 7/30-day totals, top projects, top referrers, CV downloads trend (FR-BE-26).
- [ ] SEO health widget: missing descriptions, missing alt text, missing Arabic, duplicate titles (FR-BE-86).

### BE-9 · Insights (3 d) · v1.1

- [ ] `modules/Insights`: articles, tags, media cover, reading time, related projects, SEO fields, slug redirects, endpoints, admin resource, revalidation tags `insights` / `article:{slug}`, IndexNow on publish (FR-BE-90, FR-BE-82, FR-BE-83, FR-BE-85).
- [ ] Seed the first two article drafts from [SEO.md §7](SEO.md#7-content-plan-long-tail-authority) for the owner to write.

## 4. Cross-team contract checklist

| Artifact | Produced by | Consumed by | When |
|---|---|---|---|
| `artifacts/openapi/api.json` | BE-2 | FE-2 (schemas), live console docs | M1, then every release |
| `artifacts/fixtures/{en,ar}/*.json` | BE-2 | FE-2 fixtures mode, contract test | M1 |
| Cache tag list (FR-BE-51) | BE-5 | FE-2 `lib/api/tags.ts` | M1 |
| Webhook signature test vector | BE-5 | FE-2 revalidate route test | BE-5 |
| Realtime event schemas | BE-7 | FE-8 presence client | BE-7 |
| SEO fields, `/redirects`, `/sitemap`, entity settings | BE-2 | FE-2 schemas, FE-6 metadata and JSON-LD | M1 |

## 5. Definition of done (every task)

1. Code follows the base's module layering and passes Pint and Larastan.
2. Feature tests cover success, validation, authorization, localization (en and ar), and edge cases.
3. Public contract changes are reflected in the OpenAPI export and fixtures.
4. New config and env vars are documented in `.env.example`.
5. Audit logging applies to any owner-editable model.
6. No secret, personal data, or confidential project detail is committed.

## 6. Risks specific to the backend

| Risk | Mitigation |
|---|---|
| Filament version or compatibility friction with the base's custom auth or MFA | Spike Filament install on day 1 of BE-3; fallback is a Next.js admin against an authenticated admin API (DC-4) |
| Anonymous realtime namespace widens the attack surface | Receive-only sockets, per-IP connection caps, strict schema allowlist, feature flag kill switch |
| Outbox → webhook coupling to frontend availability | Retries with backoff; "Revalidate all" button; cacheLife safety net on frontend |
| Scope creep from the base's enterprise features | Keep disabled modules off; resist adding tenancy, payments, or approvals to portfolio flows |
