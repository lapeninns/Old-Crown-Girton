---
task: search-console-coverage-remediation
timestamp_utc: 2026-03-24T21:14:00Z
owner: github:@openai
reviewers: [github:@maintainers]
risk: medium
flags: []
related_tickets: []
---

# Implementation Plan: Search Console Coverage Remediation

## Objective

We will remove conflicting crawl-control outputs and explicitly noindex internal utility routes so that search engines only see the intended public marketing pages.

## Success Criteria

- [ ] The app has one authoritative robots/sitemap implementation.
- [ ] Internal utility/debug pages are explicitly non-indexable.
- [ ] Production build succeeds without generating legacy sitemap or robots files.

## Architecture & Components

- `app/robots.ts`: remains the canonical robots policy.
- `app/sitemap.ts`: remains the canonical sitemap source.
- `package.json`: stop invoking `next-sitemap` after build.
- `app/offline/page.tsx`, `app/not-found.tsx`: keep `noindex` but remove canonicals.
- `app/cls-optimized/page.tsx`, `app/test-hours/page.tsx`: add explicit non-indexable metadata.
- `public/robots.txt`, `public/sitemap.xml`, `public/sitemap-0.xml`: delete stale generated outputs.

## Data Flow & API Contracts

- No API contract changes.
- Search engines should request metadata from framework routes rather than stale static artifacts.

## UI/UX States

- No intended user-facing UI changes.

## Edge Cases

- If a downstream deploy process still depends on static sitemap artifacts, build validation should catch it.
- Utility pages remain reachable for internal testing, but no longer present index signals.

## Testing Strategy

- Production build.
- Manual file inspection of crawl-control sources.

## Rollout

- No feature flag.
- Deploy normally.
- After deployment, request Search Console recrawl for sitemap/robots and monitor coverage buckets on the next crawl cycle.
