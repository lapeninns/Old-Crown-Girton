---
task: remove-shipfast-branding
timestamp_utc: 2026-03-24T21:27:00Z
owner: github:@openai
reviewers: [github:@maintainers]
risk: low
flags: []
related_tickets: []
---

# Research: Remove Shipfast Branding

## Requirements

- Functional:
  - Remove remaining Shipfast/starter-template branding and placeholder product copy from the live site and shipped assets.
  - Replace generic or missing logo references with the canonical Old Crown brand asset.
  - Remove fake app manifest entries that imply mobile apps or share handlers the site does not actually provide.
- Non-functional (a11y, perf, security, privacy, i18n):
  - Keep branding cleanup narrow and low-risk.
  - Preserve existing routes and functionality.
  - Avoid sweeping docs-only edits unless they affect shipped output.

## Existing Patterns & Reuse

- The canonical brand assets already exist in `public/images/brand/OldCrownLogo.png` and `public/images/brand/Oldcrowngirtonlogo.png`.
- `app/layout.tsx` already points favicons and app icons at the Old Crown icon set.
- The remaining issues are mostly fallback strings, placeholder manifest entries, and old demo references.

## Constraints & Risks

- Some repo references to `Restaurant_BP` are internal docs/comments from an older architecture pass and are not part of shipped user-facing branding.
- The cleanup should focus first on runtime, metadata, and visible UI copy.

## Findings

- `public/manifest.json` still contained starter-style leftovers:
  - fake related app store entries
  - unsupported `/share` handlers
  - an outdated contact shortcut URL
- Several files still referenced a non-existent `/images/logo.png` placeholder instead of the actual Old Crown logo asset.
- CTA/auth fallback copy still used generic starter wording such as `Get Started`.
- A few component comments still read like starter-template scaffolding.

## Recommended Direction (with rationale)

- Standardize all shipped logo references on the real Old Crown brand asset.
- Change generic starter CTA copy to Old Crown-specific booking language.
- Trim unsupported PWA manifest placeholders so the manifest only describes capabilities the site actually has.
- Leave internal docs-only `Restaurant_BP` cleanup as a separate housekeeping pass unless explicitly requested.
