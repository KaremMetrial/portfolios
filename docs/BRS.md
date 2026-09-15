# Business Requirements Specification (BRS)

| | |
|---|---|
| **Project** | Metrial Portfolio Platform: portfolio of Kareem Sabry, Backend Software Engineer |
| **Document** | BRS v1.0 |
| **Date** | 2026-09-15 |
| **Owner** | Kareem Sabry Elsayed |
| **Status** | Draft for owner review |
| **Related** | [PRD](PRD.md) · [SEO Strategy](SEO.md) · [SRS Backend](SRS-backend.md) · [SRS Frontend](SRS-frontend.md) · [Plan Backend](plan-backend.md) · [Plan Frontend](plan-frontend.md) |

---

## 1. Purpose

This document defines **why** the portfolio exists and **what the business needs from it**.
It does not prescribe features or technology. Those live in the PRD and the SRS files.
Every product and system requirement must trace back to a business requirement (`BR-xx`) here.

## 2. Background and problem

Kareem is a PHP/Laravel backend engineer based in Mansoura, Egypt, with experience across
delivery, marketplace, auction, e-commerce, hotel booking, e-learning, and field-service platforms,
and is open to relocation.

The current way he presents himself has three problems:

1. **Backend work is invisible.** The platforms he built ship as mobile apps
   (Barq, Dayem, Sharwa, Samoulla, Wathiq). A Play Store link shows the *client app*, not the APIs,
   queues, real-time flows, and payment integrations he built behind it.
2. **A PDF CV makes claims but cannot prove them.** "Redis caching", "WebSockets", "Docker", "CI/CD" read
   the same on every backend CV. Nothing lets a reviewer *see* the engineering quality.
3. **The personal brand is fragmented.** The brand identity (METRIAL), CV, LinkedIn, and GitHub
   are not connected in one place, and the name is spelled differently across them
   ("Kareem" on the CV, "Karem" on the brand sheet and LinkedIn handle).

## 3. Business objectives

| ID | Objective |
|---|---|
| **BO-1** | Win more interviews for Backend / PHP / Laravel roles in Egypt, the GCC, and relocation markets. |
| **BO-2** | Prove backend engineering depth with **live, verifiable evidence** rather than claims. |
| **BO-3** | Establish one consistent **METRIAL** personal brand across the site, CV, LinkedIn, and GitHub. |
| **BO-4** | Generate inbound opportunities: full-time roles, freelance, and consulting. |
| **BO-5** | Keep the portfolio current with **minimal ongoing effort** from the owner. |
| **BO-6** | Be the **first Google result** when people search for Kareem (name, brand, and role), and appear on page one for the backend topics he works on. |

## 4. Stakeholders and audiences

| Stakeholder | Role | What they need | What convinces them |
|---|---|---|---|
| **Owner** (Kareem) | Content owner, sole developer, operator | Easy updates, low hosting cost, a site that is itself a showcase | Content changes in minutes without a deploy |
| **Technical recruiter / HR** | Screens candidates quickly, often on mobile | Role, stack, seniority, location/relocation, CV, contact | Clear first screen, fast load, downloadable CV |
| **Hiring manager / tech lead** | Evaluates engineering depth | Architecture decisions, code quality, testing, real-time and payment experience | Case studies with architecture, a live API, GitHub activity |
| **Freelance client / founder** | Often non-technical, may prefer Arabic | Trust, relevant past products, how to start working together | Shipped apps, plain-language outcomes, Arabic version, easy contact |
| **Engineering community** | Peers, potential referrers | Technical insight | Articles and open-source code (later phase) |

## 5. Scope

### 5.1 In scope

- Public bilingual (English / Arabic) portfolio website.
- Owner-only content management (profile, experience, projects, skills, credentials, CV file, settings).
- Contact channel with owner notification.
- Privacy-friendly measurement of portfolio effectiveness.
- A live demonstration of the owner's backend engineering (the portfolio's own API and infrastructure).
- Deployment, monitoring, and backups for the platform.

### 5.2 Out of scope

- Public user accounts, comments, or community features.
- E-commerce, payments, or paid content. The base code's payment and wallet modules stay disabled.
- A multi-author CMS or publishing workflow for other people.
- A native mobile app.
- Hosting or exposing any proprietary code from employers or clients.

## 6. Business requirements

Priority uses **MoSCoW**: Must, Should, Could, Won't (this release).

| ID | Requirement | Priority | Objectives |
|---|---|---|---|
| **BR-01** | A visitor must understand **who Kareem is, what role he targets, his location, and that he is open to relocation** within the first screen, without scrolling. | Must | BO-1, BO-3 |
| **BR-02** | The portfolio must present **selected projects as case studies** that explain the problem, Kareem's role, the backend architecture, and the outcome, with links to the live apps where public. | Must | BO-1, BO-2 |
| **BR-03** | Case-study content must be **confidentiality-safe**: no proprietary source code, credentials, internal data, or client details without permission. | Must | BO-2 |
| **BR-04** | The portfolio must present **experience, skills, education, and certificates** consistent with the current CV. | Must | BO-1 |
| **BR-05** | Visitors must be able to **download the current CV** in one action from any page. | Must | BO-1 |
| **BR-06** | Visitors must be able to **contact Kareem with low friction**, and Kareem must be notified reliably within minutes. | Must | BO-4 |
| **BR-07** | The portfolio must **demonstrate backend expertise live**: real API responses, real-time behavior, and system health that a technical visitor can inspect. | Must | BO-2 |
| **BR-08** | The owner must be able to **update all content without code changes or redeploys**, and changes must appear publicly within minutes. | Must | BO-5 |
| **BR-09** | The site must be available in **English and Arabic**, with correct right-to-left presentation. | Should | BO-1, BO-4 |
| **BR-10** | The portfolio must be **fully discoverable and indexable by search engines** and produce **rich previews when shared** (LinkedIn, WhatsApp, X). | Must | BO-1, BO-4, BO-6 |
| **BR-11** | The owner must be able to **measure effectiveness** (visits, CV downloads, case-study views, contact submissions) **without invasive tracking**. | Should | BO-1, BO-4 |
| **BR-12** | The experience must reflect the **METRIAL brand identity** (gold on charcoal, M mark, "Build · Solve · Scale"). | Must | BO-3 |
| **BR-13** | The site must be **fast and accessible on mobile** and on low-end devices, including for users who prefer reduced motion. | Must | BO-1 |
| **BR-14** | The platform must **protect the owner's privacy and inbox**: spam resistance, and personal details (such as the phone number) hidden unless deliberately enabled. | Must | BO-4, BO-5 |
| **BR-15** | The public site must **stay readable if the backend is unavailable**, serving the last known content. | Must | BO-1, BO-2 |
| **BR-16** | The owner should be able to **publish technical articles** (English and Arabic) to build authority and rank for long-tail backend topics. | Should | BO-2, BO-4, BO-6 |
| **BR-17** | The portfolio could show **live GitHub activity** as ongoing evidence of engineering work. | Could | BO-2 |
| **BR-18** | The portfolio must **rank first on Google for the owner's name, brand, and role queries** (for example "Karem Metrial", "Kareem Sabry backend developer", "كريم صبري مطور"), and be built and operated to compete for the name alone ("Kareem Sabry"). Strategy and targets: [SEO.md](SEO.md). | Must | BO-6 |

## 7. Success measures

Measured through the analytics required by BR-11. Where no baseline exists, the first 30 days after
launch set the baseline, and the owner then fixes numeric targets.

| Measure | Definition | Target |
|---|---|---|
| Launch readiness | All `Must` requirements accepted | 100% at v1.0 launch |
| Content freshness | Time from saving a change in the admin to it appearing on the public site | ≤ 5 minutes |
| Mobile quality | Lighthouse (mobile) Performance, Accessibility, Best Practices, SEO on Home and a case study | Each ≥ 95 |
| Contact reliability | Valid contact submissions that reach the owner | 100%, with notification ≤ 2 minutes |
| Spam exposure | Spam submissions that reach the owner's inbox | < 5% of submissions |
| Engagement | CV downloads, case-study views, contact submissions per month | Baseline in 30 days, then owner sets targets |
| Outcome | Interview invitations or opportunities attributed to the portfolio | Tracked manually by the owner each month |
| Availability | Public site availability per month | ≥ 99.5% |
| Brand search rank | Google position for "Karem Metrial" and "Kareem Sabry backend developer" | #1 within 90 days of indexing |
| Name search rank | Google position for "Kareem Sabry" alone | Top 3 within 90 days; #1 is a 6-month stretch goal |
| Indexing | Public pages indexed in Google Search Console | 100% |
| Search growth | Organic impressions and clicks from Search Console | Baseline in 30 days, then month-over-month growth |

## 8. Constraints

- **C-1 Solo developer.** Kareem builds and operates everything, so scope must allow an early MVP launch.
- **C-2 Low running cost.** Hosting must fit a personal budget: a single small VPS and/or free-tier frontend hosting.
- **C-3 Reuse existing assets.** Backend: the existing *Metrial Base Code* (Laravel 12). Frontend: the existing Next.js 16 app. Brand: the METRIAL identity sheet and the generated icons.
- **C-4 Truthfulness.** Every claim, metric, and date shown must trace to the CV or another verifiable source. No invented numbers.
- **C-5 Confidentiality.** Employer and client projects follow BR-03.

## 9. Assumptions

- **A-1** The CV dated 2026 (`images/Kareem_Sabry_Backend_Software_Engineer_CV.pdf`) is the source of truth for initial content.
- **A-2** The Play Store links on the CV are public and may be shown.
- **A-3** Kareem will provide or approve Arabic copy.
- **A-4** A custom domain will be purchased before launch.
- **A-5** Audiences arrive from LinkedIn, job applications, and direct links, **and from Google searches for Kareem's name**. Recruiters and clients commonly search a candidate's name, so search is a primary channel.

## 10. Risks

| ID | Risk | Impact | Likelihood | Mitigation |
|---|---|---|---|---|
| R-1 | Case studies reveal confidential employer details | High | Medium | Confidentiality review per project; generic architecture diagrams; get permission before showing screenshots (BR-03) |
| R-2 | Over-engineering delays launch | High | High | Ship an MVP release first; advanced "dynamic" features go in later releases (see PRD §9) |
| R-3 | Heavy animation or 3D hurts mobile performance and accessibility | Medium | Medium | Performance budgets, lazy-loaded 3D, `prefers-reduced-motion` fallbacks (BR-13) |
| R-4 | Backend outage leaves the site blank | High | Low | Cached rendering plus a bundled content snapshot (BR-15) |
| R-5 | Contact form abused by spam or bots | Medium | High | Rate limiting, honeypot, bot challenge, moderation (BR-14) |
| R-6 | Name and brand inconsistency confuses recruiters | Medium | Medium | Decide one canonical spelling before launch (Open Question Q-1) |
| R-7 | Content drifts out of date against the CV | Medium | Medium | The CV file and the site content are managed in the same admin (BR-08) |
| R-8 | "Kareem Sabry" is a common name: 90+ LinkedIn profiles and established people (a CFO, a TV journalist, an IEEE author) already rank for it | High | High | Win name + role + brand queries first; entity signals (`sameAs`, `alternateName`), profile backlinks, and articles to grow authority for the name alone ([SEO.md §2–3](SEO.md)) |
| R-9 | "Metrial" is an existing medical term (dictionaries, PubMed), so the brand alone cannot rank | Medium | High | Always pair the brand with the name or stack ("Karem Metrial", "Metrial Laravel"); prefer a name-based domain (Q-3) |
| R-10 | Google rankings cannot be guaranteed and can change | Medium | Medium | Measurable targets with monthly Search Console review; technical SEO built in from day one, not added later |

## 11. Open questions

Tracked centrally in [docs/README.md, Open questions](README.md#open-questions).

## 12. Approval

| Role | Name | Decision | Date |
|---|---|---|---|
| Owner | Kareem Sabry Elsayed | ☐ Approved ☐ Changes requested | |
