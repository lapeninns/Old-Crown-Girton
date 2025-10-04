# Analysis Prep Notes

## Architecture & Structure
- Showcase (`components/slideshow/Showcase.tsx`) is a thin wrapper that renders `DaisyUISlideshow` inside a client-side `ErrorBoundary`, providing `SlideshowFallback` on failure.
- `DaisyUISlideshow` (`components/slideshow/DaisyUISlideshow.tsx`) owns all logic; pattern resembles a self-contained presentational component with internal state hooks rather than split container/presentational roles.
- Static slide content comes from `components/slideshow/slides.ts`, bundling AVIF+fallback sources and metadata per slide; no props allow swapping the dataset.
- Styling and layout rely on Tailwind CSS with DaisyUI utility classes (`btn`, `carousel`, etc.), coupled to global theme config.
- Related but unused modules (`Slideshow.tsx`, custom hooks, `Slide.tsx`, `DaisyCarousel.tsx`) remain in the directory, adding cognitive overhead despite not participating in the homepage path.

## Features & Behavior
- Navigation via arrow buttons, dot indicators, and global keyboard listener; helper functions `nextSlide`/`prevSlide` wrap indices with modulo arithmetic for pseudo-infinite looping.
- Autoplay optional via props, defaults to 5s (`interval`) with hover pause; no pause-on-focus or visibility handling.
- Transition effect relies on native `scrollTo({ behavior: 'smooth' })` horizontal snapping; no dedicated animation or Framer Motion integration.
- Content overlays support eyebrow/headline/copy, optional badges, and CTA buttons linking to external booking/tel; all slides share same template (image background + overlay).
- Responsive design uses Tailwind breakpoints for typography and layout, but fixed `h-screen` hero may cause mobile viewport jank (URL bar).
- Missing advanced carousel affordances: no swipe gestures, no thumbnail nav, no dynamic slide management, no deep linking.

## State Management
- Local state only: `currentIndex` drives UI; refs track DOM node and timer; side effects from `useEffect` set/clear intervals and keydown listener.
- State updates triggered by user events (clicks, keyboard), autoplay interval, and dot controls; `goToSlide` updates state and imperatively scrolls container.
- No persistence of current slide (no URL sync, storage, or context).
- Side effects include window `keydown` listener, repeated `setInterval` timers on mount/hover resume without visibility awareness.

## Performance
- Entire slide list renders at once; each `next/image` (quality 90) may request high-res assets upfront. Only first image gets `priority`; others rely on native lazy-loading but still mount.
- No memoization/`React.memo`; re-renders triggered by index update rerender the full slide map, though slide objects remain static.
- Autoplay timer re-established on every mouse leave without nulling the ref; repeat leave events risk stacking intervals if handlers fire unexpectedly.
- Global keydown listener attaches at window scope for lifetime of component; no focus gating or cleanup on blur/visibility change.
- No performance instrumentation or suspense; heavy slide dataset imported synchronously inflates bundle.
- Animations depend on native smooth scroll; no explicit reduced-motion variant.

## Accessibility
- Wrapper uses `role=region` with label and arrow/dot controls include `aria-label`s; live region (`aria-live="polite"`) announces slide changes.
- Keyboard navigation relies on a global `keydown` listener; focus order works via native controls but there is no focus trap or pause-on-focus.
- Dot controls lack custom focus styling beyond default outline, which may be hard to discern against imagery; arrow buttons rely on DaisyUI focus ring which can be subtle.
- No screen-reader hint for autoplay status or instructions; live region announces only slide headline.
- Autoplay keeps running for assistive tech users unless hovered; no reduction for `prefers-reduced-motion` or on focus.
- CTA buttons are `<a>` elements with descriptive text but no additional context on opening in new tab.

## UX
- Controls are visually apparent (overlayed arrows, dots) but rely on contrast over imagery; dot indicators shrink to 3px height which may be hard to tap on touch devices.
- CTA layout stacks vertically on mobile and pairs horizontally on larger screens; typography scales via Tailwind but long copy could overflow small devices.
- Uses full-screen hero with dark overlay improving readability; however, fixed height may hide subsequent content and lacks skip-to-content cue that jumps past hero.
- Loading experience depends on Next Image; no skeleton inside slideshow itself, so first image flash may occur until loaded.
- Edge cases like single-slide scenario not specially handled (arrows/dots still render).

## Cross-Browser & Device
- Relies on browser support for `scrollTo({ behavior: 'smooth' })`; older Safari versions may not animate smoothly but still function.
- Uses CSS classes from DaisyUI/Tailwind; requires modern CSS (flexbox, backdrop filters) which may degrade on legacy browsers without fallbacks.
- Touch users can swipe thanks to horizontal overflow + snap, but no explicit `touch-action` or gesture thresholds; `scrollbar-hide` may not affect all browsers.
- Full viewport height via `h-screen` may cause address-bar overlap issues on mobile Safari (ignores dynamic viewport units).

## Security & Privacy
- Component renders static marketing content; no user input or data collection hooks.
- External links (booking, tel) are hard-coded in `slides.ts`; no validation performed but URLs are trusted first-party destinations.
- No third-party scripts loaded directly by slideshow, though background images come from local assets bundled at build time.

## Testing
- No unit, integration, or E2E tests reference `DaisyUISlideshow` or `Showcase`; behavior relies on manual QA.
- Lack of visual regression coverage risks unnoticed styling regressions when slide content or theme changes.
- No automated accessibility tests in repo targeting slideshow interactions.

## Maintainability & Technical Debt
- `DaisyUISlideshow.tsx` concentrates logic, rendering, and interaction in ~240 lines; readable but lacks comments or decomposition, making modifications harder.
- Static slides data hard-coded, preventing reuse with different datasets without code edits; duplication risk if other contexts need similar slideshow.
- Directory contains legacy/alternative implementations (e.g., `Slideshow.tsx`, hooks) increasing confusion about canonical component.
- Timer logic and global listeners embedded inline with rendering; extracting hooks could improve testability.
- Magic numbers (interval default 5000, button dimensions) scattered in component instead of config constants.

## Comparison & Best Practices
- Compared to libraries like Swiper or Embla, implementation lacks touch gesture tuning, loop virtualization, and accessible pause controls.
- Does not meet APG carousel recommendations (focus management, visible focus, user-controlled autoplay toggle).
- Animations do not honor `prefers-reduced-motion`, and there is no CPU/network adaptive logic unlike legacy `Slideshow.tsx`.
- Lacks modular API for customizing slides or transitions; deviates from composable React patterns (compound components).

## Recommendations & Roadmap
- Prioritize accessibility parity with APG: add pause/stop controls, focus-visible styling, and respect `prefers-reduced-motion`.
- Refine timer/keyboard logic (pause on focus, clear intervals robustly, gate global listeners).
- Consider migrating to modular architecture or reinstating enhanced `Slideshow` variant with controlled props/data injection.
- Add automated tests (unit + visual regression) and monitors for asset load failures.
