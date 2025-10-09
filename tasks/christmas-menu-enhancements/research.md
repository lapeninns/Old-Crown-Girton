# Research – Christmas Menu Enhancements

## Existing UI patterns to reuse
- The Christmas page already relies on pill badges (`inline-flex`, rounded-full, accent backgrounds) and large hero typography. Accent badges appear elsewhere (e.g. hero highlight chips) and are good precedents for emphasising key selling points like *mulled wine included* or price highlights.
- Pricing emphasis exists in the Chef’s Selections sidebar (`text-3xl font-display font-bold text-brand-800`). We can reuse the same typography but bring the price forward (e.g. hero subtext badge or summary list) for quicker scanning.
- The layout frequently uses small stacked cards with accent backgrounds (`bg-accent-100`, `bg-brand-50/70`). We can reuse these to craft a small callout row without introducing new aesthetics.
- Primary CTAs rely on the shared `MotionLinkButton` wrapper which already handles focus styling and motion. The Chef’s sidebar button (`w-full`, `bg-brand-700`) can be strengthened by adding an icon and clearer label text while keeping the component consistent with other CTAs.

## Audio behaviour references
- No existing component handles background audio today (`rg "<audio"` returns nothing). We’ll need a fresh client component.
- Accessibility guidance: auto-playing audio is discouraged; better to present an obvious control and only start playback after a user gesture. We should honour `prefers-reduced-motion` style since page already accounts for reduced motion; similarly we can check for `matchMedia('(prefers-reduced-motion)')` or keep logic simple but ensure pause/resume buttons exist.
- To stay hydration-safe, we can build a small `ChristmasMusicPlayer` client component that renders a `button` with `useRef<HTMLAudioElement>` to manage playback, exposing both Play and Pause actions and reflecting state with `aria-pressed` and visually hidden status text.

## Assets
- Festive track now lives at `public/audio/Jingle-Bells-3(chosic.com).mp3`; it replaces the previously referenced `scott-holmes-its-christmas-time.mp3`.
- `ChristmasMusicPlayer.tsx` currently hard-codes the old path and credits “It’s Christmas Time” by Scott Holmes (CC BY 4.0). We must update both the source constant and attribution copy to match the new track metadata while keeping the accessible status messaging intact.
- “Mulled wine included” appears in hero badges, the Chef’s drink pill, highlight copy, and metadata. We need to ensure each mention adds “or another drink of their choice” to meet the updated promise without breaking existing layout.

## Potential concerns / open questions
- Highlighting “mulled wine” should not rely on colour alone; combine colour plus icon/text for accessible emphasis.
- We should confirm whether price highlight should appear in hero (likely) while keeping Chef’s section price card for detail.
- Need to ensure the new audio toggle has a visible focus ring and doesn’t interfere with existing layout.
