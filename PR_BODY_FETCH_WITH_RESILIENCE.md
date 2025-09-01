# PR: Centralize resilient fetch + unify API preflight/CORS

This PR centralizes a resilient fetch strategy across client and server code paths (where safe), unifies CORS/OPTIONS handling for `/api/*`, and migrates many client hooks and loader functions to use the helper.

What I changed
--------------
- Centralized `fetchWithResilience` (already present) usage in client hooks and loaders.
- Updated `middleware.ts` to handle `OPTIONS` preflight for `/api/*` and expose `ETag`/`Last-Modified` and diagnostic headers.
- Migrated monitoring & analytics sends to use `fetchWithResilience` (dynamic import used where needed to avoid bundling in environments where helper isn't available).
- Updated server-side smart loader helpers to use the helper via dynamic imports so server-side retries/timeouts are consistent.
- Kept `public/sw.js` and scripts untouched (service worker and build scripts require special handling and are intentionally deferred).

Files changed (high level)
-------------------------
- `middleware.ts`
- `src/lib/data/fetchWithResilience.ts` (helper used)
- `hooks/*` (menu, content, config, modular content hooks)
- `src/lib/data/client-loader.ts`
- `src/lib/data/cache.ts`
- `src/lib/monitoring/index.ts`
- `lib/performance.ts`
- `src/lib/content/loader.ts`
- `src/lib/data/loader.ts`
- `src/lib/data/server-loader.ts`
- `src/lib/data/loaders/BaseSmartLoader.ts`
- `components/*` (ServiceWorkerManager, PerformanceDashboard, Simple*Hours components)

Testing & build
---------------
- `npm run build` succeeded locally (with a non-blocking next-sitemap env warning during postbuild).
- `npm run test:server -- --testPathPattern=tests/api/headRoutes.server.test.ts` — passed (4/4).

Notes for reviewers
------------------
- I intentionally left `public/sw.js` and `scripts/*.mjs` unchanged.
- Dynamic imports were used in some server files to avoid bundling fetch helper in contexts where it's not desired.

Next steps (suggested)
----------------------
1. Review server-side `fetch` usage policy and decide if `fetchWithResilience` should be used for all server fetches.
2. Optionally migrate `public/sw.js` using a service-worker-compatible wrapper.
3. Run the full test-suite and triage unrelated server-test environment issues.
