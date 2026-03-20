---
task: seo-geo-editorial-rollout
timestamp_utc: 2026-03-20T10:42:00Z
owner: github:@maintainers
reviewers: [github:@maintainers]
risk: medium
flags: []
related_tickets: []
---

# Research: SEO, GEO, and Editorial Discoverability Rollout

## Requirements

- Functional:
  - Consolidate article and collection structured data so blog/press coverage stops diverging page by page.
  - Expand metadata and page-level schema coverage to the remaining public routes with missing or weaker SEO signals.
  - Improve discoverability for editorial content through stronger collection schemas and consistent internal pathway signals.
- Non-functional (a11y, perf, security, privacy, i18n):
  - Preserve page behavior and avoid introducing brittle custom SEO hacks.
  - Keep changes framework-native and shared where possible.
  - Avoid touching unrelated design/content work in the already-dirty tree.

## Existing Patterns & Reuse

- `src/lib/site/site.ts` is the canonical source for business identity and origin-aware URLs.
- `src/lib/seo/metadata.ts` already centralizes metadata defaults.
- `src/lib/seo/schema.ts` already centralizes restaurant, webpage, breadcrumb, and FAQ schema helpers.
- Blog article pages follow repeated inline patterns for `metadata`, `BlogPosting`/`NewsArticle`, and `WebPage` schema that can be consolidated.
- `app/blog/page.tsx` and `app/press/page.tsx` already maintain editorial index data that can be upgraded into richer collection-level signals.

## External Resources

- [Google Search Central: Creating helpful, reliable, people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
  - Confirms that discoverability continues to depend on clear, useful, first-party content rather than shortcut GEO tactics.
- [Google Search Central: Intro to structured data](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)
  - Supports expanding valid article, breadcrumb, and webpage markup through shared helpers.
- [Google Search Central: Google Images best practices](https://developers.google.com/search/docs/advanced/guidelines/google-images)
  - Relevant because article and social previews rely on consistent, indexable image URLs and alt text.
- [Bing Webmaster Blog: Introducing AI Performance in Bing Webmaster Tools Public Preview](https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview)
  - Confirms that AI answer visibility is now observable at the cited-page level and that clarity, freshness, structure, and accurate business information remain the practical levers.

## Constraints & Risks

- The repo remains dirty; only touch files directly related to this rollout.
- Several blog pages use custom schema extras like FAQ blocks and external-source references, so the shared helper must allow extension rather than flattening those differences away.
- Chrome DevTools MCP is required for UI changes, but this environment may still require fallback verification if that tooling is unavailable.
- Some ranking levers mentioned in official guidance, like Bing Places completeness or Search Console validation, are outside the codebase and must remain documented follow-up work.

## Open Questions (owner, due)

- Q: Should we implement IndexNow in this pass?
  A: Not yet. There is no existing key/configuration in the repo, so this pass should focus on on-site signals and document IndexNow as a follow-up requiring operational setup.

## Recommended Direction (with rationale)

- Add reusable article, collection, and item-list schema builders in `src/lib/seo/schema.ts`.
- Introduce shared editorial metadata helpers so article metadata defaults, canonical handling, and social previews are generated consistently.
- Upgrade `/blog` and `/press` into proper collection pages with reusable collection schema and index data.
- Add explicit metadata and page/breadcrumb schema to remaining public routes with weaker coverage, especially `/events`, `/menu`, `/privacy-policy`, `/tos`, `/takeaway-menu`, `/wakes-menu`, and `/menu-information`.
- Reuse shared editorial index data where possible so sitemap and article discovery signals are easier to keep in sync later.
