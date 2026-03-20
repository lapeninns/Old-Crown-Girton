---
task: brand-asset-cleanup
timestamp_utc: 2026-03-20T11:23:00Z
owner: github:@maintainers
reviewers: [github:@maintainers]
risk: medium
flags: []
related_tickets: []
---

# Verification Report

## Result

- [x] Removed the remaining legacy starter name from package metadata by renaming the package to `oldcrownlp`
- [x] Replaced the legacy social preview artwork in `app/opengraph-image.*` and `app/twitter-image.*` with Old Crown branded images
- [x] Replaced the legacy favicon with an ICO generated from the Old Crown icon
- [x] Synced `app/icon.png` and `app/apple-icon.png` with the square Old Crown icon asset

## Checks

- [x] `rg -n -i "ship-fast|shipfast|marc lou|marclou|marclow|ship fast" . --glob '!node_modules/**' --glob '!.next/**'`
- [x] `git diff --check -- package.json package-lock.json app/icon.png app/apple-icon.png app/favicon.ico app/opengraph-image.png app/opengraph-image.avif app/twitter-image.png app/twitter-image.avif tasks/brand-asset-cleanup-20260320-1123`
- [x] `npm run build`

## Notes

- The favicon preview was explicitly checked after regeneration to confirm the old lightning-bolt icon was gone.
- Chrome DevTools MCP visual QA remains a follow-up requirement for UI-facing changes; the MCP tool was unavailable in this session.
