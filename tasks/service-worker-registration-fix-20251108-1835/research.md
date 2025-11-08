# Research: Service Worker Registration

## Initial Requirements
- Console logs show `[PWA] Service Worker registration failed` on page load.
- Goal: ensure `navigator.serviceWorker.register('/sw.js')` succeeds during production/dev so PWA caching functions.

## Existing Findings
- `components/ui/PWAUtils.tsx` handles registration and logs the failure.
- Static service worker script lives at `public/sw.js`.
- Failure likely due to syntax error or runtime exception while evaluating `sw.js`.

## Investigation
- Opening `public/sw.js` reveals an invalid literal on line 32: `dynamic: 86400 * 7, // 7 days  \n  images: ...`. The stray `\n` characters sit outside of a string, causing `Uncaught SyntaxError` and breaking installation.
- Running `rg '\\n' public/sw.js` confirms the only instance outside content strings is this typo.
- Because the script fails to evaluate, the registration promise rejects, producing the console error.

## Constraints
- Must keep caching durations for `static`, `dynamic`, and `images` while removing invalid escape characters.
- `public/sw.js` is a plain JS file served via `/sw.js`; editing requires manual care (no build step).
- Should remain compatible with browsers lacking `color-mix` (unrelated) and with Next.js PWA expectations.

## Recommendation
- Fix the typo by moving `images` entry onto its own line and removing the extra `\n` token:
  ```js
  const CACHE_DURATIONS = {
    static: 86400 * 30,
    dynamic: 86400 * 7,
    images: 86400 * 14,
  };
  ```
- After editing, re-run `npm run dev` + DevTools check to ensure registration no longer throws.
- Optional: add lint/test covering SW syntax, but out of scope for quick fix.
