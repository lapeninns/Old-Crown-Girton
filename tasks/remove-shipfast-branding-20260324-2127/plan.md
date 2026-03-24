---
task: remove-shipfast-branding
timestamp_utc: 2026-03-24T21:27:00Z
owner: github:@openai
reviewers: [github:@maintainers]
risk: low
flags: []
related_tickets: []
---

# Implementation Plan: Remove Shipfast Branding

## Objective

We will remove the remaining starter-template branding and placeholder capability declarations from the shipped site so all visible/runtime branding aligns with The Old Crown Girton.

## Success Criteria

- [ ] Live UI fallback copy no longer uses starter-template wording.
- [ ] Logo/icon references point to real Old Crown brand assets.
- [ ] The manifest no longer declares fake app-store/share capabilities.
- [ ] Production build succeeds.

## Architecture & Components

- `public/manifest.json`: remove fake app placeholders and align shortcut copy/URLs.
- `public/sw.js`, `src/lib/serviceWorker.tsx`, `lib/criticalLoadingCSS.ts`, demo/perf components: replace dead `/images/logo.png` references with the canonical Old Crown logo.
- `components/ButtonSignin.tsx`, `components/ButtonPopover.tsx`, `components/CTA.tsx`, content JSON: replace generic starter copy.
- `components/Header.tsx`, `lib/restaurantData.ts`: clean starter-template comments and naming residue.

## Testing Strategy

- Search-based verification for removed placeholder strings.
- Production build.
