# Emoji/Button Standardization Analysis

## Current State Analysis

### Good Patterns (✅ Already following best practices):
- `app/events/page.tsx` - Recently refactored with proper `aria-hidden="true"` on decorative emoji and `MotionLinkButton` for CTAs

### Issues Found (❌ Need standardization):

#### 1. Missing `aria-hidden` on decorative emoji:
- `components/restaurant/Footer.tsx` - Lines 27-29: `📍`, `📞`, `📧` emoji in contact info
- `components/restaurant/TakeawayBanner.tsx` - Lines 9, 36, 40: `🥡`, `🚗`, `📞` emoji 
- `components/slideshow/Slide.tsx` - Lines 25, 30, 38, 43, 51, 56, 65, 70: `🍽️`, `📞` in button text

#### 2. Inconsistent button patterns:
- Mix of plain `<a>` tags vs motion-enabled buttons
- Some buttons have emoji without accessible alternatives
- Inconsistent focus states and hover effects

#### 3. Files with many emoji that need review:
- `components/restaurant/LocationSection.tsx`
- `components/restaurant/BookingModal.tsx` 
- `components/restaurant/DishCard.tsx`
- `components/restaurant/Hero.tsx`
- `components/restaurant/AboutSection.tsx`
- `components/restaurant/sections/EventsContactSection.tsx`
- `components/restaurant/sections/ContactInfoSection.tsx`

## Standardization Plan

### Phase 1: Critical Accessibility Fixes (High Priority)
1. Add `aria-hidden="true"` to all decorative emoji
2. Ensure meaningful text accompanies emoji in interactive elements
3. Convert anchor-buttons to use consistent component pattern

### Phase 2: Component Standardization (Medium Priority) 
1. Create reusable `EmojiIcon` component for consistent emoji handling
2. Standardize CTA buttons to use `MotionLinkButton` where appropriate
3. Ensure consistent focus-visible styles

### Phase 3: Testing & Validation (Low Priority)
1. Run automated accessibility tests
2. Manual keyboard navigation testing
3. Screen reader testing

## Implementation Strategy
Start with 3-4 files maximum to validate approach, then apply to remaining files.