# Plan – restore bounce autoplay with smooth manual swipe

## Goal
Provide a slideshow that:
- Autoplays in a ping-pong sequence (1 → … → N → … → 1) per user expectation.
- Keeps manual swipes responsive without desync or sluggishness.
- Maintains accurate indicators/ARIA announcements and existing controls.

## Implementation steps
1. **Revisit pointer pause logic**
   - Retain lightweight pointer pause/resume (stop interval on pointer down, resume shortly after release) without introducing expensive scroll listeners.
   - Remove or simplify any logic causing perceived lag (e.g. avoid state churn on every scroll).

2. **Implement deterministic ping-pong autoplay**
   - Replace modulo wrap with a direction-aware index that flips at list ends.
   - Store current direction in a ref/state; update controls/autoplay helpers to respect it.
   - Ensure manual navigation (buttons/dots/swipes) updates both index and direction to avoid abrupt jumps.

3. **Keep indicators and aria-live accurate**
   - When autoplay changes direction, still announce the correct slide.
   - Ensure state updates remain consistent when slides array changes.

4. **Cleanup and verification**
   - Remove unused refs/listeners introduced earlier that are no longer needed.
   - Run lint; manual QA focuses on swipe smoothness and ping-pong order.

## Verification
- Autoplay visibly plays 1-2-3-…-N-…-3-2-1 loop.
- Manual swipe is responsive and autoplay resumes from the post-swipe slide in the proper direction.
- Buttons and dots move to expected slide and adjust direction logically.
