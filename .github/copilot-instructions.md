<!-- .github/copilot-instructions.md - guidance for AI coding agents -->
# Quick repo orientation for AI coding agents

This repository is a Next.js (app router) site focused on a restaurant site with a centralized JSON-based CMS and typed data loaders. Below are concise, actionable notes to help you be productive immediately.

Key facts
- Framework: Next.js 14 (app router) with React 18. See `next.config.js` and `app/layout.tsx`.
- Data model: Content, menu, and configuration are JSON files validated at runtime with Zod. Look under `config/*`, `menu/*`, and `src/lib/data` for loaders/schemas.
- Runtime: The app supports loading JSON from `process.env.NEXT_PUBLIC_DATA_BASE_URL` or `public/data`. See `README.md` and `src/lib/data/*` for loader logic.
- Tests: Jest (multi-project: `server` & `client`) and Playwright for E2E. Top-level scripts in `package.json` (e.g. `npm run test`, `npm run e2e`).

Where to look first (fast paths)
- App entry/layout: `app/layout.tsx` — global providers (Loading, ServiceWorker), small server-injected scripts for test stability.
- Data loaders & hooks: `src/lib/data/loader.ts`, `src/lib/data/loaders/`, `src/lib/data/hooks/*` — central place for fetching/validating menu/content/restaurant data.
- Schemas: `src/lib/data/schemas` (used across loaders and components) — trust these when creating or validating fixtures.
- Menu components: `src/components/menu/*` (example: `Menu.tsx`) — typical client components using `useMenu`/Menu model.
- Config & content: top-level `config/` (e.g. `content.json`, `restaurant.json`, `marketing.json`) — canonical source of copy and labels.

Important patterns and conventions
- Centralized JSON CMS: content and site data are authored as JSON and validated with Zod at runtime. Prefer adding types to `types/` and schemas under `src/lib/data/schemas` when introducing new content.
- Hooks vs loaders: Server-side code calls the loader functions (`getContentData`, `getMenuData`) from `src/lib/data/loader.ts` / `server-loader.ts`. Client code should prefer the exported hooks in `src/lib/data/hooks` (e.g. `useMenu`, `useContentSmart`). Keep server-only imports under `/app` server components or API routes.
- Backwards compatibility: Several hooks/export names are preserved for compatibility (see `src/lib/migration/adapter.ts` and `src/lib/data/hooks/index.ts`). When refactoring, preserve re-exports to avoid breaking tests/pages.
- Tests split: Jest runs two projects (server and client). Use `npm run test:server` to run server tests and `npm run test:client` for client tests. Playwright expects a running dev server; `playwright.config.ts` uses `npm run dev`.
- Images: component-scoped images live in `src/assets/images/components/...`. Run `npm run images:analyze` and `npm run images:optimize` for image tasks.

Build & dev workflows (explicit commands)
- Start dev server: `npm run dev` (next dev) — used by Playwright and local debugging.
- Build for production: `npm run build` (also runs `next-sitemap` in `postbuild`).
- Run full test suite: `npm test` (Jest). For CI-like run: `npm run test:ci`.
- E2E: `npm run e2e` (ensure `npm run e2e:install` run once to install browsers).

Code-style and linting
- ESLint is configured but `ignoreDuringBuilds: true` in `next.config.js` (intentional). Still prefer to run `npm run lint` locally.
- Tailwind + PostCSS are used (`tailwind.config.js`, `postcss.config.js`). Follow existing utilities/variants in `components/` and `design-system/`.

Common pitfalls and rules for edits
- Respect data-loading boundaries: do not import `src/lib/data/server-loader.ts` into client components. Use the client hooks exported from `src/lib/data/hooks` instead.
- When changing JSON shapes, update Zod schemas in `src/lib/data/schemas` and any TypeScript types in `types/` to keep runtime validation and tests consistent.
- Keep migration adapters intact (`src/lib/migration/adapter.ts`) when introducing breaking changes — they preserve backwards compatibility with older pages/tests.
- Avoid editing `app/layout.tsx` scripts that inject pre-hydration behavior unless tests require it; these scripts work around non-hydrated interactions in Playwright tests.
- Dynamic imports for optional dependencies: Use `import('package' as any)` for packages that may not have TypeScript definitions (e.g., `artillery` in performance tests). This prevents build failures when optional dev dependencies aren't properly typed.

Examples (copy/paste friendly)
- Use menu hook in client component (pattern):
  - Import: `import { useMenu } from '@/src/lib/data/hooks';`
  - Pattern: `const { data: menu, error, loading } = useMenu();`

- Call server loader in server route/page:
  - `import { getMenuData } from '@/src/lib/data/loader';`
  - `const menu = await getMenuData();`

Files to reference when working on data/features
- `src/lib/data/loader.ts` and `src/lib/data/server-loader.ts`
- `src/lib/data/loaders/*` (MenuSmartLoader, ContentSmartLoader)
- `src/lib/data/hooks/*` & `src/lib/migration/adapter.ts`
- `config/content.json`, `menu/*.json`, `config/*.json`

If you modify tests or add data fixtures
- Add fixtures under `test/` or `__tests__/` to match the Zod schemas. Run `npm run test:client` / `npm run test:server` locally; `npm run test:ci` for CI-parity.

When in doubt
- Search for `getContentData` / `useContent` / `useMenu` to find canonical callsites.
- Prefer small, incremental changes; run the focused tests (`npm run test:server` or `npm run test:client`) to validate.

Questions for the repo owner
- Any special CI secrets or environment variables besides `NEXT_PUBLIC_DATA_BASE_URL` and `PW_BASE_URL` we should expect? Document them here to avoid flaky tests.

-- End of guidance
