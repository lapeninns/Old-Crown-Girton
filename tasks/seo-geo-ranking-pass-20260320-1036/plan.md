---
task: seo-geo-ranking-pass
timestamp_utc: 2026-03-20T10:36:07Z
owner: github:@maintainers
reviewers: [github:@maintainers]
risk: medium
flags: []
related_tickets: []
---

# Implementation Plan: SEO, GEO, and Ranking Improvements

## Objective

We will strengthen the Old Crown site’s technical SEO and entity clarity so that traditional search engines and AI-assisted answer systems can better understand, crawl, and present the business and its key pages.

## Success Criteria

- [ ] Global metadata defaults include stronger robots and social-preview settings.
- [ ] Sitewide schema includes organization and website identity in addition to the restaurant entity.
- [ ] Important commercial pages have explicit page-level schema where missing.
- [ ] `robots.ts` and `sitemap.ts` reflect the real public page inventory.
- [ ] The touched SEO surfaces lint/build cleanly.

## Architecture & Components

- `src/lib/site/site.ts`
  - Extend canonical business facts as needed for schema and metadata reuse.
- `src/lib/seo/metadata.ts`
  - Improve default robots/open graph/twitter/publisher handling.
- `src/lib/seo/schema.ts`
  - Add reusable `Organization`, `WebSite`, and `WebPage` schema builders.
- `app/layout.tsx`
  - Render richer sitewide schema stack.
- `app/about/page.tsx`, `app/contact/page.tsx`, `app/book-a-table/page.tsx`, `app/page.tsx`
  - Add or strengthen page-level schema where it materially improves entity understanding.
- `app/robots.ts`, `app/sitemap.ts`
  - Align crawl and discovery declarations with real routes.

## Data Flow & API Contracts

- No API changes.
- No content-model changes.
- All SEO signals derive from existing first-party facts and page metadata.

## UI/UX States

- No intended user-facing visual redesign.
- Search snippets, previews, crawl behavior, and structured data are the primary outcomes.

## Edge Cases

- Keep canonical URLs accurate and relative-path handling intact.
- Avoid claiming unsupported structured data types or properties.
- Do not add `SearchAction` unless a true site search endpoint exists.

## Testing Strategy

- Run targeted lint on touched SEO files and pages.
- Run a production build to validate metadata/schema compilation.
- Document the lack of browser/Search Console/Rich Results Test validation if those tools are unavailable in this environment.

## Rollout

- No feature flag required.
- Land sitewide SEO/GEO improvements together so crawl/index/entity signals stay coherent.
