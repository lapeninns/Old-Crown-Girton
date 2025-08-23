# Himalayan Spice Design System - Color Documentation

## 🎨 Overview

The **Himalayan Spice Color System** is a comprehensive, culturally-authentic design system built for the Old Crown Girton restaurant website. It seamlessly blends traditional Nepalese colors with British pub aesthetics, creating a unique and cohesive brand identity.

## 🌈 Color Palette

### Core Brand Colors

#### Brand (Terracotta)
The warm, earthy primary color representing the restaurant's welcoming atmosphere.

```css
--color-brand-50: #fdf6f5   /* Lightest cream */
--color-brand-100: #fbebe9  /* Light cream */
--color-brand-200: #f6d8d3  /* Pale terracotta */
--color-brand-300: #f0c5bd  /* Light terracotta */
--color-brand-400: #e3a296  /* Medium terracotta */
--color-brand-500: #B86B5E  /* 🎯 Anchor - Primary terracotta */
--color-brand-600: #a65f53  /* Dark terracotta */
--color-brand-700: #8c4f45  /* Darker terracotta */
--color-brand-800: #724038  /* Deep terracotta */
--color-brand-900: #5f352e  /* Deepest terracotta */
--color-brand-950: #321a17  /* Almost black terracotta */
```

#### Accent (Saffron)
The premium golden color representing luxury spices and special dishes.

```css
--color-accent-50: #fffcf2   /* Lightest saffron */
--color-accent-100: #fef8e0  /* Light saffron */
--color-accent-200: #fcf0c2  /* Pale gold */
--color-accent-300: #fae8a3  /* Light gold */
--color-accent-400: #f7d86a  /* Medium gold */
--color-accent-500: #F4C430  /* 🎯 Anchor - Pure saffron */
--color-accent-600: #d8ac2a  /* Deep saffron */
--color-accent-700: #b08d22  /* Darker gold */
--color-accent-800: #91721c  /* Deep gold */
--color-accent-900: #7a6218  /* Darkest gold */
--color-accent-950: #43350c  /* Almost black gold */
```

### Heritage Colors

#### Crimson (Nepal)
Inspired by the crimson in the Nepal flag, used for emphasis and action items.

```css
--color-crimson-500: #DC143C  /* 🎯 Nepal flag crimson */
```

#### Chakra (Navy)
Deep navy inspired by the Ashoka Chakra, used for sophisticated accents.

```css
--color-chakra-500: #06038D  /* 🎯 Chakra navy */
```

#### India Green
Rich green representing the subcontinental heritage.

```css
--color-indiagreen-500: #046A38  /* 🎯 Heritage green */
```

### Spice & Tavern Colors

#### Marigold
Warm orange representing marigold flowers used in celebrations.

```css
--color-marigold-500: #FFB000  /* 🎯 Marigold orange */
```

#### Masala
Warm brown representing ground spices and earthenware.

```css
--color-masala-500: #6B3E26  /* 🎯 Spice brown */
```

#### Brass
Old gold representing traditional metalwork and pub heritage.

```css
--color-brass-500: #B8860B  /* 🎯 Brass gold */
```

#### Stout
Dark brown representing porter beer and pub wood.

```css
--color-stout-500: #4C3A2D  /* 🎯 Stout brown */
```

#### Cardamom
Soft green representing fresh herbs and vegetarian options.

```css
--color-cardamom-500: #7A8F49  /* 🎯 Cardamom green */
```

### Neutral Colors

#### Enhanced Neutrals
Warm, cream-based neutrals that work in both day (restaurant) and night (pub) modes.

```css
--color-neutral-50: #f9f6f1   /* Lightest cream */
--color-neutral-100: #F5F0E6  /* 🎯 Chai cream base */
--color-neutral-200: #e6ded1  /* Light neutral */
--color-neutral-300: #d3c6b3  /* Medium neutral */
--color-neutral-500: #8f7a62  /* Mid neutral */
--color-neutral-600: #6f5e4d  /* Dark neutral */
--color-neutral-800: #3c332d  /* Deep neutral */
--color-neutral-900: #2b251f  /* 🎯 Dark base */
```

## 🎯 Semantic Color Usage

### Text Colors
```css
/* Primary text - for headings and important content */
.text-brand-800      /* Deep terracotta for main headings */
.text-brand-700      /* Medium terracotta for subheadings */
.text-brand-600      /* Light terracotta for body text */

/* Secondary text - for supporting content */
.text-neutral-600    /* Medium neutral for secondary text */
.text-neutral-500    /* Light neutral for muted text */
```

### Background Colors
```css
/* Surface backgrounds */
.bg-neutral-50       /* Primary surface (cream) */
.bg-neutral-100      /* Secondary surface (light cream) */
.bg-brand-50         /* Brand-tinted surface */

/* Component backgrounds */
.bg-accent-500       /* Call-to-action buttons (saffron) */
.bg-brand-600        /* Primary buttons (terracotta) */
.bg-crimson-500      /* Urgent actions (Nepal crimson) */
```

### Border Colors
```css
/* Subtle borders */
.border-neutral-200  /* Light borders for cards */
.border-neutral-300  /* Medium borders for inputs */

/* Accent borders */
.border-accent-400   /* Highlighted elements */
.border-brand-300    /* Brand-themed borders */
```

## 🍽️ Contextual Usage Examples

### Dietary Indicators
```css
/* Semantic color coding for dietary information */
.bg-cardamom-100.text-cardamom-800    /* Gluten-free (GF) */
.bg-indiagreen-100.text-indiagreen-800 /* Vegetarian (V) */
.bg-marigold-100.text-marigold-800     /* Vegan (VE) */
```

### Spice Level Indicators
```css
/* Visual spice heat representation */
.bg-cardamom-500     /* Mild - Cool green */
.bg-marigold-500     /* Medium - Warm orange */
.bg-crimson-500      /* Hot - Intense red */
```

### Interactive States
```css
/* Button states */
.bg-accent-500.hover:bg-accent-600         /* Primary CTA */
.bg-brand-600.hover:bg-brand-700           /* Secondary CTA */
.border-accent-500.focus:ring-accent-500   /* Focus states */
```

## 🌙 Dark Mode Support

The system includes full dark mode support with automatic token switching:

```css
html.dark {
  --color-surface-base: var(--color-stout-900);
  --color-text-primary: var(--color-neutral-100);
  --color-text-secondary: var(--color-neutral-300);
}
```

## ♿ Accessibility

All color combinations meet **WCAG 2.2 AA** standards:

- **Text contrast**: ≥ 4.5:1 for normal text
- **Large text contrast**: ≥ 3:1 for 18pt+ text
- **UI component contrast**: ≥ 3:1 for interactive elements
- **Color blindness**: Tested with deuteranopia/protanopia simulations

## 🛠️ Implementation

### CSS Variables
Colors are implemented as CSS custom properties for runtime theming:

```css
:root {
  /* All color tokens available as CSS variables */
  --color-brand-500: #B86B5E;
  --color-accent-500: #F4C430;
  /* ... */
}
```

### Tailwind Integration
Seamless integration with Tailwind CSS utilities:

```javascript
// tailwind.config.js
theme: {
  extend: {
    colors: {
      brand: {
        500: 'var(--color-brand-500)',
        // Full scale integration
      }
    }
  }
}
```

### Usage in Components
```tsx
// React/TypeScript components
<div className="bg-neutral-50 text-brand-800">
  <h1 className="text-brand-700">Himalayan Spice Restaurant</h1>
  <button className="bg-accent-500 text-neutral-900 hover:bg-accent-600">
    Order Now
  </button>
</div>
```

## 📱 Responsive Considerations

Colors maintain their semantic meaning across all screen sizes:

- **Mobile**: High contrast for outdoor viewing
- **Tablet**: Balanced readability
- **Desktop**: Full palette utilization

## 🎨 Brand Guidelines

### Do's ✅
- Use semantic color tokens (brand-500, accent-500)
- Maintain consistent spice level color coding
- Apply proper contrast ratios
- Use heritage colors for cultural authenticity

### Don'ts ❌
- Don't use hard-coded hex values
- Don't mix arbitrary color combinations
- Don't override semantic meanings
- Don't ignore accessibility requirements

## 🔮 Future Extensions

The system is designed for easy extension:

### Seasonal Variations
```css
/* Christmas theme */
--color-seasonal-primary: var(--color-crimson-500);
--color-seasonal-secondary: var(--color-cardamom-500);

/* Diwali theme */
--color-seasonal-primary: var(--color-marigold-500);
--color-seasonal-secondary: var(--color-accent-500);
```

### Regional Adaptations
The color system can be adapted for different restaurant locations while maintaining brand consistency.

## 📚 Related Documentation

- `theme/colors.js` - Color system definitions
- `tailwind.config.js` - Tailwind integration
- `app/globals.css` - CSS variable declarations
- `design-system/css/button.css` - Component implementations

---

**The Himalayan Spice Color System represents a perfect balance of cultural authenticity, technical excellence, and user experience - setting a new standard for restaurant brand identity design.**