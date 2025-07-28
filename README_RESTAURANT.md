# Old Crown, Girton - Restaurant Website

A high-converting, mobile-first landing page for Old Crown restaurant in Girton, Cambridge. Built with Next.js, TypeScript, Tailwind CSS, and Framer Motion.

## 🎯 Goals & Features

### Primary Goals
- **Book a table** (main CTA with prominent placement)
- **Promote takeaway orders** (secondary CTA with urgency messaging)
- **Show credibility** (awards, reviews, social proof)
- **Quick access** to menu and opening times

### Key Features
- ✅ Mobile-first responsive design
- ✅ Accessibility (a11y) compliant
- ✅ SEO optimized with structured data
- ✅ Local business schema markup
- ✅ Smooth animations with Framer Motion
- ✅ Conversion-optimized UX flow
- ✅ Professional typography (Inter + Playfair Display)
- ✅ Restaurant-appropriate color palette

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Clone and install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Visit [http://localhost:3000](http://localhost:3000) to see the website.

## 🎨 Design System

### Color Palette
```css
/* Primary Colors */
--crown-gold: #D4941E      /* Main CTAs, logo */
--crown-slate: #475569     /* Text, secondary elements */
--crown-red: #DC2626       /* Urgency, takeaway CTAs */
--crown-cream: #FEF7ED     /* Background sections */

/* Usage */
primary: Main booking CTA
secondary: Navigation, secondary buttons  
accent: Takeaway offers, special promotions
neutral: Background, cards
```

### Typography
- **Headings**: Playfair Display (serif, elegant)
- **Body**: Inter (sans-serif, readable)
- **Brand**: Custom weight combinations for hierarchy

### Components
All components are TypeScript-typed and reusable:

- `<RestaurantLayout/>` - Main layout wrapper
- `<Navbar/>` - Sticky navigation with mobile menu
- `<Hero/>` - Full-screen hero with dual CTAs
- `<Button/>` - Variant-based button system
- `<DishCard/>` - Menu item showcase
- `<Accordion/>` - Collapsible opening hours
- `<Footer/>` - Complete contact information

## 📱 Sections Overview

1. **Sticky Navbar** - Logo, menu links, CTAs
2. **Hero Section** - Hero image, headline, primary CTAs
3. **About Section** - Restaurant story, awards, credibility
4. **Menu Highlights** - 6 featured dishes with prices
5. **Takeaway Banner** - Conversion-focused urgency messaging
6. **Location Section** - Address, hours, Google Maps
7. **Footer** - Complete contact info, parent company links

## 🔧 Configuration

### Restaurant Data
Edit `/data/restaurant.json` to update:
- Contact information
- Opening hours  
- Menu items and prices
- Events and promotions
- Awards and certifications

### SEO & Schema
Structured data is automatically generated in `/libs/schema.ts`:
- Restaurant schema markup
- Local business data
- Opening hours
- Contact information
- Menu links

### Google Fonts
Fonts are loaded via Next.js font optimization:
```tsx
import { Inter, Playfair_Display } from "next/font/google";
```

## 🎯 Conversion Optimization

### Mobile-First CTAs
- Large, thumb-friendly buttons
- Persistent "Book Now" above fold
- Clear visual hierarchy

### Trust Signals
- Awards and certifications prominently displayed
- Customer testimonials
- Professional photography placeholders
- Contact information always visible

### Local SEO
- Complete address and contact info
- Google Maps integration
- Local business schema
- Opening hours markup

## 📊 Performance

### Optimizations Included
- Next.js Image optimization
- Font loading optimization
- Lazy loading for below-fold content
- Semantic HTML structure
- Accessible focus management

### Lighthouse Targets
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 100

## 🔄 Content Management

### Staff Updates
For non-technical staff to update content:

1. **Menu Changes**: Edit `/data/restaurant.json`
2. **Hours**: Update hours object in restaurant data
3. **Events**: Add to events array
4. **Images**: Replace files in `/public/` directories

### CMS Integration (Future)
Consider integrating with:
- Sanity.io for easy content management
- Contentful for structured content
- Strapi for self-hosted option

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Connect to Vercel
npx vercel

# Deploy
npm run build
vercel --prod
```

### Other Platforms
- **Netlify**: Connect GitHub repo
- **Railway**: One-click deploy
- **Self-hosted**: Build and serve static files

### Environment Variables
```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
```

## 📝 Next Steps

### Immediate Improvements
1. **Real Images**: Replace placeholder images with professional food photography
2. **Booking Integration**: Connect to actual booking system (OpenTable, ResDiary)
3. **Contact Form**: Add functional contact form with email service
4. **Reviews Integration**: Connect to Google Reviews API
5. **Online Ordering**: Integrate with delivery platforms

### Advanced Features
1. **Table Availability**: Real-time booking calendar
2. **Online Menu**: Interactive digital menu
3. **Event Bookings**: Private dining reservations
4. **Newsletter**: Email signup and marketing
5. **Analytics**: Track conversion funnel performance

## 🛠️ Technical Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + DaisyUI
- **Animations**: Framer Motion
- **Fonts**: Google Fonts (Inter, Playfair Display)
- **Icons**: Heroicons (via Tailwind)
- **Image Optimization**: Next.js Image component
- **SEO**: Next.js metadata + structured data

## 📞 Support

For technical questions or customizations:
- Review component documentation in `/components/restaurant/`
- Check data structure in `/data/restaurant.json`
- Examine schema markup in `/libs/schema.ts`

---

**Built for Old Crown, Girton** - A conversion-optimized restaurant website focusing on table bookings and takeaway orders.
