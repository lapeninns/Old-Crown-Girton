---
task: old-crown-search-console-seo-geo
timestamp_utc: 2026-03-21T14:03:00Z
owner: github:@maintainers
reviewers: [github:@maintainers]
risk: medium
flags: []
related_tickets: []
---

# Research: Old Crown Search Console SEO + GEO

## Requirements

- Functional:
  - Analyze the supplied Google Search Console exports.
  - Improve geo/local SEO, search intent coverage, and ranking support.
  - Reduce cognitive load and make conversion paths easier.
- Non-functional (a11y, perf, security, privacy, i18n):
  - Keep information architecture simple and scan-friendly.
  - Preserve build stability and accessibility.
  - Prefer targeted changes over broad content churn.

## Existing Patterns & Reuse

- Search Console shows strong branded demand for `old crown girton` and `old crown girton menu`, which means the brand is already findable when intent is explicit.
- Several secondary pages already rank well enough to earn impressions, especially `/about`, `/contact`, `/events`, and `/takeaway-menu`, but their CTR is extremely weak.
- The current site already contains strong local proof points to reuse: Girton location, Cambridge proximity, free parking, Nepalese plus pub-classic menu, family/dog friendliness, and private hire/wakes support.
- The article and page revamp work already improved conversion hierarchy, so this pass could focus on technical normalization, metadata, schema, and navigation clarity rather than another broad redesign.

## Constraints & Risks

- Search Console page data shows the homepage split between `http://www.oldcrowngirton.com/` and `https://oldcrowngirton.com/`, which points to host/canonical fragmentation and risks authority dilution.
- High-impression low-CTR pages may be surfacing for broad or sitelink-like intent, so changes need to make the snippet promise more specific and more locally relevant rather than more verbose.
- Browser QA is still important because reducing cognitive load is partly about scanability and click friction, not only metadata.

## Recommended Direction (with rationale)

- Normalize the domain with redirects so `www/http` traffic consolidates to `https://oldcrowngirton.com`.
- Tighten page titles, descriptions, and FAQ schema on high-impression pages around local intent and practical decision triggers such as parking, directions, group bookings, and takeaway collection.
- Simplify top-level navigation to keep the highest-conversion routes prominent and reduce decision load.

## Search Console Findings

- Date range: last 28 days in the supplied exports.
- Total clicks in `Chart.csv`: 1,196.
- Total impressions in `Chart.csv`: 6,360.
- Device skew:
  - Mobile: 896 clicks / 4,670 impressions / 19.19% CTR / 8.2 position
  - Desktop: 259 clicks / 1,542 impressions / 16.8% CTR / 9.84 position
- Top page split:
  - `http://www.oldcrowngirton.com/`: 695 clicks / 3,871 impressions
  - `https://oldcrowngirton.com/`: 280 clicks / 3,880 impressions
- High-impression low-CTR pages:
  - `/about`: 1,688 impressions / 0.3% CTR / position 3.87
  - `/contact`: 1,495 impressions / 0.67% CTR / position 2.96
  - `/takeaway-menu`: 1,326 impressions / 1.06% CTR / position 2.75
  - `/events`: 1,022 impressions / 0.1% CTR / position 3.34
- Useful non-brand/local queries already present:
  - `restaurants near me`
  - `nepalese restaurant cambridge`
  - `girton pub`
  - `pubs in girton`
  - `pubs in girton cambridge`
