/**
 * Critical CSS for Loading States - Inline these styles in <head>
 * Ultra-minimal CSS for instant visual feedback
 */

export const CRITICAL_LOADING_CSS = `
/* Loading foundation */
.loading-layout {
  min-height: 100vh;
  background-color: #f8f9fa;
}

/* Basic loading animation */
.animate-pulse {
  animation: pulse 1.5s ease-in-out infinite;
  will-change: opacity;
  backface-visibility: hidden;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

/* Prevent layout shifts */
.content-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Enhanced transitions with better timing */
.smooth-transition {
  transition: opacity 300ms cubic-bezier(0.4, 0, 0.2, 1);
  will-change: opacity;
}

.smooth-transition-enter {
  opacity: 0;
  transform: translateY(8px);
}

.smooth-transition-enter-active {
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
  .smooth-transition {
    animation: none !important;
    transition: none !important;
  }
}

/* Mobile-first responsive */
@media (max-width: 768px) {
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
