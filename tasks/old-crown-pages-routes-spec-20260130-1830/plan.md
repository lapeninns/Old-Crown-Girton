---
task: old-crown-pages-routes-spec
timestamp_utc: 2026-01-30T18:34:18Z
owner: github:@amankumarshrestha
reviewers: [github:@maintainers]
risk: low
flags: []
related_tickets: []
---

# Implementation Plan: Old Crown Girton — Pages & Routes Spec

## Objective

We will document the full marketing-site routing surface for Old Crown Girton so the site can be replicated 1:1 with clear, implementation-ready page specs.

## Success Criteria

- [ ] A single markdown document exists in `docs/` containing the sitemap and per-route specifications.
- [ ] All current live routes (including blog post slugs and seasonal pages) are captured.
- [ ] External dependencies, assets, and booking providers are listed.
- [ ] Legacy/archived routes (if any) are documented with status notes.

## Architecture & Components (Documentation Structure)

- **Document Header**: Scope, snapshot date, base URL, canonical host notes.
- **Sitemap Overview**: Tree/list format covering public routes and assets.
- **Global Layout**: Shared header/nav/footer, CTAs, contact info, social links.
- **Route Specifications**: For each route: purpose, sections, data requirements, CTAs, SEO/meta, external links.
- **Legacy/Redirects**: Any non-canonical or removed pages.

## Data Flow & API Contracts

- N/A for this documentation-only change. Note external booking providers and downloads where relevant.

## UI/UX States

- N/A (documentation-only). Include expected empty/error states in the spec where applicable (e.g., menu loading, blog posts).

## Edge Cases

- External booking links unavailable → fallback to phone/email.
- Menu assets download unavailable → provide alternate link or inline image.

## Testing Strategy

- Doc-only: verify completeness against live site routes and assets.

## Rollout

- N/A (documentation-only). Ensure the spec is reviewed before implementation.
