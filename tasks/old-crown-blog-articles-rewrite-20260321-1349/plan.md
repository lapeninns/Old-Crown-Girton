---
task: old-crown-blog-articles-rewrite
timestamp_utc: 2026-03-21T13:49:00Z
owner: github:@maintainers
reviewers: [github:@maintainers]
risk: medium
flags: []
related_tickets: []
---

# Implementation Plan: Old Crown Blog Article Rewrite

## Objective

We will bring every blog article page into line with the Old Crown conversion revamp so each article supports discovery, trust, and a clear next step.

## Success Criteria

- [x] Every blog article page uses the refreshed conversion framing.
- [x] Article templates remain consistent across the full blog set.
- [x] Internal CTAs route readers toward menu, booking, events, or relevant support pages.
- [x] Build verification passes.

## Testing Strategy

- Production build verification
- Manual route QA when browser tooling is available

## Rollout

- Update shared article structures where possible, then handle any article-specific pages that diverge.
- Preserve article-specific metadata and schema additions while consolidating the UI shell.
