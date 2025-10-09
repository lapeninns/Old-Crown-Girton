# Plan – Christmas Menu Enhancements (Wave 2)

## Objectives
- Swap in the new festive audio track while preserving the lightweight player behaviour and accurate attribution.
- Ensure every mention of the arrival drink promise includes “mulled wine or another drink of their choice.”
- Refresh the Chef’s set menu CTA so it reads stronger, adds an icon, and keeps excellent focus/hover states.

## Steps
1. **Music player update**
   - Point `ChristmasMusicPlayer` at the new `Jingle-Bells-3(chosic.com).mp3` asset, refresh the track credits, and keep existing autoplay + loop setup.

2. **Mulled wine copy sweep**
   - Search `app/christmas-menu/page.tsx` (and metadata) for “mulled wine” strings; ensure each instance includes “or another drink of their choice” while keeping prose natural.

3. **Chef CTA uplift**
   - Update the Chef’s sidebar button text to a clearer action (e.g. “Book the festive set menu”), add a relevant emoji icon, and verify `MotionLinkButton` props maintain accessibility.

4. **Verification**
   - Run `npx next lint --file app/christmas-menu/page.tsx` and `npx next lint --file app/christmas-menu/_components/ChristmasMusicPlayer.tsx`.
   - Manually review the Christmas menu page for the new wording and CTA, and confirm the audio control text/attribution look correct.
