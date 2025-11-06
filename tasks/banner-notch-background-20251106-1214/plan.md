# Implementation Plan: Banner Notch Background Alignment

## Objective
- Ensure the Safari/iOS notch/status bar background tint matches the seasonal banner’s brand surface for a consistent top-of-page experience.

## Success Criteria
- [ ] `<meta name="theme-color">` in `app/layout.tsx` matches the banner’s terracotta tone (hex `#fdf6f5`).
- [ ] Light-mode status bar color aligns with the banner when inspected via device emulation / DOM metadata.
- [ ] Dark-mode theme-color fallback remains untouched.

## Architecture
- Apply a static metadata update (no runtime logic) so the browser UI inherits the new tint.
- Keep existing layout hierarchy; no new components required.

### Components
- `app/layout.tsx` — adjust the light theme-color meta tag.

### State Management
- No state changes required.

### API Integration
- N/A.

## Implementation Steps
1. Update the light-mode theme-color meta content to `#fdf6f5`.
2. Confirm there are no conflicting overrides or scripts mutating theme-color.
3. Document the change in `todo.md` and proceed to verification.

## Edge Cases
- Seasonal banner removal in future may require re-tuning the theme-color (communicate in notes if necessary).
- Ensure head metadata contains only one light-mode theme-color entry to avoid ambiguity.

## Testing
- Inspect rendered `<head>` in dev build (via Chrome DevTools) to confirm the new meta value.
- Use responsive device mode with an iPhone profile to ensure the top UI adopts the updated color.

## Rollout
- No special rollout; deploy via standard release process.
