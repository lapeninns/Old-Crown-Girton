/**
 * Critical CSS for Seamless Loading - Inline these styles in <head>
 * Ultra-minimal CSS for instant visual feedback
 */

export const CRITICAL_LOADING_CSS = `
/* Seamless loading foundation */
.seamless-layout {
  min-height: 100vh;
  background-color: #f8f9fa;
}

/* Navbar skeleton - exact dimensions */
.navbar-skeleton {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: 64px;
  background: #ffffff;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

/* Hero skeleton - match Showcase dimensions */
.hero-skeleton {
  position: relative;
  min-height: 60vh;
  padding-top: 64px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

/* Ultra-smooth skeleton animation with GPU acceleration */
.animate-pulse {
  animation: seamless-pulse 1.5s ease-in-out infinite;
  will-change: opacity;
  backface-visibility: hidden;
}

@keyframes seamless-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

@keyframes seamless-shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

/* Enhanced shimmer effect for skeleton elements */
.animate-shimmer {
  position: relative;
  overflow: hidden;
}

.animate-shimmer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.4),
    transparent
  );
  transform: translateX(-100%);
  animation: seamless-shimmer 2s ease-in-out infinite;
  will-change: transform;
}

/* Prevent layout shifts */
.content-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Enhanced seamless transitions with better timing */
.seamless-transition {
  transition: opacity 300ms cubic-bezier(0.4, 0, 0.2, 1);
  will-change: opacity;
}

.seamless-transition-enter {
  opacity: 0;
  transform: translateY(8px);
}

.seamless-transition-enter-active {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 300ms ease-out, transform 300ms ease-out;
}

/* Critical typography to prevent FOUT */
@font-face {
  font-family: 'System';
  src: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-display: swap;
}

/* Layout preservation classes */
.preserve-layout {
  contain: layout style;
}

/* Performance optimizations */
.gpu-accelerated {
  transform: translateZ(0);
  will-change: transform, opacity;
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .animate-pulse,
  .seamless-transition {
    animation: none !important;
    transition: none !important;
  }
}

/* Mobile-first responsive skeleton */
@media (max-width: 768px) {
  .hero-skeleton {
    min-height: 50vh;
  }
  
  .content-container {
    padding: 0 0.75rem;
  }
}
`;

/**
 * Preload hints for critical resources
 */
export const CRITICAL_PRELOAD_HINTS = [
  {
    rel: 'preload',
    href: '/fonts/display-font.woff2',
    as: 'font',
    type: 'font/woff2',
    crossorigin: 'anonymous'
  },
  {
    rel: 'preload',
    href: '/images/hero-bg.jpg',
    as: 'image'
  },
  {
    rel: 'preload',
    href: '/images/logo.png',
    as: 'image'
  },
  {
    rel: 'preconnect',
    href: 'https://fonts.googleapis.com'
  },
  {
    rel: 'dns-prefetch',
    href: 'https://www.google-analytics.com'
  }
];

/**
 * Critical resource priorities for loading manager
 */
export const LOADING_PRIORITIES = {
  CRITICAL: [
    'navbar',
    'hero-image',
    'fonts'
  ],
  ABOVE_FOLD: [
    'about-section',
    'testimonials',
    'menu-highlights'
  ],
  BELOW_FOLD: [
    'quick-links',
    'takeaway-banner',
    'location',
    'cta-section'
  ]
} as const;
