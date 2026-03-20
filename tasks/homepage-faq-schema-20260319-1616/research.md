---
task: homepage-faq-schema
timestamp_utc: 2026-03-19T16:16:30Z
owner: github:@maintainers
reviewers: [github:@maintainers]
risk: low
flags: []
related_tickets: []
---

# Research: Homepage FAQ Schema

## Requirements

- Functional:
  - Add `FAQPage` JSON-LD to the homepage.
  - Include 8-10 common customer questions about cuisine, hours, bookings, takeaway, amenities, and location.
  - Keep answers concise, answer-first, and aligned with existing site content.
- Non-functional (a11y, perf, security, privacy, i18n):
  - No user-facing UI changes.
  - Keep the implementation lightweight with a single inline JSON-LD block.
  - Avoid unsupported claims that are not already represented in repo content.

## Existing Patterns & Reuse

- `app/layout.tsx` already injects global `Restaurant` JSON-LD.
- `app/page.tsx` already supports route-specific schema injection through `renderSchemaTags(schemaEntries)`.
- `config/restaurant.json` is the clearest repo-backed source for current phone/address/hours.
- Blog and homepage content already contain supporting facts for dog-friendly positioning, takeaway, family-friendliness, Nepalese cuisine context, free parking, and the "largest thatched pub" positioning.

## External Resources

- [Google Rich Results Test](https://search.google.com/test/rich-results) — validate the homepage schema after deployment.

## Constraints & Risks

- The homepage currently does not render a visible FAQ section, so the schema must stand on its own and not rely on visible accordion markup.
- Existing helper hour summaries in `lib/restaurantData.ts` are not a good fit for the current split kitchen schedule; FAQ copy should use the canonical values from `config/restaurant.json`.
- The worktree already contains unrelated user changes and prior cleanup deletions that must remain untouched.

## Open Questions (owner, due)

- Q: Should the same expanded FAQ also be added to shared content JSON for future visible FAQ rendering?
  A: Deferred for now to keep this change focused on homepage structured data only.

## Recommended Direction (with rationale)

- Add homepage-only `FAQPage` schema in `app/page.tsx`, appended to any existing homepage schema entries.
- Build the FAQ answers from repo-backed facts in `config/restaurant.json` plus existing homepage/blog copy, keeping the answers short and factual.
- Verify via code inspection and targeted searches, then recommend post-deploy Rich Results validation.
