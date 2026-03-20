---
task: repo-architecture-and-design-system
timestamp_utc: 2026-03-19T16:25:22Z
owner: github:@maintainers
reviewers: [github:@maintainers]
risk: high
flags: []
related_tickets: []
---

# Implementation Checklist

## Setup

- [x] Audit content, SEO/schema, and design-system ownership
- [x] Create task folder and architecture docs
- [x] Gather parallel sub-agent findings for the three problem areas

## Core Foundations

- [x] Create shared content filesystem helpers
- [x] Align `ContentSmartLoader` and `/api/content` with server merge behavior
- [x] Introduce shared site facts module(s)
- [x] Introduce shared SEO metadata/schema helpers
- [x] Introduce shared design-system primitives

## Representative Migration

- [x] Refactor `app/layout.tsx` onto shared SEO/site facts
- [x] Refactor homepage schema usage onto shared helpers
- [x] Remove primary navbar dependence on `public/data/nav.json`
- [x] Route legacy button/card components through shared primitives
- [x] Update Tailwind content scanning to include real source directories
- [x] Remove duplicate restaurant schema injection from homepage/about/contact after layout-level schema centralization

## Verification

- [x] Review `git diff` for focused architectural changes
- [x] Re-run targeted duplication/reference searches
- [x] Record follow-up migration opportunities

## Notes

- Assumptions:
  - Full repo migration is not required in one patch as long as the shared foundations are established and representative high-value surfaces adopt them.
- Deviations:
  - Chrome DevTools MCP QA was not run in this pass because the changes were primarily architectural and metadata-oriented, and this workspace session did not include an MCP browser run. A follow-up browser verification is still recommended before release because shared button wrappers and schema wiring were touched.
  - Full repo `tsc` still fails in pre-existing test and e2e files outside this refactor, so verification focused on the touched architecture surface plus targeted linting.
  - Existing stale systems such as `components/seo/RestaurantSchema.tsx`, `public/data/*.json`, and page-local content modules were not deleted wholesale in this pass; the goal here was to centralize the main runtime paths first.

## Batched Questions

- None.
