---
task: old-crown-blog-articles-rewrite
timestamp_utc: 2026-03-21T13:49:00Z
owner: github:@maintainers
reviewers: [github:@maintainers]
risk: medium
flags: []
related_tickets: []
---

# Research: Old Crown Blog Article Rewrite

## Requirements

- Functional:
  - Rewrite every public blog article page so the article layer matches the new conversion-focused site direction.
  - Keep article routes intact.
  - Preserve SEO structure, article metadata, and internal linking value where possible.
- Non-functional (a11y, perf, security, privacy, i18n):
  - Preserve semantic article structure and keyboard accessibility.
  - Avoid unnecessary component churn if a shared template can be improved once.
  - Keep static rendering and metadata behavior stable.

## Existing Patterns & Reuse

- Every article route previously duplicated the same scaffold: breadcrumb, article header, hero image, prose body, tags, author bio, one CTA block, and back link.
- The main variation between articles lived in content, metadata, FAQ schema, and a few article-specific schema additions such as `Recipe` or `HistoricalPlace`.
- A shared article shell offered the best leverage because it allowed all ten article pages to gain the same improved hierarchy and conversion structure at once while preserving route-specific SEO metadata and body copy.

## Constraints & Risks

- Article routes already rank for different intents, so URLs, metadata paths, and schema semantics needed to remain stable.
- Some pages used slightly different wrappers or extra schema types, so the shared template needed to stay flexible enough for FAQs, external press references, recipe schema, and heritage schema.
- Manual route QA still matters because article pages depend heavily on typography, rhythm, sticky sidebars, and CTA placement.

## Recommended Direction (with rationale)

- Replace duplicated article scaffolding with a shared article-page component.
- Keep each page's unique metadata, HTML body, and schema blocks, but add tailored conversion cards and stronger next-step framing per article.
- Use article-specific CTA intent so food, heritage, press, student, sports, and dog-friendly posts each route users toward the most relevant Old Crown action.
