# Implementation Plan: Consolidated Banner JSON

## Objective
Capture the Seasonal Promo banner (a.k.a. “consolidate banner”) as a reusable JSON module so stakeholders can consume/share it independently of the JSX component. The JSON should describe all textual + accessibility data needed to reconstruct the banner.

## Success Criteria
- [ ] New JSON file under `config/content/components/` encapsulates the banner copy, CTA, badge, emoji, and theming metadata.
- [ ] `config/content/manifest.json` references the new module so future loaders can fetch it.
- [ ] JSON validates (well-formed) and follows existing naming/style conventions.

## Architecture & Data Flow
- **Content source**: JSON file (`components/consolidatedBanner.json`) becomes the single source of truth for the promo banner messaging.
- **Consumption**: Current React component still uses hardcoded content, but documenting schema prepares for future hydration via modular content services (`useModularContent`, loader utilities). No runtime wiring included in this task per stakeholder ask.
- **Manifest**: Components module entry lists this new file so loaders know it exists; no additional dependencies required.

## Schema / Component Breakdown
- `meta`: id, status, season, lastUpdated, targeted surfaces (document assumption + future-proofing fields).
- `badge`: label + variant string (maps to DaisyUI badge classes).
- `icon`: emoji/pictogram.
- `headline`: main statement.
- `supporting`: descriptive copy.
- `cta`: object with `label`, `href`, `ariaLabel`, `variant`, `analyticsId` for instrumentation.
- `a11y`: optional `landmarkLabel` or `ariaLabel` to keep accessible naming explicit.
- `surface`: utility tokens describing background/border/text classes (so consumers don’t hardcode). Values match current `SeasonalPromoBanner` utilities.

## Testing Strategy
- Use `jq . config/content/components/consolidatedBanner.json` (or `node -e 'require(...)'`) to verify JSON validity.
- Since this task is data-only, no automated unit tests change; highlight assumption that UI integration is future work.

## Edge Cases & Notes
- Keep copy generic enough to survive outside of festive context by including fields for `season` + `status`. If banner is disabled, consumers can check `status !== 'live'`.
- Document assumption in commit/task notes to revisit if stakeholder clarifies “consolidate banner” meaning.

## Rollout
- Commit JSON + manifest changes. No build/test gating expected beyond formatting check.
