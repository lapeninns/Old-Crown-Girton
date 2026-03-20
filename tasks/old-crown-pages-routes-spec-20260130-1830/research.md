---
task: old-crown-pages-routes-spec
timestamp_utc: 2026-01-30T18:34:18Z
owner: github:@amankumarshrestha
reviewers: [github:@maintainers]
risk: low
flags: []
related_tickets: []
---

# Research: Old Crown Girton — Pages & Routes Spec

## Requirements

- Functional:
  - Produce an in-depth, comprehensive Pages & Routes specification for the Old Crown Girton marketing website.
  - Include a full sitemap, per-route purpose, primary CTAs, major sections, assets, and external dependencies.
  - Capture any seasonal/temporary routes and legacy/archived pages.
  - Save as a markdown document in the repo.
- Non-functional (a11y, perf, security, privacy, i18n):
  - Document accessibility expectations (semantic structure, focus, ARIA only when needed).
  - Call out external links and booking providers.
  - Avoid embedding any secrets or private data.

## Existing Patterns & Reuse

- Repo docs contain general routing guidance (`docs/routing-conventions.md`, `docs/routing-overview.md`) but not the Old Crown marketing site map.
- `docs/WEBSITE_BLUEPRINT.md` provides prior structural patterns and can be aligned with this spec.

## External Resources

- Live site (snapshot reference): https://oldcrowngirton.com/
- Key pages (as of 2026-01-30): /menu, /menu-information, /takeaway-menu, /about, /events, /book-a-table, /press, /contact, /blog, /christmas-menu, /tos, /privacy-policy.
- Assets referenced by site: /documents/old-crown-girton-christmas-menu.pdf, /takeaway-menu/old-crown-takeaway-menu.jpg.

## Constraints & Risks

- Site content and routes may change; document snapshot date/time and note that it should be re-verified if the source changes.
- "Old"/legacy pages may be partially reachable or removed; document status where possible.

## Open Questions (owner, due)

- Q: Should the spec target the current live site or a historical/legacy version (e.g., the previous WordPress site)?
  A: UNCONFIRMED (owner: github:@amankumarshrestha, due: 2026-02-02)
- Q: Should legacy pages be rebuilt or just documented as non-canonical?
  A: UNCONFIRMED (owner: github:@amankumarshrestha, due: 2026-02-02)

## Recommended Direction (with rationale)

- Produce a comprehensive spec focused on the current live site at oldcrowngirton.com, with a separate section documenting legacy/archived routes. This aligns with the user's request to clone "old crown girton" while keeping the spec actionable for implementation and maintenance.
