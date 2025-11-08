# Research: Consolidated Banner JSON

## Task Overview
- **Request**: Provide a standalone “consolidate banner” code asset delivered as a JSON file so it can be reused or shared outside the React component tree.
- **Assumption**: The stakeholder is referring to the existing seasonal/alert banner that lives in `components/restaurant/SeasonalPromoBanner.tsx` and wants its structure/copy encoded as portable data rather than JSX. I will document this assumption for confirmation later.

## Existing Patterns & References
- `components/restaurant/SeasonalPromoBanner.tsx` renders the current festive banner with DaisyUI `alert` classes, inline badge, emoji, copy, and CTA linking to `/christmas-menu`. Styling relies on Tailwind utilities (`bg-brand-50/90`, `backdrop-blur`, `focus-visible:ring-*`).
- `components/restaurant/TakeawayBanner.tsx` and `components/restaurant/sections/PressFeatureBanner.tsx` show how other banners are structured. `PressFeatureBanner` already receives its text/CTA from JSON (`config/content/pages/home.json → sections.pressFeature`), proving that banner content can be sourced from structured data.
- Modular content system under `config/content` splits reusable component data into focused JSON files (e.g., `config/content/components/testimonials.json`). Page JSON values feed React components via hooks/services described in `docs/MODULAR-CONTENT-ARCHITECTURE.md` and `docs/MODULAR-CONTENT-USAGE.md`.

## External Resources
- DaisyUI alert component guidance: https://daisyui.com/components/alert/ (matches the styling conventions seen in `SeasonalPromoBanner`).
- Internal modular content documentation (`docs/MODULAR-CONTENT-ARCHITECTURE.md`) defining where component-level JSON modules should live.

## Technical Constraints & Considerations
- Project standards (AGENTS.md) require DaisyUI-first styling, mobile-first layout, and accessible focus handling; any JSON blueprint should contain enough semantic data (labels, aria text) for the React layer to stay compliant.
- JSON modules sit under `config/content/components/*.json` with camelCase names and purely data (no JSX). Consumers map JSON fields to React props.
- Need to keep CTA metadata (href, label, ariaLabel) explicit so downstream renderers can set accessible names.
- Keep copy trimmed and avoid HTML in JSON unless necessary; use plain text plus emoji code points as seen in existing components.

## Recommendations
- Create `config/content/components/consolidatedBanner.json` storing all fields needed to recreate the seasonal promo banner: badge label, emoji, headline, supporting copy, CTA label/href/aria label, optional analytics tag, etc.
- Include metadata describing layout variants or theming (e.g., surface/background tokens) so React consumers can map to Tailwind utility presets without hardcoding strings again.
- Document assumption + schema inside the JSON (via `meta` block) or adjacent README entry for future maintenance.

## Open Questions / Assumptions
- “Consolidate banner” naming is unclear; proceeding under the assumption it equals the Seasonal Promo Banner. Need confirmation from stakeholder, but will design JSON flexibly enough to cover other alert banners if required.
- Delivery expectation: JSON checked into repo vs. returned inline? I plan to add the file under `config/content/components/` per modular content conventions unless told otherwise.
