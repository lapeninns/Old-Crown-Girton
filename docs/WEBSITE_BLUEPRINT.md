# Restaurant Website Blueprint

> A comprehensive, production-ready blueprint for building a modern restaurant website.
> Lessons learned from Old Crown Girton, optimized for simplicity and maintainability.

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Technology Stack](#2-technology-stack)
3. [Project Structure](#3-project-structure)
4. [Pages & Routes](#4-pages--routes)
5. [Component Architecture](#5-component-architecture)
6. [Data & Content Management](#6-data--content-management)
7. [Styling System](#7-styling-system)
8. [Performance Strategy](#8-performance-strategy)
9. [SEO & Metadata](#9-seo--metadata)
10. [Accessibility](#10-accessibility)
11. [Deployment & Infrastructure](#11-deployment--infrastructure)
12. [Implementation Roadmap](#12-implementation-roadmap)
13. [Cost Estimation](#13-cost-estimation)

---

## 1. Executive Summary

### Purpose
Build a fast, accessible, and easily maintainable restaurant website that:
- Showcases the restaurant's brand and menu
- Enables table reservations
- Provides essential information (hours, location, contact)
- Supports SEO for local discovery
- Allows non-technical staff to update content

### Key Principles
| Principle | Implementation |
|-----------|----------------|
| **Simplicity** | ~15 dependencies, single component directory |
| **Performance** | Static generation, optimized images, minimal JS |
| **Maintainability** | Headless CMS for content, clear file structure |
| **Accessibility** | WCAG 2.1 AA compliance, keyboard navigation |
| **Mobile-first** | Responsive design, touch-friendly UI |

### What We're NOT Building
- ❌ Online ordering/e-commerce (use third-party like Square, Toast)
- ❌ User authentication (not needed for restaurant site)
- ❌ Complex animations (CSS transitions only)
- ❌ Real-time features (static is fine)

---

## 2. Technology Stack

### Core Stack (Minimal)

```
┌─────────────────────────────────────────────────────────┐
│                    PRODUCTION STACK                      │
├─────────────────────────────────────────────────────────┤
│  Framework:     Next.js 14 (App Router)                 │
│  Styling:       Tailwind CSS + DaisyUI                  │
│  CMS:           Sanity.io (free tier)                   │
│  Hosting:       Vercel (free tier)                      │
│  Images:        Cloudinary (free tier) or Vercel        │
│  Forms:         Formspree or Netlify Forms              │
│  Maps:          Google Maps Embed (free)                │
│  Analytics:     Vercel Analytics or Plausible           │
└─────────────────────────────────────────────────────────┘
```

### package.json (Target: ~15 dependencies)

```json
{
  "name": "restaurant-website",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@sanity/client": "^6.0.0",
    "@sanity/image-url": "^1.0.0",
    "next-sanity": "^7.0.0",
    "tailwindcss": "^3.4.0",
    "daisyui": "^4.10.0",
    "lucide-react": "^0.400.0",
    "zod": "^3.23.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "typescript": "^5.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

### Why This Stack?

| Choice | Rationale |
|--------|-----------|
| **Next.js 14** | Static generation, image optimization, great DX |
| **Tailwind + DaisyUI** | Rapid UI development, consistent design tokens |
| **Sanity CMS** | Free tier generous, real-time preview, easy for non-devs |
| **Vercel** | Zero-config deploys, edge network, free tier |
| **No Framer Motion** | CSS animations are sufficient, saves ~50KB |
| **No Supabase/Auth** | Restaurant site doesn't need user accounts |

---

## 3. Project Structure

```
restaurant-website/
├── app/                          # Next.js App Router
│   ├── (marketing)/              # Marketing pages group
│   │   ├── page.tsx              # Home
│   │   ├── menu/page.tsx         # Menu
│   │   ├── about/page.tsx        # About
│   │   ├── events/page.tsx       # Events & Private Hire
│   │   ├── contact/page.tsx      # Contact
│   │   └── book/page.tsx         # Reservations
│   ├── (legal)/                  # Legal pages group
│   │   ├── privacy/page.tsx
│   │   └── terms/page.tsx
│   ├── blog/                     # Blog (optional)
│   │   ├── page.tsx              # Blog listing
│   │   └── [slug]/page.tsx       # Blog post
│   ├── api/                      # API routes (minimal)
│   │   └── revalidate/route.ts   # CMS webhook for ISR
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Global styles
│   ├── not-found.tsx             # 404 page
│   └── error.tsx                 # Error boundary
│
├── components/                   # ALL components here (single source)
│   ├── layout/                   # Layout components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Navigation.tsx
│   │   └── MobileMenu.tsx
│   ├── sections/                 # Page sections (composable)
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── MenuHighlights.tsx
│   │   ├── Testimonials.tsx
│   │   ├── Location.tsx
│   │   ├── CallToAction.tsx
│   │   └── Gallery.tsx
│   ├── ui/                       # Reusable UI primitives
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Input.tsx
│   │   └── Modal.tsx
│   ├── menu/                     # Menu-specific components
│   │   ├── MenuCategory.tsx
│   │   ├── MenuItem.tsx
│   │   └── DietaryBadge.tsx
│   └── forms/                    # Form components
│       ├── BookingForm.tsx
│       └── ContactForm.tsx
│
├── lib/                          # Utilities & helpers
│   ├── sanity/                   # CMS client & queries
│   │   ├── client.ts
│   │   ├── queries.ts
│   │   └── image.ts
│   ├── utils.ts                  # General utilities
│   └── constants.ts              # Site-wide constants
│
├── types/                        # TypeScript definitions
│   ├── menu.ts
│   ├── content.ts
│   └── sanity.ts
│
├── public/                       # Static assets
│   ├── images/
│   │   ├── logo.svg
│   │   ├── og-image.jpg          # Social sharing image
│   │   └── favicon.ico
│   └── fonts/                    # Self-hosted fonts (optional)
│
├── sanity/                       # Sanity Studio (embedded)
│   ├── schemas/
│   │   ├── menu.ts
│   │   ├── page.ts
│   │   ├── testimonial.ts
│   │   └── settings.ts
│   └── sanity.config.ts
│
├── .env.local                    # Environment variables
├── next.config.js                # Next.js config (minimal)
├── tailwind.config.js            # Tailwind + DaisyUI config
├── tsconfig.json
└── README.md
```

### Structure Rules

1. **Single `components/` directory** - No `app/_components`, no `src/components`
2. **Flat where possible** - Avoid deep nesting
3. **Colocation** - Keep related files together
4. **Clear naming** - PascalCase for components, kebab-case for routes

---

## 4. Pages & Routes

### Site Map

```
/                     → Home (landing page)
/menu                 → Full menu with categories
/about                → Restaurant story, team, history
/events               → Private hire, special events, wakes
/contact              → Contact form, info, hours
/book                 → Table reservation
/blog                 → Articles (SEO content) [optional]
/blog/[slug]          → Individual blog post
/privacy              → Privacy policy
/terms                → Terms of service
```

### Page Specifications

#### Home Page (`/`)

```
┌─────────────────────────────────────────────────────────┐
│  HEADER (sticky)                                        │
│  Logo | Nav: Menu, About, Events, Book | CTA Button     │
├─────────────────────────────────────────────────────────┤
│  HERO                                                   │
│  - Full-width image/video background                    │
│  - Headline + tagline                                   │
│  - 2 CTAs: "View Menu" | "Book a Table"                 │
│  - Scroll indicator                                     │
├─────────────────────────────────────────────────────────┤
│  PRESS BANNER (optional)                                │
│  - "As featured in..." logos or quote                   │
├─────────────────────────────────────────────────────────┤
│  ABOUT PREVIEW                                          │
│  - Image + short intro text                             │
│  - "Read our story" link                                │
├─────────────────────────────────────────────────────────┤
│  MENU HIGHLIGHTS                                        │
│  - 3-4 signature dishes with images                     │
│  - "View full menu" CTA                                 │
├─────────────────────────────────────────────────────────┤
│  TESTIMONIALS                                           │
│  - 3 customer reviews (carousel or grid)                │
│  - Star ratings                                         │
├─────────────────────────────────────────────────────────┤
│  LOCATION & HOURS                                       │
│  - Embedded Google Map                                  │
│  - Address, phone, email                                │
│  - Opening hours table                                  │
├─────────────────────────────────────────────────────────┤
│  CALL TO ACTION                                         │
│  - "Ready to visit?" + Book button                      │
├─────────────────────────────────────────────────────────┤
│  FOOTER                                                 │
│  - Contact info | Social links | Legal links            │
│  - © Copyright                                          │
└─────────────────────────────────────────────────────────┘
```

#### Menu Page (`/menu`)

```
┌─────────────────────────────────────────────────────────┐
│  HEADER                                                 │
├─────────────────────────────────────────────────────────┤
│  HERO (compact)                                         │
│  - "Our Menu" heading                                   │
│  - Dietary filter buttons (V, VG, GF)                   │
├─────────────────────────────────────────────────────────┤
│  CATEGORY TABS                                          │
│  - Starters | Mains | Sides | Desserts | Drinks         │
├─────────────────────────────────────────────────────────┤
│  MENU ITEMS (grid)                                      │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │
│  │ [Image]     │ │ [Image]     │ │ [Image]     │       │
│  │ Dish Name   │ │ Dish Name   │ │ Dish Name   │       │
│  │ Description │ │ Description │ │ Description │       │
│  │ £12.50 [VG] │ │ £15.00      │ │ £8.50 [GF]  │       │
│  └─────────────┘ └─────────────┘ └─────────────┘       │
├─────────────────────────────────────────────────────────┤
│  ALLERGEN NOTICE                                        │
│  - Standard disclaimer                                  │
├─────────────────────────────────────────────────────────┤
│  CTA: Book a Table                                      │
├─────────────────────────────────────────────────────────┤
│  FOOTER                                                 │
└─────────────────────────────────────────────────────────┘
```

#### Book Page (`/book`)

```
┌─────────────────────────────────────────────────────────┐
│  HEADER                                                 │
├─────────────────────────────────────────────────────────┤
│  BOOKING FORM                                           │
│  - Date picker                                          │
│  - Time slots (dropdown)                                │
│  - Party size (1-12)                                    │
│  - Name, Email, Phone                                   │
│  - Special requests (textarea)                          │
│  - Submit button                                        │
├─────────────────────────────────────────────────────────┤
│  BOOKING TERMS                                          │
│  - Cancellation policy                                  │
│  - Large party info                                     │
├─────────────────────────────────────────────────────────┤
│  ALTERNATIVE: Phone booking                             │
│  - "Prefer to call? [phone number]"                     │
├─────────────────────────────────────────────────────────┤
│  FOOTER                                                 │
└─────────────────────────────────────────────────────────┘
```

---

## 5. Component Architecture

### Component Categories

```
┌─────────────────────────────────────────────────────────┐
│                   COMPONENT HIERARCHY                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  LAYOUT COMPONENTS (app-wide)                           │
│  └── Header, Footer, Navigation, MobileMenu             │
│                                                         │
│  SECTION COMPONENTS (page sections)                     │
│  └── Hero, About, MenuHighlights, Testimonials,         │
│      Location, CallToAction, Gallery                    │
│                                                         │
│  FEATURE COMPONENTS (domain-specific)                   │
│  └── MenuCategory, MenuItem, BookingForm, ContactForm   │
│                                                         │
│  UI COMPONENTS (primitives, reusable)                   │
│  └── Button, Card, Badge, Input, Modal, Skeleton        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Key Component Specifications

#### Button Component

```tsx
// components/ui/Button.tsx
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  href?: string;           // Renders as <a> if provided
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

// Uses DaisyUI classes: btn btn-primary, btn-secondary, etc.
```

#### MenuItem Component

```tsx
// components/menu/MenuItem.tsx
interface MenuItemProps {
  name: string;
  description: string;
  price: number;
  image?: string;
  dietary: ('vegetarian' | 'vegan' | 'gluten-free')[];
  spiceLevel?: 1 | 2 | 3;
  featured?: boolean;
}
```

#### Hero Component

```tsx
// components/sections/Hero.tsx
interface HeroProps {
  headline: string;
  subheadline?: string;
  backgroundImage: string;
  primaryCTA: { text: string; href: string };
  secondaryCTA?: { text: string; href: string };
  overlay?: boolean;        // Dark overlay for text readability
}
```

### Component File Template

```tsx
// components/sections/About.tsx
import Image from 'next/image';
import { Button } from '@/components/ui/Button';

interface AboutProps {
  title: string;
  description: string;
  image: string;
  ctaText?: string;
  ctaHref?: string;
}

export function About({ title, description, image, ctaText, ctaHref }: AboutProps) {
  return (
    <section 
      id="about" 
      className="py-16 md:py-24 bg-base-100"
      aria-labelledby="about-heading"
    >
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
            <Image
              src={image}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          
          {/* Content */}
          <div className="space-y-6">
            <h2 id="about-heading" className="text-3xl md:text-4xl font-bold">
              {title}
            </h2>
            <p className="text-lg text-base-content/80 leading-relaxed">
              {description}
            </p>
            {ctaText && ctaHref && (
              <Button variant="primary" href={ctaHref}>
                {ctaText}
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
```

---

## 6. Data & Content Management

### Sanity CMS Schema

#### Menu Item Schema

```ts
// sanity/schemas/menuItem.ts
export default {
  name: 'menuItem',
  title: 'Menu Item',
  type: 'document',
  fields: [
    { name: 'name', title: 'Name', type: 'string', validation: Rule => Rule.required() },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'name' } },
    { name: 'description', title: 'Description', type: 'text', rows: 3 },
    { name: 'price', title: 'Price (£)', type: 'number', validation: Rule => Rule.required().positive() },
    { name: 'image', title: 'Image', type: 'image', options: { hotspot: true } },
    { 
      name: 'category', 
      title: 'Category', 
      type: 'reference', 
      to: [{ type: 'menuCategory' }],
      validation: Rule => Rule.required()
    },
    { 
      name: 'dietary', 
      title: 'Dietary Info', 
      type: 'array', 
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Vegetarian', value: 'vegetarian' },
          { title: 'Vegan', value: 'vegan' },
          { title: 'Gluten Free', value: 'gluten-free' },
          { title: 'Contains Nuts', value: 'nuts' },
          { title: 'Dairy Free', value: 'dairy-free' },
        ]
      }
    },
    { name: 'spiceLevel', title: 'Spice Level (1-3)', type: 'number', validation: Rule => Rule.min(0).max(3) },
    { name: 'featured', title: 'Featured on Homepage', type: 'boolean', initialValue: false },
    { name: 'available', title: 'Currently Available', type: 'boolean', initialValue: true },
    { name: 'order', title: 'Display Order', type: 'number' },
  ],
  preview: {
    select: { title: 'name', subtitle: 'category.name', media: 'image' }
  }
}
```

#### Site Settings Schema

```ts
// sanity/schemas/siteSettings.ts
export default {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    { name: 'restaurantName', title: 'Restaurant Name', type: 'string' },
    { name: 'tagline', title: 'Tagline', type: 'string' },
    { name: 'logo', title: 'Logo', type: 'image' },
    { name: 'phone', title: 'Phone Number', type: 'string' },
    { name: 'email', title: 'Email', type: 'string' },
    { 
      name: 'address', 
      title: 'Address', 
      type: 'object',
      fields: [
        { name: 'street', type: 'string' },
        { name: 'city', type: 'string' },
        { name: 'postcode', type: 'string' },
        { name: 'country', type: 'string', initialValue: 'United Kingdom' },
      ]
    },
    {
      name: 'openingHours',
      title: 'Opening Hours',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'days', title: 'Days', type: 'string' },  // e.g., "Monday - Friday"
          { name: 'hours', title: 'Hours', type: 'string' }, // e.g., "12:00 - 22:00"
        ]
      }]
    },
    {
      name: 'socialLinks',
      title: 'Social Media',
      type: 'object',
      fields: [
        { name: 'facebook', type: 'url' },
        { name: 'instagram', type: 'url' },
        { name: 'twitter', type: 'url' },
        { name: 'tripadvisor', type: 'url' },
      ]
    },
    { name: 'googleMapsEmbed', title: 'Google Maps Embed URL', type: 'url' },
  ],
  // Singleton - only one settings document
  __experimental_actions: ['update', 'publish']
}
```

### Data Fetching Pattern

```ts
// lib/sanity/queries.ts
import { groq } from 'next-sanity';

export const menuQuery = groq`
  *[_type == "menuItem" && available == true] | order(category->order asc, order asc) {
    _id,
    name,
    description,
    price,
    "image": image.asset->url,
    "category": category->name,
    dietary,
    spiceLevel,
    featured
  }
`;

export const featuredDishesQuery = groq`
  *[_type == "menuItem" && featured == true && available == true][0...4] {
    _id,
    name,
    description,
    price,
    "image": image.asset->url,
    dietary
  }
`;

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    restaurantName,
    tagline,
    "logo": logo.asset->url,
    phone,
    email,
    address,
    openingHours,
    socialLinks,
    googleMapsEmbed
  }
`;
```

```ts
// lib/sanity/client.ts
import { createClient } from 'next-sanity';

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: process.env.NODE_ENV === 'production',
});

// Typed fetch helper
export async function sanityFetch<T>(query: string, params = {}): Promise<T> {
  return client.fetch<T>(query, params);
}
```

### Content Structure Overview

```
SANITY CMS DOCUMENTS
├── siteSettings (singleton)
│   ├── Restaurant name, logo, contact
│   ├── Opening hours
│   └── Social links
├── menuCategory[]
│   └── name, slug, order, image
├── menuItem[]
│   └── name, price, description, dietary, category ref
├── testimonial[]
│   └── name, quote, rating, date
├── event[]
│   └── title, description, image, date (for special events)
├── page[]
│   └── About, Events, Contact (editable content blocks)
└── blogPost[] (optional)
    └── title, slug, content, author, publishedAt
```

---

## 7. Styling System

### Tailwind Configuration

```js
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Custom brand colors (override DaisyUI if needed)
        brand: {
          50: '#fdf8f6',
          100: '#f2e8e5',
          200: '#eaddd7',
          300: '#e0cec7',
          400: '#d2bab0',
          500: '#bfa094',
          600: '#a18072',
          700: '#977669',
          800: '#846358',
          900: '#43302b',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
        },
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        restaurant: {
          'primary': '#846358',        // Brand primary
          'primary-content': '#ffffff',
          'secondary': '#bfa094',      // Brand secondary
          'secondary-content': '#1f1f1f',
          'accent': '#d4a574',         // Gold accent
          'accent-content': '#1f1f1f',
          'neutral': '#1f1f1f',
          'neutral-content': '#ffffff',
          'base-100': '#ffffff',
          'base-200': '#f8f5f2',
          'base-300': '#f2e8e5',
          'base-content': '#1f1f1f',
          'info': '#3b82f6',
          'success': '#22c55e',
          'warning': '#f59e0b',
          'error': '#ef4444',
        },
      },
    ],
    darkTheme: false,  // Disable dark mode for simplicity
  },
};
```

### CSS Custom Properties

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Typography scale */
    --font-display: 'Playfair Display', serif;
    --font-body: 'Inter', sans-serif;
    
    /* Spacing */
    --section-padding: 4rem;
    --section-padding-lg: 6rem;
    
    /* Animation */
    --transition-fast: 150ms ease;
    --transition-normal: 300ms ease;
  }
  
  /* Smooth scroll */
  html {
    scroll-behavior: smooth;
  }
  
  @media (prefers-reduced-motion: reduce) {
    html {
      scroll-behavior: auto;
    }
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
  
  /* Focus styles */
  :focus-visible {
    outline: 2px solid hsl(var(--p));
    outline-offset: 2px;
  }
}

@layer components {
  /* Section spacing utility */
  .section {
    @apply py-16 md:py-24;
  }
  
  /* Prose styling for CMS content */
  .prose-restaurant {
    @apply prose prose-lg max-w-none;
    @apply prose-headings:font-display prose-headings:text-base-content;
    @apply prose-p:text-base-content/80;
    @apply prose-a:text-primary prose-a:no-underline hover:prose-a:underline;
  }
}
```

### Typography Scale

| Element | Font | Size (mobile) | Size (desktop) |
|---------|------|---------------|----------------|
| H1 | Display | 2.5rem | 4rem |
| H2 | Display | 2rem | 3rem |
| H3 | Display | 1.5rem | 2rem |
| Body | Body | 1rem | 1.125rem |
| Small | Body | 0.875rem | 0.875rem |

---

## 8. Performance Strategy

### Performance Budgets

| Metric | Target | Measurement |
|--------|--------|-------------|
| **LCP** | < 2.5s | Largest Contentful Paint |
| **FID** | < 100ms | First Input Delay |
| **CLS** | < 0.1 | Cumulative Layout Shift |
| **TTI** | < 3.5s | Time to Interactive |
| **Bundle Size** | < 150KB | Initial JS (gzipped) |
| **Page Weight** | < 1MB | Total page size |

### Image Optimization

```tsx
// Always use Next.js Image component
import Image from 'next/image';

// Hero images
<Image
  src="/images/hero.jpg"
  alt="Restaurant interior"
  fill
  priority                    // LCP image - load immediately
  sizes="100vw"
  className="object-cover"
  placeholder="blur"
  blurDataURL={blurDataUrl}   // Generate with plaiceholder
/>

// Menu item images
<Image
  src={item.image}
  alt={item.name}
  width={400}
  height={300}
  sizes="(max-width: 768px) 100vw, 33vw"
  loading="lazy"              // Below fold - lazy load
/>
```

### Static Generation Strategy

```tsx
// app/(marketing)/menu/page.tsx
import { sanityFetch } from '@/lib/sanity/client';
import { menuQuery } from '@/lib/sanity/queries';

// Revalidate every hour (ISR)
export const revalidate = 3600;

export default async function MenuPage() {
  const menuItems = await sanityFetch(menuQuery);
  
  return <MenuView items={menuItems} />;
}
```

### Core Web Vitals Checklist

- [x] **LCP**: Hero image with `priority`, proper sizing
- [x] **CLS**: All images have explicit dimensions, no layout shifts
- [x] **FID**: Minimal JS, no heavy hydration
- [x] **Fonts**: Self-host or use `next/font` with `display: swap`
- [x] **Critical CSS**: Tailwind purges unused styles
- [x] **No client components on server pages**: Avoid unnecessary hydration

---

## 9. SEO & Metadata

### Metadata Configuration

```tsx
// app/layout.tsx
import { Metadata } from 'next';
import { sanityFetch } from '@/lib/sanity/client';
import { siteSettingsQuery } from '@/lib/sanity/queries';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await sanityFetch(siteSettingsQuery);
  
  return {
    title: {
      default: `${settings.restaurantName} | ${settings.tagline}`,
      template: `%s | ${settings.restaurantName}`,
    },
    description: `${settings.restaurantName} - Authentic cuisine in ${settings.address.city}. Book a table today.`,
    keywords: ['restaurant', settings.address.city, 'dining', 'food'],
    authors: [{ name: settings.restaurantName }],
    openGraph: {
      type: 'website',
      locale: 'en_GB',
      siteName: settings.restaurantName,
      images: [{ url: '/images/og-image.jpg', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
    },
    robots: {
      index: true,
      follow: true,
    },
    icons: {
      icon: '/favicon.ico',
      apple: '/apple-touch-icon.png',
    },
  };
}
```

### Structured Data (JSON-LD)

```tsx
// components/seo/RestaurantSchema.tsx
import { siteSettings } from '@/lib/sanity/client';

export function RestaurantSchema({ settings }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: settings.restaurantName,
    image: settings.logo,
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.address.street,
      addressLocality: settings.address.city,
      postalCode: settings.address.postcode,
      addressCountry: 'GB',
    },
    telephone: settings.phone,
    email: settings.email,
    url: 'https://yourrestaurant.com',
    servesCuisine: ['Nepalese', 'Indian'],
    priceRange: '££',
    openingHoursSpecification: settings.openingHours.map(h => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.days,
      opens: h.hours.split('-')[0].trim(),
      closes: h.hours.split('-')[1].trim(),
    })),
    acceptsReservations: true,
    menu: 'https://yourrestaurant.com/menu',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

### Sitemap

```ts
// app/sitemap.ts
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://yourrestaurant.com';
  
  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/menu`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/events`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/book`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
  ];
  
  return staticPages;
}
```

---

## 10. Accessibility

### WCAG 2.1 AA Compliance Checklist

#### Perceivable
- [x] Alt text for all images (decorative images use `alt=""`)
- [x] Color contrast ratio ≥ 4.5:1 for text
- [x] Text resizable to 200% without loss of functionality
- [x] No content conveyed by color alone

#### Operable
- [x] All interactive elements keyboard accessible
- [x] Visible focus indicators (`:focus-visible`)
- [x] Skip link to main content
- [x] No keyboard traps
- [x] Touch targets ≥ 44px × 44px

#### Understandable
- [x] Language declared (`<html lang="en-GB">`)
- [x] Consistent navigation across pages
- [x] Form labels and error messages clear
- [x] Predictable interactions

#### Robust
- [x] Valid HTML
- [x] ARIA used correctly (prefer semantic HTML)
- [x] Works with screen readers

### Implementation Examples

```tsx
// Skip link
<a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-content">
  Skip to main content
</a>

// Main content landmark
<main id="main-content" tabIndex={-1}>
  {/* Page content */}
</main>

// Form with accessible labels
<div className="form-control">
  <label htmlFor="email" className="label">
    <span className="label-text">Email address</span>
  </label>
  <input
    type="email"
    id="email"
    name="email"
    required
    aria-describedby="email-hint"
    className="input input-bordered"
  />
  <p id="email-hint" className="text-sm text-base-content/60 mt-1">
    We'll send your booking confirmation here
  </p>
</div>

// Button with loading state
<button 
  type="submit" 
  disabled={isSubmitting}
  aria-busy={isSubmitting}
  className="btn btn-primary"
>
  {isSubmitting ? (
    <>
      <span className="loading loading-spinner" aria-hidden="true" />
      <span>Submitting...</span>
    </>
  ) : (
    'Book Table'
  )}
</button>
```

---

## 11. Deployment & Infrastructure

### Vercel Configuration

```json
// vercel.json
{
  "framework": "nextjs",
  "regions": ["lhr1"],  // London for UK restaurant
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    },
    {
      "source": "/images/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

### Environment Variables

```bash
# .env.local (never commit)

# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=sk-xxx  # For server-side mutations

# Forms (Formspree)
NEXT_PUBLIC_FORMSPREE_BOOKING_ID=f/xxx
NEXT_PUBLIC_FORMSPREE_CONTACT_ID=f/xxx

# Analytics (optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXX

# Site URL
NEXT_PUBLIC_SITE_URL=https://yourrestaurant.com
```

### CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint-and-type-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm type-check

  # Vercel handles the actual deployment via GitHub integration
```

### Monitoring

| Tool | Purpose | Cost |
|------|---------|------|
| **Vercel Analytics** | Core Web Vitals, page views | Free |
| **Sentry** | Error tracking (optional) | Free tier |
| **UptimeRobot** | Uptime monitoring | Free |

---

## 12. Implementation Roadmap

### Phase 1: Foundation (Week 1)
- [ ] Initialize Next.js project with TypeScript
- [ ] Configure Tailwind + DaisyUI theme
- [ ] Set up Sanity CMS project
- [ ] Create basic layout (Header, Footer)
- [ ] Deploy to Vercel (empty site)

### Phase 2: Core Pages (Week 2)
- [ ] Home page with all sections
- [ ] Menu page with CMS integration
- [ ] About page
- [ ] Contact page with form

### Phase 3: Features (Week 3)
- [ ] Booking form with Formspree
- [ ] Events page
- [ ] SEO & structured data
- [ ] Performance optimization

### Phase 4: Polish (Week 4)
- [ ] Accessibility audit & fixes
- [ ] Mobile testing
- [ ] Content population in CMS
- [ ] Final QA & launch

### Time Estimates

| Task | Hours |
|------|-------|
| Project setup & config | 4h |
| Sanity CMS schema & studio | 8h |
| Layout components | 6h |
| Home page sections | 12h |
| Menu page | 8h |
| Other pages (About, Events, Contact) | 12h |
| Booking form | 6h |
| SEO & metadata | 4h |
| Accessibility | 4h |
| Testing & QA | 8h |
| **Total** | **~72h (2 weeks)** |

---

## 13. Cost Estimation

### Monthly Costs (Free Tier)

| Service | Free Tier Limit | Expected Usage |
|---------|-----------------|----------------|
| **Vercel** | 100GB bandwidth | ~5GB |
| **Sanity** | 100K API requests, 10GB assets | ~20K requests |
| **Formspree** | 50 submissions/month | ~30 bookings |
| **Cloudinary** | 25GB storage, 25GB bandwidth | ~2GB |
| **Domain** | N/A | ~£10/year |
| **Total** | - | **£0-10/month** |

### Scaling Costs (If Needed)

| Service | Paid Plan | When Needed |
|---------|-----------|-------------|
| Vercel Pro | $20/mo | >100GB bandwidth |
| Sanity Team | $99/mo | Multiple editors, more API calls |
| Formspree Gold | $10/mo | >50 submissions |

---

## Quick Start Commands

```bash
# 1. Create project
npx create-next-app@latest restaurant-website --typescript --tailwind --app --src-dir=false

# 2. Install dependencies
cd restaurant-website
pnpm add @sanity/client @sanity/image-url next-sanity daisyui lucide-react zod

# 3. Initialize Sanity (in project root)
npx sanity@latest init --env

# 4. Start development
pnpm dev

# 5. Open Sanity Studio
# Visit http://localhost:3000/studio
```

---

## Summary

This blueprint provides a **simple, maintainable, and performant** restaurant website architecture that:

- Uses **~15 dependencies** vs 97 in the original
- Has a **clear, flat structure** with single component directory
- Enables **non-technical content editing** via Sanity CMS
- Achieves **excellent Core Web Vitals** through static generation
- Costs **£0-10/month** to run
- Can be built in **~2 weeks** by a single developer

The key lesson from Old Crown Girton: **simplicity is a feature, not a limitation**.
