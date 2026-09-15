# Metrial Portfolio: web app

Next.js 16 frontend for Kareem Sabry's portfolio. Requirements live in
[`docs/SRS-frontend.md`](../docs/SRS-frontend.md) and the build order in
[`docs/plan-frontend.md`](../docs/plan-frontend.md).

> This Next.js version differs from older releases (`proxy.ts`, Cache Components).
> Read the matching guide in `node_modules/next/dist/docs/` before changing a feature.

## Develop

```bash
cp .env.example .env.local
npm install
npm run dev          # http://localhost:3000 (English) and /ar (Arabic)
```

## Checks

| Command                             | What it runs                                                |
| ----------------------------------- | ----------------------------------------------------------- |
| `npm run lint`                      | ESLint                                                      |
| `npm run format:check`              | Prettier                                                    |
| `npm run typecheck`                 | Route type generation + `tsc --noEmit`                      |
| `npm test`                          | Vitest unit tests (`tests/unit`)                            |
| `npm run build && npm run test:e2e` | Playwright + axe against the production build (`tests/e2e`) |

First e2e run: `npx playwright install chromium`.

## Routing

English is served at the root and Arabic under `/ar`; internally both render from `app/[lang]`.
`proxy.ts` rewrites unprefixed paths to `/en`, 308-redirects `/en/*` to the unprefixed URL, and never
redirects based on browser language (an Arabic-preferring visitor sees a banner instead).
The decision logic is in `lib/i18n/routing.ts`.
