---
task: seo-geo-ranking-pass
timestamp_utc: 2026-03-20T10:36:07Z
owner: github:@maintainers
reviewers: [github:@maintainers]
risk: medium
flags: []
related_tickets: []
---

# Research: SEO, GEO, and Ranking Improvements

## Requirements

- Functional:
  - Strengthen the site-level SEO foundation across metadata, schema, crawlability, and sitemap coverage.
  - Improve entity clarity for search engines and AI-driven answer systems using explicit organization/business/page signals.
  - Fix inaccurate crawl/indexing declarations where the current config does not match real routes.
- Non-functional (a11y, perf, security, privacy, i18n):
  - Keep changes standards-based and framework-native.
  - Avoid speculative, non-standard “AI SEO” hacks.
  - Preserve existing page behavior and content contracts.

## Existing Patterns & Reuse

- `src/lib/site/site.ts` is already the best single source of truth for business identity, contact data, geo, and hours.
- `src/lib/seo/metadata.ts` already centralizes metadata generation.
- `src/lib/seo/schema.ts` already centralizes restaurant, FAQ, and breadcrumb schema helpers.
- `app/robots.ts` and `app/sitemap.ts` already exist but have coverage and accuracy gaps.

## External Resources

- [Google Search Central: Creating helpful, reliable, people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
  - Confirms that AI/search visibility still depends on useful, people-first, crawlable content.
- [Google Search Central: Intro to structured data](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)
  - Reinforces that complete, valid structured data improves eligibility for richer search treatments.
- [Google Search Central: Google Images best practices](https://developers.google.com/search/docs/advanced/guidelines/google-images)
  - Relevant for richer previews and image discoverability.
- [Bing Webmaster Guidelines](https://www.bing.com/webmasters/help/webmasters-guidelines-30fba23a)
  - Useful cross-engine confirmation for crawlability, quality, and markup basics.

## Constraints & Risks

- The repo is already dirty; do not disturb unrelated in-progress changes.
- GEO is still best served by clear entity data, crawlable pages, and strong first-party content, not by non-standard files.
- Some deeper ranking improvements are off-site or content-strategy work and cannot be fully solved in code alone.

## Open Questions (owner, due)

- Q: Should a later pass create article/page schema helpers to consolidate the many inline blog schemas?
  A: Yes, but this pass should focus first on the shared sitewide layer and highest-leverage pages.

## Recommended Direction (with rationale)

- Strengthen the global metadata builder with richer default robots, publisher, and social-preview settings.
- Expand schema coverage to include `Organization`, `WebSite`, and reusable `WebPage` schemas alongside the existing restaurant schema.
- Fix `robots.ts` so it reflects real public URLs rather than stale or nonexistent ones.
- Expand `sitemap.ts` coverage to include the full set of indexable marketing/menu pages and the missing blog entries.
- Add page-level web page schema and breadcrumbs to important commercial pages like `book-a-table`.
