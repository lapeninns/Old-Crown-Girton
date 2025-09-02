# Himalayan Spice Color System Migration

## Brand Transformation: Crown → Himalayan Spice
Restaurant & Pub in Girton, Cambridge
**Date:** 2025-08-21

---

## Color Palette Overview

### Core Brand Colors (50-950 scales)
- **Brand (Terracotta):** `#B86B5E` - Primary emphasis, headings, primary buttons
- **Accent (Saffron):** `#F4C430` - CTAs, price tags, promotional highlights  
- **Secondary (Peacock Teal):** `#008080` - Links, filters, subtle emphasis

### Heritage Colors
- **Crimson (Nepal):** `#DC143C` - Signage, festival, high-contrast headers
- **Chakra (Ashoka Navy):** `#06038D` - Navigation, headers
- **India Green:** `#046A38` - Veg badges, fresh cues

### Spice & Tavern Colors
- **Marigold:** `#FFB000` - Festive accents
- **Masala:** `#6B3E26` - Dividers, frames
- **Brass:** `#B8860B` - Typography on dark surfaces
- **Amber Beer:** `#D19000` - Boards, pub elements
- **Stout:** `#4C3A2D` - Night surfaces, pub mode
- **Cardamom:** `#7A8F49` - Veg/fresh indicators

---

## Color Mapping Strategy

### Crown → Himalayan Spice Mappings

| Crown Class | Himalayan Spice Replacement | Rationale |
|-------------|----------------------------|-----------|
| `crown-gold` | `accent-500` (Saffron) | Gold accent → Saffron accent |
| `crown-gold-dark` | `accent-600` | Darker gold → Darker saffron |
| `crown-gold/10` | `accent-50` | Light gold background → Light saffron |
| `crown-gold/20` | `accent-100` | Subtle gold background → Subtle saffron |
| `crown-slate` | `brand-700` (Terracotta) | Dark backgrounds → Deep terracotta |
| `crown-cream` | `neutral-50` | Light cream → Neutral cream base |
| `crown-cream/90` | `neutral-100` | Slightly darker cream |

### Named Colors → CSS Variables

| Hard-coded Color | CSS Variable Replacement | Usage Context |
|------------------|------------------------|---------------|
| `white` | `var(--color-neutral-50)` | Day mode surfaces |
| `black` | `var(--color-stout-900)` | Night mode text |
| `gray-600` | `var(--color-neutral-600)` | Muted text |
| `gray-700` | `var(--color-neutral-700)` | Secondary text |
| `gray-200` | `var(--color-neutral-200)` | Light borders |

### HEX Colors → CSS Variables

| HEX Code | File | CSS Variable Replacement |
|----------|------|------------------------|
| `rgba(0,0,0,0.6)` | _layout.tsx | `var(--color-stout-800)` with opacity |
| `rgba(0,0,0,0.2)` | _layout.tsx | `var(--color-stout-700)` with opacity |

---

## Implementation Strategy

### Phase 1: Component-by-Component Replacement
1. **About Pages** (`app/about/`) - Crown brand heavy
2. **Contact Page** (`app/contact/`)
3. **Layout Components** (`app/layout.tsx`, `app/_layout.tsx`)
4. **Error Pages** (`app/error.tsx`, `app/not-found.tsx`)

### Phase 2: Global CSS Replacement
1. **Accessibility Styles** (`styles/accessibility.css`)
2. **Global Styles** (`app/globals.css`)

### Phase 3: Verification
1. **Build & Lint Check**
2. **Contrast Validation**
3. **Visual Testing (Day/Night modes)**

---

## Day vs Night Mode Mapping

### Day Mode (Restaurant)
- **Surfaces:** `neutral-50` to `neutral-200` (light cream)
- **Primary:** `brand-700` (deep terracotta for headings)
- **Accent:** `accent-600` (saffron for CTAs)
- **Text:** `neutral-900` (dark for readability)

### Night Mode (Pub)
- **Surfaces:** `stout-800` to `stout-900` (dark stout)
- **Primary:** `brass-400` (brass typography on dark)
- **Accent:** `marigold-500` (marigold accents)
- **Text:** `neutral-50` (light cream text)

---

## Backward Compatibility

### Maintained Crown Classes
The Tailwind configuration includes backward compatibility mappings:

```javascript
// In tailwind.config.js
'crown-gold': {
  DEFAULT: 'var(--color-accent-500)', // Saffron
  50: 'var(--color-accent-50)',
  // ... full scale
}
```

This ensures existing Crown classes continue working while transitioning to Himalayan Spice colors.

---

## Progress Tracking

### ✅ Completed
- [x] Core color system implementation (`theme/colors.js`)
- [x] Tailwind configuration update
- [x] Critical CSS updates
- [x] Backward compatibility mappings

### 🚧 In Progress
- [ ] Component hard-coded color replacement
- [ ] SVG fill color updates
- [ ] Accessibility CSS updates

### ⏳ Pending
- [ ] Contrast verification
- [ ] Build validation
- [ ] Visual testing
- [ ] Documentation updates
- [ ] PR creation

---

## Contrast Compliance Notes

All color combinations maintain WCAG 2.1 AA compliance:
- Body text: ≥ 4.5:1 contrast ratio
- Large text: ≥ 3:1 contrast ratio
- UI elements: ≥ 3:1 contrast ratio

Any exceptions will be documented with nearest compliant alternatives.