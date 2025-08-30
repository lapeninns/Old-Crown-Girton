# Motion System Guide

This repo uses a centralized motion system based on Framer Motion to ensure consistency, performance, and accessibility.

## Foundation

- Tokens: `lib/motion/tokens.ts` – durations, easing, transform tokens.
- Variants: `lib/motion/variants.ts` – standard patterns (page transitions, reveals, interactive, lists) and `navMotion` config.
- Accessibility: `lib/motion/accessibility.tsx` – `MotionConfigProvider`, reduced motion resolver, focus utilities.
- Wrappers: `lib/motion/wrappers.tsx` – `createMotionWrapper(tag, variants)` dynamic motion elements with reduced-motion handling.
- Performance: `lib/motion/performance.tsx` – `MotionFeatures` (LazyMotion), performance marks, will-change helpers.

## Usage

- Route transitions: see `components/PageTransition.tsx` and `components/LayoutClient.tsx`. Pass `disableMotion` for route-level opt-out; honors `prefers-reduced-motion`.
- Navigation: see `components/Header.tsx` and `components/restaurant/Navbar.tsx`. Uses `navMotion` for active indicator and mobile drawer.
- Slideshow: `components/slideshow/Slideshow.tsx` – crossfade via `AnimatePresence`, gesture-driven changes with physics and preloader integration.

## Accessibility

- All animations respect `prefers-reduced-motion`.
- Use `MotionConfigProvider` at app shell to set `reducedMotion="user"`.
- For modals, use `accessibility.focusManagement` to trap/restore focus and `announceChange()` for SR updates.

## Performance

- Only animate opacity and transform; avoid layout properties.
- Use `MotionFeatures` to load Framer features lazily.
- For long-running animations, apply `will-change` during anim and clear after.

## Testing checklist

- Reduced motion behaves instantly (no transforms).
- Keyboard nav not blocked during animations.
- ARIA attributes maintained during open/close transitions.
- 60fps on target devices; no layout thrashing.

