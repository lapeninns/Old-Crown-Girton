# Old Crown Restaurant - Production Ready Website

A modern, responsive restaurant website built with Next.js 14, featuring:

## Features

- 🍽️ **Restaurant Menu** - Dynamic menu with categories and detailed item descriptions
- 📱 **Mobile-First Design** - Optimized for all devices with responsive layouts
- ⚡ **Performance Optimized** - Fast loading with Next.js optimization features
- 🔍 **SEO Friendly** - Structured data and meta tags for better search visibility
- 🎨 **Modern UI** - Clean design with smooth animations using Framer Motion
- ♿ **Accessible** - WCAG compliant with accessibility features
- 🛒 **PWA Ready** - Progressive Web App with offline capabilities

## Production Status ✅

This build is production-ready with:
- ✅ Development debugging tools removed
- ✅ Console logs cleaned up
- ✅ Analytics dashboards removed
- ✅ Performance monitoring optimized for production
- ✅ Development documentation organized
- ✅ Build size optimized (188 kB shared JS)

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + DaisyUI
- **UI Components**: Headless UI
- **Animations**: Framer Motion
- **Database**: Supabase
- **Authentication**: NextAuth.js
- **Payments**: Stripe
- **Email**: Mailgun
- **TypeScript**: Full type safety

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Restaurant_BP
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the environment template and fill in your values
   cp .env.example .env.local
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000) in your browser**

## Environment Variables

Required environment variables:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe (optional - for payments)
STRIPE_PUBLIC_KEY=your_stripe_public_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Email (optional - for contact forms)
RESEND_API_KEY=your_resend_api_key
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
├── app/                    # Next.js 14 App Router pages
├── components/             # Reusable React components
├── lib/                   # Utility functions and configurations
├── libs/                  # External service integrations
├── public/                # Static assets
├── styles/                # Global styles
├── types/                 # TypeScript type definitions
├── docs/                  # Project documentation
└── scripts/               # Utility scripts
```

## Deployment

This project is optimized for deployment on Vercel:

1. **Push to GitHub**
2. **Connect to Vercel**
3. **Set environment variables in Vercel dashboard**
4. **Deploy automatically on push to main branch**

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is private and proprietary.

---

Built with ❤️ for Old Crown Restaurant, Girton
