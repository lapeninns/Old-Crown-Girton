# Research

## Goal
Understand why the "Pause slideshow" and "Reduce motion" pill buttons appear on the homepage slideshow and how to remove them safely.

## Findings
- The homepage slideshow is rendered by `components/slideshow/Slideshow.tsx`.
- The buttons in question live inside an absolutely positioned control group (`absolute top-3 right-3 z-30 flex gap-2`).
  - Lines `components/slideshow/Slideshow.tsx:632-662` contain two `<button>` elements showing `Pause slideshow` / `Play slideshow` and `Reduce motion` / `Enable motion` labels.
  - Both buttons share styling (`rounded-full bg-black/60 text-white text-xs px-3 py-1.5 ...`) which renders the dark translucent pills seen in the screenshot.
- `navigation.toggleAutoplay` toggles the autoplay state. Autoplay can also be controlled via keyboard (Space toggles, Escape stops) per the SR-only instructions in `Slideshow.tsx:620-623`.
- `toggleReducedMotion` flips a local `userReducedMotion` state that overrides the OS-level `prefers-reduced-motion` hook (`useReducedMotion`). If removed, the slideshow will fall back to the system preference only.
- No other components depend on these buttons directly—they are only bound to local handlers.
- Removing the pill buttons will not break slideshow navigation; keyboard and swipe gestures remain intact. Reduced-motion preference will rely on the user’s global OS/browser setting.

## Existing patterns & constraints
- The slideshow already exposes keyboard shortcuts and an accessible live region for announcements, so removing the visible buttons should still leave some accessibility affordances.
- Ensure any removal keeps the DOM focus order sensible and preserves `aria` descriptors already defined on the wrapper.
- After removal, verify no floating empty container remains at `top-3 right-3`.
