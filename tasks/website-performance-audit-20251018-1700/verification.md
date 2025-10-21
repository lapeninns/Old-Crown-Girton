# Verification Report

## DevTools Manual QA

**Tool Used**: Chrome DevTools (MCP)

### Console Inspection

- [ ] No errors in Console
- [ ] No warnings that need addressing
- [ ] Performance warnings addressed

### DOM & Accessibility

- [ ] Semantic HTML structure verified
- [ ] ARIA attributes correct
- [ ] Focus order logical

### Performance Profile

- [ ] No excessive re-renders detected
- [ ] Network waterfall optimized
- [ ] Memory leaks checked

### Device Testing

- [ ] Mobile viewport (375px) tested
- [ ] Tablet viewport (768px) tested
- [ ] Desktop viewport (1920px) tested

## Test Scenarios

- [ ] Happy path works
- [ ] Error handling correct
- [x] Performance needs optimization

## Accessibility Checklist

- [ ] Keyboard navigation works
- [ ] Screen reader support
- [ ] Focus indicators visible

## Performance Metrics

- FCP: ~180-250 ms (best); ~650 ms on slow pages
- LCP: 148-966 ms (median ≈ 700 ms on blog posts)

## Known Issues

- [x] Documented

- **Recurring errors**: `Service Worker registration failed` across all pages (PWAUtils.tsx). `PerformanceObserver` lacking buffered flag support warning repeats globally.
- **CLS demo**: `/cls-optimized` loads missing images (404) and still reports CLS ≈ 0.02 despite optimization claim.
- **Offline/test-hours**: Offline page LCP 463 ms; `/test-hours` exhibits CLS ≈ 0.06 due to dynamic hours widget.
- **Blog media**: Hero images lazy-discovered causing 400-550 ms load delay; LCP peaks at 966 ms on `/blog/local-suppliers-fresh-ingredients`.
- **Third-party noise**: Vercel Analytics + Speed Insights load eagerly on every page even offline context.

## Sign-off

- [ ] Engineering approved
- [ ] Design approved

## Per-Page Trace Summary

| Route | LCP (ms) | CLS | Key Findings |
| --- | --- | --- | --- |
| `/` | 194 | 0.00 | ImageDelivery insight flagged 59.6 kB compression opportunity on hero image; Third-party scripts (Vercel analytics) loaded early. |
| `/menu` | 410 | 0.00 | Multiple CLS observer alerts despite zero CLS (micro-shifts); render-blocking CSS/JS; service worker registration errors; third-party analytics overhead. |
| `/menu-information` | 158 | 0.00 | Fast LCP but render-blocking insight still triggered; persistent PWA registration failure and analytics noise. |
| `/book-a-table` | 166 | 0.07 | Route redirects to ToGo third-party booking; CLS spike during embed load; document latency insight; external assets outside direct control. |
| `/takeaway-menu` | 183 | 0.00 | Render-blocking CSS/JS flagged; same service worker failure; third-party analytics noise. |
| `/wakes-menu` | 176 | 0.00 | Similar render-blocking pattern; repeated PWA failure & analytics logs cluttering main thread. |
| `/christmas-menu` | 197 | 0.00 | Render-blocking flagged; nav CLS logs; same PWA registration failure; heavy hero imagery. |
| `/curry-and-carols-menu` | 162 | 0.00 | Fast LCP but render-blocking detection; PWA error + analytics logs persist. |
| `/events` | 211 | 0.00 | Render-blocking flagged; repeated CLS observer chatter; service worker + analytics noise. |
| `/events/curry-and-carols` | 190 | 0.00 | Same render-blocking and third-party issues; no CLS but observer logs. |
| `/contact` | 218 | 0.00 | Higher TTFB (74 ms) likely due to map/embed; CLS observer flagged 0.01 shift; repeated PWA failure; third-party logs. |
| `/about` | 148 | 0.00 | Strong LCP; render-blocking still detected; same third-party + PWA errors. |
| `/press` | 177 | 0.00 | Render-blocking detection persists; third-party analytics + PWA errors continue. |
| `/privacy-policy` | 169 | 0.00 | Render-blocking flagged; third-party scripts & PWA error consistent; static content otherwise light. |
| `/tos` | 171 | 0.00 | Render-blocking flagged; same recurring third-party/PWA issues; static copy heavy but lite. |
| `/cls-optimized` | 182 | 0.02 | CLS demo still shifts (0.02); missing images (404) undermining test; PWA error + analytics logs remain. |
| `/offline` | 463 | 0.00 | High LCP due to heavy render delay; offline template still loads third-party scripts and hits service worker failure logs. |
| `/test-hours` | 363 | 0.06 | Significant CLS (0.06) due to dynamic hours widget; LCP delayed by 296 ms render wait; PWA error persists. |
| `/blog` | 209 | 0.00 | LCP discovery time (156 ms) due to image discovery; same third-party + PWA noise. |
| `/blog/largest-thatched-pub-history` | 753 | 0.00 | Very slow LCP (hero image discovery 430 ms + render 289 ms); same third-party/PWA logs. |
| `/blog/perfect-sunday-roast-guide` | 930 | 0.00 | Worst LCP observed (930 ms) due to 539 ms discovery + 285 ms render; note CLS observer event flagged even though final CLS is 0. |
| `/blog/ultimate-sports-viewing-guide` | 732 | 0.00 | LCP dominated by 437 ms discovery + 261 ms render; similar hero image behavior. |
| `/blog/business-lunch-cambridge-guide` | 749 | 0.00 | LCP pattern matches other posts (437 ms discovery); no CLS but same third-party/PWA clutter. |
| `/blog/evening-standard-country-pub-of-the-week` | 717 | 0.00 | LCP 717 ms from hero image; otherwise similar to other articles. |
| `/blog/nepalese-cuisine-journey` | 740 | 0.00 | Hero image drives 422 ms discovery + 283 ms render; same third-party patterns. |
| `/blog/authentic-momo-dumplings-nepalese-cuisine` | 690 | 0.00 | Slightly better LCP but still 400 ms discovery; third-party instrumentation persists. |
| `/blog/local-suppliers-fresh-ingredients` | 966 | 0.00 | Slowest article LCP (966 ms) with 553 ms discovery + 301 ms render; CLS observer flagged. |
| `/blog/dog-friendly-dining-guide` | 779 | 0.00 | 418 ms discovery + 283 ms render; overall pattern consistent; third-party scripts unchanged. |
| `/blog/student-guide-cambridge-university` | 778 | 0.00 | 418 ms discovery + 278 ms render; CLS observer flagged though final CLS 0. |

### Cross-Cutting Observations
- Hero/heroine imagery is consistently the LCP element and suffers from 400-550 ms discovery delay before render; consider Next Image priority hints, preloading, or responsive size reductions.
- Service worker registration fails on every route in dev, preventing offline caching and spamming console; investigate `PWAUtils.tsx` registration flow.
- Vercel Analytics / Speed scripts load eagerly across all contexts (including `/offline`), adding main-thread work during load; defer or gate behind `NODE_ENV` checks.
- `PerformanceProvider` / CLS instrumentation emits numerous warnings; ensure dev-only guards to avoid adding console noise in production.
- `/test-hours` dynamic hours widget triggers major CLS (~0.06); audit layout strategy (reserve height, use skeleton) to stabilize.
