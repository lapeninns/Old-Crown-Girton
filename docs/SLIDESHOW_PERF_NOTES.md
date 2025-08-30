# Slideshow Performance Trace

This repository cannot capture a browser trace in CI. Please run locally to verify and update this file with the screenshot.

Steps to capture:
- Open the homepage with the slideshow in Chrome Canary/Chrome Stable.
- DevTools > Performance > Enable Screenshots + Web Vitals.
- Record while:
  - Dragging quickly left/right a few times.
  - Letting autoplay advance once.
  - Triggering navigation via trackpad horizontal scroll.
- Stop recording and save a screenshot of the summary view.

What to expect (after this PR):
- FPS: ~60fps during drag and cross-fade.
- Long tasks: none > 50ms; main thread tasks typically < 4–6ms.
- Paint time: small, transforms/opacity only; no layout shifts (CLS = 0 for slideshow region).
- JS heap: stable; no event handler churn during gestures.

Paste the screenshot here (drag/drop into your Git client) and commit as `docs/slideshow-perf-trace.png`.

