# Plan: Homepage Slideshow Dynamic Layout

## Goal
Let each slide grow naturally with its content while preserving visual harmony across breakpoints. Remove forced viewport clamps so typography, badges, and CTAs can wrap without clipping, yet keep the hero feeling polished and accessible.

## Approach
1. **Undo rigid viewport locks**
   - Remove the fixed `min-h/max-h` clamps on the slideshow wrapper and carousel items.
   - Reintroduce a flexible padding system (responsive inset) so slides breathe but height respects content.

2. **Tune content stack for fluid growth**
   - Keep the flex + gap column structure but allow container width/spacing to adjust with content.
   - Ensure optional sections (badges/CTAs) collapse cleanly when absent, without leaving gaps.

3. **Responsive typography & spacing**
   - Keep fluid `clamp()` typography but confirm headings/body shrink gracefully on small screens to avoid overflow.
   - Adjust gap/padding values so long copy + badges fit without exceeding available space.

4. **CTAs and badges**
   - Maintain ≥44 px hit targets and focus treatments.
  - Allow button text to wrap if needed instead of truncating, while bounding max width for balance.

5. **Verification**
   - Run `npm run lint` (expect existing repo issues; confirm slideshow file passes).
   - Manual QA: check slides with long copy across mobile/desktop to ensure no clipping and smooth layout changes.

## Dependencies / Notes
- Focus only on `components/slideshow/DaisyUISlideshow.tsx`.
- Do not disturb autoplay/pointer logic or announcements.
- If overflow appears on extremely long copy, consider `line-clamp` or layout adjustments as a follow-up cue to the user.
