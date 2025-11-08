# Implementation Checklist

## CSS Utility
- [x] Add `.bg-brand-50/90` helper to `app/globals.css` with solid fallback + `color-mix` for translucency.
- [x] Ensure selector escaping and comment explain why the helper exists.

## Validation
- [x] Re-run class usage check (`rg bg-brand-50/90`) to confirm only seasonal banner references the helper.
- [x] Inspect seasonal banner in dev (Chrome DevTools MCP) to confirm computed `background-color` is light.

## Notes
- Document any follow-up utilities needed for other translucency variants if spotted during verification.
