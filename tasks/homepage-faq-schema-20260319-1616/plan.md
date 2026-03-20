---
task: homepage-faq-schema
timestamp_utc: 2026-03-19T16:16:30Z
owner: github:@maintainers
reviewers: [github:@maintainers]
risk: low
flags: []
related_tickets: []
---

# Implementation Plan: Homepage FAQ Schema

## Objective

We will add a homepage `FAQPage` JSON-LD block so AI search engines and traditional search engines can parse concise answers to common customer questions about The Old Crown Girton.

## Success Criteria

- [ ] Homepage renders a `FAQPage` JSON-LD schema block.
- [ ] The schema contains 8-10 relevant customer questions.
- [ ] Answers reflect repo-backed business facts for hours, bookings, cuisine, and amenities.
- [ ] Existing homepage schema flow remains intact.

## Architecture & Components

- `app/page.tsx`
  - Define homepage FAQ questions and answers.
  - Generate a `FAQPage` schema object.
  - Append the FAQ schema to the homepage `schemaEntries` passed into `renderSchemaTags`.
- `config/restaurant.json`
  - Reuse as the source of truth for hours and contact details; no file changes required.

## Data Flow & API Contracts

- No API contract changes.
- The homepage server component will emit one additional JSON-LD script in the rendered HTML.

## UI/UX States

- Not applicable; this is a non-visual metadata enhancement.

## Edge Cases

- Ensure FAQ answers do not contradict route-level content such as takeaway and booking pages.
- Keep the schema homepage-only so global layout metadata does not duplicate FAQ entries on every route.

## Testing Strategy

- Inspect `app/page.tsx` for correct JSON-LD structure.
- Search for the injected FAQ questions to confirm only homepage code owns them.
- Post-deploy recommendation: validate the homepage in Google Rich Results Test.

## Rollout

- No feature flag required.
- Deploy normally.
- After deployment, validate rich results and monitor indexation/citation behavior.
