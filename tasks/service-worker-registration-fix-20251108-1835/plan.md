# Implementation Plan: Service Worker Registration

## Objective
Resolve the `[PWA] Service Worker registration failed` console error by fixing the syntax issue within `public/sw.js` so the script evaluates successfully.

## Success Criteria
- Service worker registers without throwing in dev (and by extension production).
- Console no longer shows the `[PWA] Service Worker registration failed` message.
- Existing caching logic (cache names, durations) remains intact.

## Steps
1. Edit `public/sw.js` to remove the stray `\n` token in `CACHE_DURATIONS` and ensure `images` duration is declared properly.
2. Scan file for any other rogue control sequences outside of template strings.
3. Restart dev server (if needed) and verify registration success via DevTools console.

## Testing
- `npm run dev` + Chrome DevTools: observe console log for successful registration (or absence of error).
- Optionally inspect `navigator.serviceWorker.controller` to confirm active SW (manual check).
