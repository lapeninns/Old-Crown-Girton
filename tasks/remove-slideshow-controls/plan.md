# Plan

## Goal
Remove the "Pause slideshow" and "Reduce motion" pill buttons from the homepage slideshow while keeping carousel functionality and accessibility intact.

## Steps
1. Update `components/slideshow/Slideshow.tsx` to eliminate the floating control group rendering the autoplay and motion toggle buttons.
   - Remove the `div` containing both buttons.
   - Drop the `toggleReducedMotion` handler and the `reducedMotionState` helper that only fuel the deleted UI.
2. Tidy related state now that manual toggling is gone.
   - Adjust the `useState` destructuring so `setUserReducedMotion` is no longer declared (avoids lint errors) while still reading any stored preference.
   - Confirm no other references to the setter remain.
3. Sanity-check the slideshow still compiles/behaves without the controls.
   - Run `npm run lint` (or the existing project lint/test command) to ensure TypeScript/Lint catch no regressions.
   - If lint is heavy, at minimum run `npm run build` or the relevant lightweight check that exercises this component.
