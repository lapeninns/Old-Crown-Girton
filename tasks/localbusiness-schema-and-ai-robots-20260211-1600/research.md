---
task: localbusiness-schema-and-ai-robots
timestamp_utc: 2026-02-11T16:00:16Z
owner: github:@amankumarshrestha
reviewers: [github:@maintainers]
risk: low
flags: []
related_tickets: []
---

# Research: Homepage LocalBusiness Schema + AI Crawler Access

## Requirements

- Functional:
  - Add `Restaurant` JSON-LD schema markup for The Old Crown Girton to homepage head.
  - Add explicit AI crawler directives for GPTBot, ChatGPT-User, ClaudeBot, anthropic-ai, and PerplexityBot.
  - Keep existing blocks for SemrushBot, AhrefsBot, and MJ12bot.
- Non-functional (a11y, perf, security, privacy, i18n):
  - No user-facing UI behavior changes.
  - Keep implementation low overhead (single inline JSON-LD script).
  - Preserve robots restrictions for admin/API paths.

## Existing Patterns & Reuse

- `app/layout.tsx` already controls the HTML `<head>` and is the canonical place for global head tags.
- `app/robots.ts` is the canonical robots definition in Next.js app router.
- `public/robots.txt` exists as static fallback/document parity and should be kept consistent.

## External Resources

- [Google Rich Results Test](https://search.google.com/test/rich-results) — validate JSON-LD eligibility.

## Constraints & Risks

- Adding JSON-LD in `app/layout.tsx` places schema in head across routes, not only `/`.
- Dynamic robots route (`/robots.txt`) from `app/robots.ts` takes precedence in production over static file.

## Open Questions (owner, due)

- Q: Should LocalBusiness schema be scoped strictly to homepage route only using route-segment head?
  A: Deferred; current implementation uses global head for guaranteed head placement.

## Recommended Direction (with rationale)

- Add requested JSON-LD directly in `<head>` via `app/layout.tsx` to satisfy explicit head injection.
- Update `app/robots.ts` as source-of-truth for crawler policy and mirror to `public/robots.txt` for consistency.
