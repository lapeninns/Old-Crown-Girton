# Changes: Fetch resiliency and API guardrails

Summary
-------
- Centralized resilient fetch usage across client and server where safe by adopting `fetchWithResilience`.
- Centralized CORS/OPTIONS handling already applied in `middleware.ts` (exposes `ETag`, `Last-Modified`, and other diagnostic headers).
- Migrated client hooks, client loader, cache warmups, monitoring/analytics send flows, and selected server smart loaders to use `fetchWithResilience`.
- Validated HEAD-route behavior with focused tests and ensured build succeeds.

Files changed (high level)
-------------------------
- `middleware.ts` — unified CORS/OPTIONS handling (earlier change).
- `src/lib/data/fetchWithResilience.ts` — existing resilient fetch helper (used by many modules).
- Client-side and shared code migrated to use helper:
  - `hooks/*` (menu, content, config, modular content hooks)
  - `src/lib/data/client-loader.ts`
  - `src/lib/data/cache.ts` (warmup)
  - `components/*` (opening hours, footer hours, performance dashboard, ServiceWorkerManager)
  - `app/*/_content/*` content hooks
  - `lib/performance.ts` (analytics send; dynamic import to avoid bundling)
  - `src/lib/monitoring/index.ts` (monitoring sends and health checks)
  - `src/lib/content/loader.ts` (content manifest/modules fetching — dynamic import)
  - `src/lib/data/loader.ts` and `src/lib/data/server-loader.ts` (server smart loaders now use `fetchWithResilience` via dynamic import)
  - `src/lib/data/loaders/BaseSmartLoader.ts` (internal fetchWithRetry now delegates to `fetchWithResilience`)

Tests and build
---------------
- Ran `npm run build` — build completed successfully (noting a non-blocking `next-sitemap` environment warning during postbuild).
- Ran focused HEAD tests: `npm run test:server -- --testPathPattern=tests/api/headRoutes.server.test.ts` — all tests passed (4/4).

Remaining items / deferred
--------------------------
- `public/sw.js` (service worker) — uses `fetch()` in service worker context; intentionally not migrated because the helper is not suitable for service worker runtime.
- `scripts/*.mjs` (verify/check links) — Node scripts using `fetch`; left unchanged for now. They can be migrated later if desired to a Node-compatible helper or by exporting a Node-friendly wrapper.
- Some server-only loader files were carefully migrated; if you prefer, we can migrate additional server fetch sites, but I avoided changing service-worker/build scripts and any fetch usage tightly coupled to Node-only APIs.

How to verify locally
----------------------
1. Build the project:

```bash
npm run build
```

2. Run focused tests for HEAD routes:

```bash
npm run test:server -- --testPathPattern=tests/api/headRoutes.server.test.ts
```

3. Optionally run other test suites as needed; note that some server tests earlier failed due to test-environment fs/mock ordering unrelated to these changes.

Next recommended steps
----------------------
1. Prepare a PR branch and include this file and `PR_BODY.md` (created alongside) as the PR description.
2. Review `public/sw.js` and `scripts/*.mjs` if you want to migrate them (special handling required).
3. Optionally run the full test suite and triage unrelated test environment issues.

Contact
-------
If you want me to prepare the PR branch and open a PR body, tell me and I'll create a branch, commit the changes, and produce the PR description ready for copy/paste.
