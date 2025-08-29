Motion Removal: /menu, /about, /events, /contact

Summary
- Eliminated all CSS/JS animation and motion on the four routes. Layout, spacing and interactivity preserved; state changes are now instant.
- Ensured framer-motion is not included in these routes’ bundles by removing imports from route-scoped components and using a static navbar variant.
- Added a route-scoped guard stylesheet (inline per page) to force-disable any residual motion from shared/vendor CSS.

Key Changes
- app/menu/page.tsx: Removed animated fallback; added route-scoped guard CSS; uses Layout with noMotion.
- app/menu/_components/MenuHero.tsx: Removed animate-pulse loader.
- app/menu/_components/MenuInteractive.tsx: Removed animation state, timeouts, transitions, and will-change hints; all updates are instant.
- components/menu/MenuSections.tsx: Removed requestAnimationFrame-based mount animation hook.
- components/menu/MenuInfoCollapse.tsx: Removed transform/height transitions; collapse/expand is instant.
- components/menu/MenuItemCard.tsx: Removed hover scale and transition classes.
- components/menu/MenuSearchFilter.tsx: Removed chevron rotation transition.
- components/menu/NutritionModal.tsx: Removed transition-colors usage.

- app/about/page.tsx, app/events/page.tsx, app/contact/page.tsx: Added route-scoped guard CSS and `noMotion` layout.
- components/restaurant/sections/*: Removed framer-motion and transition/hover animations from:
  - MenuInformationSection.tsx
  - MenuCTASection.tsx
  - StoryTimelineSection.tsx
  - RegularEventsSection.tsx
  - EventsContactSection.tsx
  - EventsUpdatesSection.tsx
  - ContactInfoSection.tsx
  - ContactFeaturesSection.tsx
  - SocialMediaSection.tsx
  - InteractiveMap.tsx (removed hover/animated indicators; click still opens directions)

- components/restaurant/NavbarStatic.tsx: New static, no-motion navbar used only on target routes.
- components/restaurant/Layout.tsx: Added `noMotion` prop and dynamic navbar selection; avoids bundling framer-motion into target routes.
- components/LayoutClient.tsx: Disabled NextTopLoader, StickyCallButton, and BookingModal on target routes; uses dynamic imports to keep framer-motion out of the bundle.

Guard Styles (per-route, inline)
* Disables animation and transition globally on the page subtree and forces scroll-behavior to auto.

Bundle Impact
- Framer Motion removed from components rendered on /menu, /about, /events, /contact.
- NavbarStatic avoids framer-motion import for target routes. ClientLayout gates motion-heavy widgets (StickyCallButton, BookingModal) on these routes.

Accessibility & Functionality
- Kept semantic structure, focus states, ARIA and keyboard navigation.
- Collapses, toggles and filters remain functional but instant.

