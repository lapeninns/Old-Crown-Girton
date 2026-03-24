---
task: search-console-coverage-remediation
timestamp_utc: 2026-03-24T21:14:00Z
owner: github:@openai
reviewers: [github:@maintainers]
risk: medium
flags: []
related_tickets: []
---

# Research: Search Console Coverage Remediation

## Requirements

- Functional:
  - Review the supplied Search Console coverage export and identify the most likely technical causes inside the app.
  - Reduce avoidable crawl/index noise caused by stale sitemap or robots outputs.
  - Ensure utility and debug routes are not exposed as indexable pages.
- Non-functional (a11y, perf, security, privacy, i18n):
  - Keep the fix narrow and low-risk.
  - Avoid changing user-facing content or route behavior unless needed for crawl control.
  - Preserve the existing App Router metadata implementation.

## Existing Patterns & Reuse

- `app/sitemap.ts` and `app/robots.ts` already exist and should be the canonical crawl-control layer.
- `libs/seo.tsx` and `src/lib/seo/metadata.ts` already provide shared metadata helpers, including page-level `robots` control.
- Recent SEO task work already expanded route coverage in `app/sitemap.ts`, so the current problem is more likely conflicting outputs than missing SEO primitives.

## External Resources

- Search Console export snapshot dated 2026-03-24:
  - `Chart.csv`
  - `Critical issues.csv`
  - `Metadata.csv`
  - `Non-critical issues.csv`

## Constraints & Risks

- The coverage export contains category counts, not the underlying URL lists, so the remediation has to focus on the highest-confidence technical sources in the codebase.
- The repo contained committed generated crawl files under `public/`, which can drift from the App Router metadata routes and create conflicting signals.
- Utility pages such as `/offline`, `/cls-optimized`, and `/test-hours` should never become part of the indexable page set.

## Findings

- `Critical issues.csv` shows 39 indexed vs 47 not indexed pages at the latest snapshot, with the biggest buckets being:
  - `Page with redirect` — 18 pages
  - `Not found (404)` — 12 pages
  - `Crawled - currently not indexed` — 4 pages
  - `Discovered - currently not indexed` — 3 pages
- The repo included stale generated files in `public/`:
  - `public/robots.txt`
  - `public/sitemap.xml`
  - `public/sitemap-0.xml`
- Those files referenced `http://localhost:3000` and advertised non-canonical utility routes including `/offline`, `/cls-optimized`, and `/test-hours`.
- The build also ran `next-sitemap` via `postbuild`, creating a second crawl-control system alongside `app/sitemap.ts` and `app/robots.ts`.
- `/offline` and `/not-found` were already `noindex`, but still declared canonicals, which adds unnecessary canonical noise for non-indexable utility pages.
- `/cls-optimized` and `/test-hours` had no route metadata and were therefore eligible to inherit indexable defaults if discovered.

## Recommended Direction (with rationale)

- Use the App Router metadata routes as the single source of truth by removing the legacy generated `public/robots.txt` and sitemap XML files and stopping `next-sitemap` from running in `postbuild`.
- Add explicit `noindex, nofollow` metadata to internal utility/debug routes that should never enter the coverage report.
- Remove canonicals from `noindex` utility pages so Google gets a cleaner signal about what is and is not intended for indexing.
