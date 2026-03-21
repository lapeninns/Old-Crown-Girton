---
task: old-crown-thread-reinstatement
timestamp_utc: 2026-03-21T17:03:00Z
owner: github:@maintainers
reviewers: [github:@maintainers]
risk: medium
flags: []
related_tickets: []
---

# Implementation Plan: Old Crown Thread Reinstatement

## Objective

We will restore the agreed Old Crown conversion, content, and SEO revamp across the public funnel so that the live code matches the decisions made in this thread.

## Success Criteria

- [ ] Homepage and main funnel pages match the agreed conversion-first structure.
- [ ] Shared navigation and footer surfaces support booking, takeaway, and contact clearly.
- [ ] Blog index and article pages use the rewritten, conversion-aware templates.
- [ ] Key SEO/GEO metadata and FAQ schema are present.
- [ ] Production build passes.

## Architecture & Components

- Reuse existing page files and shared home/blog components.
- Reuse task-folder notes as source of truth for intended copy direction.
- Keep changes focused to public marketing pages and shared conversion surfaces.

## Data Flow & API Contracts

- No API contract changes planned.

## UI/UX States

- Loading / Empty / Error / Success states remain as implemented in existing components.
- Focus on content hierarchy, CTA clarity, and lower cognitive load.

## Edge Cases

- Some pages may already contain partial revamp work.
- Existing user changes in touched files must be preserved where compatible.

## Testing Strategy

- Production build
- Manual spot-check via code review in this session
- Manual browser QA remains pending outside session

## Rollout

- No feature flag
- Immediate code restoration in current branch
- Monitoring via build success; manual browser QA still required
