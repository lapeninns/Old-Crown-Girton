# Implementation Plan: Seasonal Promo Banner Surface

## Objective
Restore the seasonal promo banner's intended light surface by ensuring the `bg-brand-50/90` utility actually renders a near-white background instead of falling back to transparent.

## Success Criteria
- [ ] `SeasonalPromoBanner` shows a light cream/white tone across all browsers.
- [ ] Underlying hero imagery no longer bleeds through the banner.
- [ ] `config/content/components/consolidatedBanner.json` remains in sync with the rendered class stack.

## Architecture
### Styling Strategy
- Define a custom CSS utility in `app/globals.css` for `.bg-brand-50/90` (escaped selector) that first falls back to solid `var(--color-brand-50)` and then applies `color-mix(..., transparent)` to emulate 90% opacity.
- Keep existing Tailwind utility usage unchanged in React + JSON to minimize churn and preserve content portability.

### Components/Files
- `app/globals.css`: add the utility rule alongside other manual `.bg-brand-*` helpers.
- `components/restaurant/SeasonalPromoBanner.tsx`: no structural changes needed beyond relying on the fixed class; verify no additional overrides exist.
- `config/content/components/consolidatedBanner.json`: confirm class list stays accurate; update documentation comments if needed.

### Data Flow / Dependencies
- The seasonal banner class list flows from both code and JSON; fixing the shared class ensures all consumers display the correct tone without duplicating inline styles.

## Testing Strategy
- Use Story/dev build via Chrome DevTools (MCP) to inspect computed background color on the promo banner.
- Validate the banner surface stays light on desktop + mobile viewports.
- Check computed styles ensure `background-color` resolves to a valid color and not `rgb(#hex / alpha)`.

## Edge Cases & Considerations
- Browsers lacking `color-mix()` should still see the fallback `var(--color-brand-50)` solid color (still acceptable per requirement).
- Ensure the new selector is properly escaped to avoid Tailwind purge removing it; placing it in `globals.css` keeps it always available.
- Verify no other translucent brand utilities are needed right now; document approach for future shades if stakeholders ask.

## Rollout
- Single CSS change; no feature flags required. Once deployed, banner surface updates immediately for all users.
