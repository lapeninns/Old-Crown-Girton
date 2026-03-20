# Continuity Ledger

Last updated: 2026-03-20T11:38:00Z

## Goal (incl. success criteria)

- Strengthen SEO, GEO, and related ranking foundations so search engines and AI-driven answer systems can better crawl, understand, and present the business, its public pages, and its editorial content.
- Success: article, collection, and page signals are consistent, structured, and easier for search engines and AI systems to cite correctly.

## Constraints/Assumptions

- Follow AGENTS SDLC phases; task artifacts must exist before implementation.
- Worktree is already dirty; do not revert or disturb unrelated in-progress changes.
- Manual UI QA via Chrome DevTools MCP is required for UI changes, but this environment may require temporary fallback verification if MCP is unavailable.
- Keep this pass focused on in-repo ranking signals rather than off-site SEO or a full content rewrite.

## Key decisions

- Use `src/lib/site/site.ts`, `src/lib/seo/metadata.ts`, and `src/lib/seo/schema.ts` as the canonical SEO foundation.
- Create a new task folder at `tasks/seo-geo-editorial-rollout-20260320-1042/`.
- Prioritize shared article/collection schema, broader page metadata coverage, and editorial discoverability signals.

## State

- SEO/GEO foundation and editorial rollout are complete locally; takeaway CTA copy and CTA text-color consistency fixes are complete as well. External validation and a few legacy lint debts remain.

## Done

- Audited remaining hero/panel/button duplication across about, contact, menu, book-a-table, and shared restaurant sections.
- Created SDLC artifacts for `tasks/design-system-rollout-20260320-0012/`.
- Extended `src/design-system/recipes.ts` with page hero, panel, map, chip, and social-action recipes.
- Migrated the main shared page/section cluster onto the design system.
- Verified the rollout with targeted lint and a full production build.
- Audited the current SEO/GEO layer across metadata, structured data, robots, sitemap, and entity facts.
- Created SDLC artifacts for `tasks/seo-geo-ranking-pass-20260320-1036/`.
- Strengthened metadata defaults with richer robots and social-preview configuration.
- Added organization, website, and reusable webpage schema builders and wired them into key pages.
- Corrected robots route declarations and expanded sitemap coverage for real public pages.
- Verified the SEO/GEO pass with targeted lint and a full production build.
- Audited the remaining public pages and blog/press surfaces for the next SEO/GEO rollout.
- Created SDLC artifacts for `tasks/seo-geo-editorial-rollout-20260320-1042/`.
- Added shared page/article metadata helpers and collection/article/item-list schema builders.
- Added `src/lib/site/editorial.ts` as the shared editorial index for blog and press surfaces.
- Upgraded `/blog` and `/press` to use shared collection metadata and schema.
- Migrated all blog article pages to shared article schema helpers while preserving page-specific extras like FAQ, recipe, and historical place markup.
- Extended consistent page metadata and breadcrumb/webpage schema to `events`, `menu`, `takeaway-menu`, `wakes-menu`, `menu-information`, `privacy-policy`, and `tos`.
- Verified the rollout with `git diff --check`, clean targeted lint on the rollout subset, and a full production build.
- Created SDLC artifacts for `tasks/takeaway-cta-consistency-20260320-1103/`.
- Aligned takeaway CTA copy sources to `Call for Takeaway` across shared content, menu fallbacks, and menu hero copy.
- Verified the CTA fix with search checks, `git diff --check`, targeted lint, and a full production build.
- Created SDLC artifacts for `tasks/cta-text-color-consistency-20260320-1111/`.
- Corrected the CTA color pass so affected `Call for Takeaway` and `What's On` buttons use the light CTA treatment with brown brand text.
- Verified the corrected CTA color fix with `git diff --check`, targeted lint, and a full production build.

## Now

- Report the corrected CTA color fix and exact affected surfaces.

## Next

- Run external SEO validation in Rich Results Test, Search Console, and Bing Webmaster tools.
- Keep the broader legal/menu-page lint debt separate unless requested.

## Open questions (UNCONFIRMED if needed)

- Should a later pass wire IndexNow after operational key setup is available? (UNCONFIRMED)

## Working set (files/ids/commands)

- CONTINUITY.md
- tasks/design-system-consistency-foundation-20260319-2301/research.md
- tasks/design-system-consistency-foundation-20260319-2301/plan.md
- tasks/design-system-rollout-20260320-0012/research.md
- tasks/design-system-rollout-20260320-0012/plan.md
- tasks/design-system-rollout-20260320-0012/todo.md
- tasks/design-system-rollout-20260320-0012/verification.md
- tasks/seo-geo-ranking-pass-20260320-1036/research.md
- tasks/seo-geo-ranking-pass-20260320-1036/plan.md
- tasks/seo-geo-ranking-pass-20260320-1036/todo.md
- tasks/seo-geo-ranking-pass-20260320-1036/verification.md
- tasks/seo-geo-editorial-rollout-20260320-1042/research.md
- tasks/seo-geo-editorial-rollout-20260320-1042/plan.md
- tasks/seo-geo-editorial-rollout-20260320-1042/todo.md
- tasks/seo-geo-editorial-rollout-20260320-1042/verification.md
- tasks/seo-geo-editorial-rollout-20260320-1042/artifacts/checks.md
- tasks/takeaway-cta-consistency-20260320-1103/research.md
- tasks/takeaway-cta-consistency-20260320-1103/plan.md
- tasks/takeaway-cta-consistency-20260320-1103/todo.md
- tasks/takeaway-cta-consistency-20260320-1103/verification.md
- tasks/takeaway-cta-consistency-20260320-1103/artifacts/checks.md
- tasks/cta-text-color-consistency-20260320-1111/research.md
- tasks/cta-text-color-consistency-20260320-1111/plan.md
- tasks/cta-text-color-consistency-20260320-1111/todo.md
- tasks/cta-text-color-consistency-20260320-1111/verification.md
- tasks/cta-text-color-consistency-20260320-1111/artifacts/checks.md
- src/lib/site/site.ts
- src/lib/site/editorial.ts
- src/lib/seo/metadata.ts
- src/lib/seo/schema.ts
- src/design-system/recipes.ts
- app/blog/page.tsx
- app/press/page.tsx
- app/layout.tsx
- app/robots.ts
- app/sitemap.ts
