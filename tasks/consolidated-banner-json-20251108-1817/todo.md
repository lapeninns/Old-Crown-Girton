# Implementation Checklist

## Content Module
- [x] Finalize JSON schema fields for the consolidated banner (meta, badge, messaging, CTA, surface).
- [x] Add `config/content/components/consolidatedBanner.json` populated with the Seasonal Promo banner content + accessibility metadata.

## Manifest Update
- [x] Append the new JSON path to the `components` module inside `config/content/manifest.json`.

## Validation
- [x] Run `jq` (or Node) to ensure the JSON file is valid and lint-free.

## Notes / Assumptions
- Working under the assumption that “consolidate banner” maps to the existing Seasonal Promo banner; adjust later if stakeholder clarifies otherwise.
