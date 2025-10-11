# Research: Homepage Review

## Initial Requirements
- Understand the current homepage architecture to prepare a detailed review.
- Identify the conventions, data sources, and UI building blocks already used on the page.
- Surface any obvious accessibility, performance, or design-system considerations before drafting the review.

## Success Criteria
- Document how homepage content is composed (server vs client components, data loaders).
- List reusable patterns/components that should guide any critique or future changes.
- Capture constraints from `agents.md` that directly impact homepage work (DaisyUI preference, accessibility mandates, etc.).

## Existing Patterns
- **Server-driven entry point:** `app/page.tsx` builds schema.org data and hydrates client UI via `ClientHomeContent` while fetching marketing/content data (`app/page.tsx`).  
- **Progressive client shell:** `components/ClientHomeContent.tsx` wraps sections in `ProgressiveSection`, using CSS states defined in `app/globals.css` for staged reveal and SSR-friendly hydration.  
- **Content hooks:** Section components call hooks such as `useHomeContent` to pull normalized CMS/JSON data with defaults (`app/_components/AboutSection.tsx`, `app/_content/useHomeContent.ts`).  
- **Design tokens & Tailwind:** Layout relies on Tailwind utility classes paired with custom tokens (e.g., `text-brand-700`, `bg-brand-700`) supplied by `globals.css` and design-system theme.  
- **Dynamic imports with SSR enabled:** Below-the-fold sections rely on `next/dynamic` for chunk splitting while keeping SSR (`components/ClientHomeContent.tsx`).  
- **Error boundaries for hero media:** Showcase wraps `DaisyUISlideshow` in an error boundary to guard against runtime failures (`components/slideshow/Showcase.tsx`).

## External Resources
- DaisyUI and Tailwind design tokens already defined in the project (no direct docs linked, but enforced by `agents.md`).
- Accessibility standards referenced in `agents.md`, notably WAI-ARIA APG keyboard/focus guidelines.

## Technical Constraints
- Follow `agents.md` mandates: prefer DaisyUI components, ensure mobile-first layouts, and meet accessibility requirements (focus states, touch targets, screen reader support).  
- Homepage relies on server-only loaders (JSON + optional API fallback); any review should respect caching and fallback behaviour in `src/lib/data/server-loader.ts`.  
- Progressive loading styles in `app/globals.css` require sections to coordinate `progressive-section*` class names.  
- Navbar is fixed at the top and manipulates DOM styles directly, so any critique must consider scroll handling (`components/restaurant/Navbar.tsx`).

## Open Questions
- Do we need to benchmark actual runtime behaviour (e.g., animation smoothness) via Chrome DevTools during verification?  
- Are there DaisyUI primitives that the homepage should employ but currently bypasses (e.g., Carousel, Hero)?

## Recommendations
- Map each homepage section to its component to streamline review notes (Hero → `Showcase`, Press → `PressFeatureBanner`, etc.).  
- During verification, plan to inspect progressive loading states, focus management, and mobile viewport behaviour using Chrome DevTools as mandated.  
- Record any deviations from DaisyUI usage or accessibility standards for the review deliverable.
