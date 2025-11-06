# Implementation Plan: Home Page Christmas Music

## Objective

Enable festive background music on the homepage by reusing the existing `ChristmasMusicPlayer`, ensuring it autoplays politely on load and offers accessible controls identical to the Christmas menu page.

## Success Criteria

- [ ] `ChristmasMusicPlayer` renders on the homepage without runtime errors.
- [ ] Music attempts autoplay and loops; when blocked the UI reflects the blocked state with guidance.
- [ ] Play/pause toggle updates state, pauses audio on route change, and cleans up listeners.
- [ ] Control is visually discoverable, mobile-friendly, and WCAG-compliant (focusable, visible focus ring, `aria-live` messaging).

## Architecture

### Components

- `components/ClientHomeContent.tsx`: Import and render `ChristmasMusicPlayer` in a new festive section positioned beneath the hero showcase.

### State Management

- Leverage internal state of `ChristmasMusicPlayer`; no new global state needed.

## Data Flow

- On first render, the player instantiates an `Audio` element, attempts play, and exposes toggle handlers. Unmount stops playback automatically when navigating away.

## API Contracts

- No new APIs. Reuse static MP3 asset at `/audio/Jingle-Bells-3(chosic.com).mp3`.

## UI/UX Considerations

- Place the control in a full-width `section` with `bg-brand-900` (or similar) so white text remains legible.
- Add responsive padding and centering to avoid overlapping the slideshow while keeping the control prominent on mobile.
- Maintain existing attribution text for licensing transparency.

## Testing Strategy

- Manual: Load home page, confirm autoplay (or blocked messaging), toggle playback, and ensure cleanup on navigation away.
- Manual DevTools check: verify no console errors/warnings, inspect DOM semantics, confirm focus states and responsiveness.
- Optional unit/interaction test skipped for now given behaviour lives inside reused component.

## Edge Cases

- Autoplay blocked by browser: confirm messaging prompts user to press play.
- Audio load failure: verify error message surfaces appropriately.
- Multiple mounts (e.g., fast navigation or React StrictMode double render): ensure cleanup prevents overlapping playback.

## Rollout Plan

- Deploy immediately—no feature flag required. Verify post-deploy via manual smoke test.
