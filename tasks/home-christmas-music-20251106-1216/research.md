# Research: Home Page Christmas Music

## Summary

- Requirement: enable the `/` home page to play the festive background music automatically on load just like `/christmas-menu`, while exposing an accessible play/pause toggle so visitors can control the soundtrack.
- Success criteria:
  - Music attempts a single polite autoplay when the homepage renders, loops continuously, and reuses the existing licensed track at `public/audio/Jingle-Bells-3(chosic.com).mp3`.
  - Users can pause/resume via an accessible control with `aria-live` feedback identical to the Christmas Menu implementation.
  - The solution must degrade gracefully when autoplay is blocked or audio fails, showing clear status messaging.
  - No duplicate playback persists after leaving the home page (component cleans up on unmount).

## Existing Patterns

- `app/christmas-menu/_components/ChristmasMusicPlayer.tsx` already encapsulates all festive audio behaviour:
  - Instantiates a looping `Audio` object in `useEffect`, attempts autoplay once, and stores state for `isPlaying`, `autoplayBlocked`, and `error`.
  - Provides a rounded button with emoji affordance plus an `aria-live` status region and attribution text.
  - Cleans up listeners and pauses audio on unmount; also pauses when the tab becomes hidden.
- `app/christmas-menu/page.tsx` renders this player near the footer, confirming the component is self-contained and reusable.
- The home page is rendered via `components/ClientHomeContent.tsx`, which is a client component already, so it can consume other client-side utilities without additional wrapping.

## External Resources

- Uses the locally hosted MP3 in `public/audio/Jingle-Bells-3(chosic.com).mp3` and relies on the attribution text embedded in `ChristmasMusicPlayer`.

## Technical Constraints

- Browser autoplay policies may prevent playback until the user interacts; the existing component accounts for this and guides the user.
- Need to ensure the player renders in a visually appropriate location on the home page without obstructing core hero content, ideally keeping mobile-first layout in mind.
- Avoid mounting multiple instances simultaneously (e.g., if both home and Christmas pages are visible) to prevent overlapping audio.

## Recommendations

- Reuse `ChristmasMusicPlayer` as-is to guarantee consistent behaviour, messaging, and accessibility rather than reimplementing audio logic.
- Mount the component within the home page hero region (after the slideshow container) so it is discoverable but not intrusive—potentially using flex utilities to center it under the hero copy.
- Consider wrapping the player in a DaisyUI-friendly container (e.g., `alert`/`card` styling) to blend with home page aesthetics if needed, while keeping existing control classes for accessibility.
- Ensure the component only renders when the slideshow has content (or always render if music is desired regardless of slideshow presence).

## Open Questions

- Where exactly within the hero layout should the control sit so it remains visible on mobile without covering slideshow call-to-action overlays? (Lean toward a dedicated section immediately following the hero to avoid overlap.)
