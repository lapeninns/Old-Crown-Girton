# Continuity Ledger

Last updated: 2025-12-30T15:59:46Z

## Goal (incl. success criteria)

- Diagnose and resolve the Restaurant API AbortError/slow request observed in logs.
- Success: root cause identified in code/config and mitigation proposed/implemented.

## Constraints/Assumptions

- Follow AGENTS SDLC phases; no coding before requirements and plan are reviewed.
- All work tracked in a task folder `tasks/<slug>-YYYYMMDD-HHMM>/`.
- Manual UI QA via Chrome DevTools MCP required for UI changes.
- Network access is restricted in this environment.

## Key decisions

- Likely root cause is CMS API recursion/timeout due to `cmsOn` using `cms.enabled || featureFlags.cms` and prod config setting `featureFlags.cms: true` with endpoint pointing to the same `/api/restaurant` route.

## State

- Added self-endpoint guard to restaurant/menu/marketing/content loaders; pending verification.

## Done

- Read root `AGENTS.md` instructions (provided by user).
- Located `app/api/restaurant/route.ts`, `src/lib/data/loaders/RestaurantSmartLoader.ts`, `src/lib/data/loaders/BaseSmartLoader.ts`, and config files.
- Created `tasks/fix-restaurant-api-timeout-20251230-1551/` with SDLC artifacts.
- Implemented self-endpoint guard in `RestaurantSmartLoader.tryLoadFromAPI`.
- Added same guard to Menu/Marketing/Content smart loaders.

## Now

- Prepare verification steps and note any remaining checks.

## Next

- Verify `/api/restaurant` response and log warnings.

## Open questions (UNCONFIRMED if needed)

- Is this error from production, staging, or local environment? (UNCONFIRMED)
- Should CMS be enabled in prod, and if so, should it point to a separate CMS host? (UNCONFIRMED)

## Working set (files/ids/commands)

- AGENTS.md
- CONTINUITY.md
- app/api/restaurant/route.ts
- src/lib/data/loaders/RestaurantSmartLoader.ts
- src/lib/data/loaders/BaseSmartLoader.ts
- data/prod/config.json
- tasks/fix-restaurant-api-timeout-20251230-1551/research.md
- tasks/fix-restaurant-api-timeout-20251230-1551/plan.md
- tasks/fix-restaurant-api-timeout-20251230-1551/todo.md
- src/lib/data/loaders/MenuSmartLoader.ts
- src/lib/data/loaders/MarketingSmartLoader.ts
- src/lib/data/loaders/ContentSmartLoader.ts
