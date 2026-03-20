# Checks

## Residue Search

- `rg -n -i "ship-fast|shipfast|marc lou|marclou|marclow|ship fast" . --glob '!node_modules/**' --glob '!.next/**'`
- Result: no remaining text matches

## Asset Audit

- Compared `app/icon.png`, `app/apple-icon.png`, and `public/icon-512.png`
- Result: all square icon surfaces now use the same Old Crown icon asset

## Social Preview Replacement

- Regenerated `app/opengraph-image.{png,avif}` and `app/twitter-image.{png,avif}` from `public/images/brand/OldCrownLogo.png`
- Result: Old Crown branded social cards replaced the legacy starter graphic

## Favicon Replacement

- Regenerated `app/favicon.ico` from `public/icon-512.png`
- Converted the ICO to `/private/tmp/oldcrown-favicon-preview.png` for verification
- Result: favicon preview shows the Old Crown logo instead of the old lightning-bolt icon

## Formatting

- `git diff --check -- package.json package-lock.json app/icon.png app/apple-icon.png app/favicon.ico app/opengraph-image.png app/opengraph-image.avif app/twitter-image.png app/twitter-image.avif tasks/brand-asset-cleanup-20260320-1123`
- Result: passed

## Build

- `npm run build`
- Result: passed
