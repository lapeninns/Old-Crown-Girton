---
task: seo-geo-editorial-rollout
timestamp_utc: 2026-03-20T10:42:00Z
owner: github:@maintainers
reviewers: [github:@maintainers]
risk: medium
flags: []
related_tickets: []
---

# Verification Report

## Manual QA — Chrome DevTools (MCP)

Tool: Chrome DevTools MCP

Status: Not run in this session.

- This rollout was primarily metadata/schema and page-signal work with no intentional visual redesign.
- Chrome DevTools MCP remains unavailable in this environment, so I used CLI verification instead and recorded the follow-up validation still needed.

## Test Outcomes

- [x] `git diff --check` passed for all rollout files.
- [x] Targeted `next lint` passed for the rollout-clean helper/page subset:
  - `libs/seo.tsx`
  - `src/lib/seo/metadata.ts`
  - `src/lib/seo/schema.ts`
  - `src/lib/site/editorial.ts`
  - `app/blog/page.tsx`
  - `app/press/page.tsx`
  - `app/events/page.tsx`
  - `app/menu/page.tsx`
  - `app/takeaway-menu/page.tsx`
  - all blog article pages
- [x] `npm run build` passed, including type checking and sitemap generation.
- [ ] Full touched-file lint set is not yet clean because of pre-existing issues in:
  - `app/privacy-policy/page.tsx`
  - `app/tos/page.tsx`
  - `app/wakes-menu/page.tsx`
  - `app/menu-information/page.tsx`

## Artifacts

- Checks: `artifacts/checks.md`

## Known Issues

- Legacy lint debt remains in older page bodies unrelated to the new SEO/GEO helper layer.
- External validation is still recommended:
  - Google Rich Results Test
  - Google Search Console inspection
  - Bing Webmaster Tools, including AI Performance for cited-page monitoring
  - Optional IndexNow/Bing Places operational setup if the team wants the next GEO pass

## Sign-off

- [x] Engineering
- [ ] Design/PM
- [ ] QA
