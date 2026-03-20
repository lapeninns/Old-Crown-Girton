---
task: localbusiness-schema-and-ai-robots
timestamp_utc: 2026-02-11T16:00:16Z
owner: github:@amankumarshrestha
reviewers: [github:@maintainers]
risk: low
flags: []
related_tickets: []
---

# Implementation Plan: Homepage LocalBusiness Schema + AI Crawler Access

## Objective

We will expose explicit structured business data and AI crawler policies so search engines and AI assistants can index authoritative restaurant details and crawl non-sensitive pages.

## Success Criteria

- [ ] `Restaurant` JSON-LD present in rendered HTML head.
- [ ] `/robots.txt` contains requested AI crawler blocks.
- [ ] Existing Semrush/Ahrefs/MJ12 blocks are preserved.

## Architecture & Components

- `app/layout.tsx`: inject one JSON-LD `<script type="application/ld+json">` in `<head>`.
- `app/robots.ts`: extend robots rules with AI bots and restricted paths.
- `public/robots.txt`: keep static text aligned with dynamic robots policy.

## Data Flow & API Contracts

- No API contract changes.

## UI/UX States

- Not applicable (non-visual metadata update).

## Edge Cases

- Route-level schema scripts may coexist with global schema; JSON-LD consumers should handle multiple blocks.

## Testing Strategy

- Manual inspection of rendered HTML for JSON-LD script.
- Manual inspection of generated `/robots.txt` content.
- Rich Results validation using Google tester.

## Rollout

- No feature flag required.
- Deploy normally.
- Post-deploy: request recrawl in Google Search Console.

## DB Change Plan (if applicable)

- Not applicable.
