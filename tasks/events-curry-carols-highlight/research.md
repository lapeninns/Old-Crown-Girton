# Research – Events Page Curry & Carols Highlight

## Existing structure
- `app/events/page.tsx` now includes top special booking banner, hero, then main content. The Live Sports section begins with comment `/* Live Sports Section */` around line 116.
- Sections use `FadeIn` animation wrapper and Tailwind classes. Headings within main content are generally `<h2>` inside sections.

## Curry & Carols page
- `app/events/curry-and-carols/page.tsx` provides event copy, ensuring messaging (dates 16 & 17 December 2025, £35 per guest) that can be reused for highlight.
- CTA target should be the new page; relative link `/events/curry-and-carols` should work in production while matching provided localhost URL during dev.

## Pattern considerations
- Should insert highlight section before Live Sports block, likely with card-like layout and strong gradient background to stand out.
- `MotionLinkButton` ensures consistent styling & focus states. For section-level CTA, we can use a single button linking to the event page.
- Use brand color tokens; highlight likely uses warm festive gradient similar to event page hero.

## Accessibility & guidelines
- Provide heading `<h2>` for the section. Keep emoji `aria-hidden` if decorative.
- Maintain `touch-action: manipulation` on button if mimic previous CTAs.
- Ensure text contrasts (white on gradient) and that CTA has explicit `ariaLabel` referencing Curry & Carols.

## Open questions
- None: copy can reference "Curry & Carols" with dates and price, encouraging booking via highlight CTA.
