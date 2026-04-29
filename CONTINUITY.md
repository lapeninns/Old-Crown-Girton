# Continuity Ledger

Last updated: 2026-04-29T18:22:32Z

## Goal (incl. success criteria)

- Replace the wakes buffet explanatory copy on `/wakes-menu` with the user-provided wording.
- Success: `app/wakes-menu/page.tsx` contains the exact requested paragraph and no unrelated page changes are made.

## Constraints/Assumptions

- Follow AGENTS SDLC phases; task artifacts must exist before implementation.
- Worktree is already dirty; do not revert or disturb unrelated in-progress changes.
- Manual UI QA via Chrome DevTools MCP is required for UI changes, but this environment may require temporary fallback verification if MCP is unavailable.
- Keep this pass focused on the requested copy replacement only.

## Key decisions

- Use a direct text replacement in the existing wakes menu page; no component, layout, or behavior changes are needed.
- Create a new task folder at `tasks/wakes-buffet-copy-update-20260429-1820/`.

## State

- Phase 4 verification is complete for the wakes buffet copy update; targeted lint has unrelated pre-existing color-token failures in the touched file.

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
- Created SDLC artifacts for `tasks/brand-asset-cleanup-20260320-1123/`.
- Removed legacy starter branding residue from package metadata, social preview images, and the favicon.
- Replaced the remaining legacy preview/logo surfaces with Old Crown branded assets and verified with residue search plus a full production build.
- Located the existing wakes buffet copy in `app/wakes-menu/page.tsx`.
- Created task artifacts for `tasks/wakes-buffet-copy-update-20260429-1820/`.
- Replaced the requested paragraph in `app/wakes-menu/page.tsx`.
- Verified the new paragraph with search, `git diff --check`, and a Playwright render check at `http://localhost:3001/wakes-menu`.
- Ran targeted lint; it failed on existing RGB/RGBA lint violations at `app/wakes-menu/page.tsx` lines 185, 194, 353, and 362.

## Now

- Report the completed copy replacement and verification results.

## Next

- Stop the local dev server before final response.

## Open questions (UNCONFIRMED if needed)

- None.

## Working set (files/ids/commands)

- CONTINUITY.md
- app/wakes-menu/page.tsx
- tasks/wakes-buffet-copy-update-20260429-1820/research.md
- tasks/wakes-buffet-copy-update-20260429-1820/plan.md
- tasks/wakes-buffet-copy-update-20260429-1820/todo.md
- tasks/wakes-buffet-copy-update-20260429-1820/verification.md
- tasks/wakes-buffet-copy-update-20260429-1820/artifacts/checks.md
- tasks/wakes-buffet-copy-update-20260429-1820/artifacts/playwright-render-check.json
- tasks/wakes-buffet-copy-update-20260429-1820/artifacts/wakes-menu-desktop.png
