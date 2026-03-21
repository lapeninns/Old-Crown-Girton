---
task: frontend-consistency-polish
timestamp_utc: 2026-03-21T14:13:36Z
owner: github:@maintainers
reviewers: [github:@maintainers]
risk: medium
flags: []
related_tickets: []
---

# Implementation Plan: Frontend Consistency Polish

## Objective

We will make the Old Crown frontend feel visually consistent across the homepage, shared shell, and key interior routes so visitors experience one deliberate hospitality brand instead of a collection of similar-but-different pages.

## Success Criteria

- [ ] Navigation, section rhythm, CTA styling, and footer treatment feel consistent across the major public routes.
- [ ] The homepage and primary marketing pages share a common hierarchy, spacing system, and tonal palette.
- [ ] Shared design-system helpers are improved rather than bypassed.
- [ ] No existing route behavior, booking flow, or core content interaction regresses.

## Visual Thesis

Heirloom Gastropub: a dark twilight broadsheet with muted brick CTAs, brass accents, Newsreader display moments, Manrope utility typography, and tonal layering instead of hard borders.

## Content Plan

- Shared shell: orient, reassure, guide
- Homepage: hero, proof, story, menu, visit paths, close
- Interior pages: strong hero, one key framing section, clearer supporting detail, simpler close

## Interaction Thesis

- Keep motion restrained and noticeable only where it improves hierarchy.
- Use section reveals, hover lifts, and layered hero/shell depth consistently rather than page-specific effects.
- Make CTA clusters feel stable and easy to scan on mobile first.

## Architecture & Components

- Global styling in `app/globals.css`
- Shared recipes in `src/design-system/recipes.ts`
- Shared shell in `components/restaurant/Navbar.tsx`, `components/restaurant/NavbarParts.tsx`, and `components/ClientFooter.tsx`
- Font system in `app/layout.tsx` and `tailwind.config.js`
- Homepage orchestration in `components/ClientHomeContent.tsx` and `app/_components/*`
- Key page templates likely including `app/about/page.tsx`, `app/contact/page.tsx`, `app/events/page.tsx`, and `app/menu/page.tsx`

## Testing Strategy

- Production build verification
- Lint/type signal if available through existing scripts
- Verify the new `Newsreader` + `Manrope` setup does not break Next.js production builds
- Manual smoke review of homepage plus primary interior routes when browser tooling is available

## Rollout

- No feature flags for this polish pass.
- Keep scope limited to shared frontend presentation and directly affected top-level public routes.
- Record any manual QA gaps caused by unavailable browser tooling in `verification.md`.
