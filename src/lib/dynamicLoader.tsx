/**
 * Dynamic Component Loader
 * Provides optimized lazy loading for heavy components
 */

import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

// Loading components
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-500"></div>
  </div>
);

const LoadingCard = () => (
  <div className="bg-neutral-50 rounded-lg p-6 animate-pulse">
    <div className="h-4 bg-neutral-200 rounded mb-2"></div>
    <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
  </div>
);

const LoadingSection = () => (
  <div className="space-y-4 animate-pulse">
    <div className="h-8 bg-neutral-200 rounded w-1/2"></div>
    <div className="space-y-2">
      <div className="h-4 bg-neutral-200 rounded"></div>
      <div className="h-4 bg-neutral-200 rounded w-5/6"></div>
    </div>
  </div>
);

// Dynamic loading options
interface DynamicLoadOptions {
  loading?: ComponentType;
  ssr?: boolean;
  priority?: 'high' | 'low';
}

/**
 * Heavy Components - Loaded dynamically to improve initial bundle size
 */

// Slideshow components (large bundle impact)
export const DynamicSlideshow = dynamic(
  () => import('@/components/slideshow/Slideshow'),
  { loading: LoadingSection }
);

export const DynamicShowcase = dynamic(
  () => import('@/components/slideshow/Showcase'),
  { loading: () => <div className="w-full h-96 bg-neutral-200 animate-pulse rounded"></div> }
);

// Interactive components
export const DynamicModal = dynamic(
  () => import('@/components/Modal'),
  { loading: LoadingSpinner, ssr: false }
);

export const DynamicMenuHighlights = dynamic(
  () => import('@/components/restaurant/MenuHighlights'),
  { loading: LoadingSection }
);

// Form components (heavy with validation)
export const DynamicCTA = dynamic(
  () => import('@/components/CTA'),
  { loading: LoadingCard }
);

// Animation-heavy components
export const DynamicTestimonials = dynamic(
  () => import('@/components/restaurant/TestimonialsSection'),
  { loading: LoadingSection }
);

export const DynamicTestimonials11 = dynamic(
  () => import('@/components/Testimonials11'),
  { loading: LoadingSection }
);

// FAQ Section
export const DynamicFAQ = dynamic(
  () => import('@/components/FAQ'),
  { loading: LoadingSection }
);

// Analytics and tracking (client-side only)
export const DynamicErrorBoundary = dynamic(
  () => import('@/components/ErrorBoundary'),
  { ssr: false }
);

// Features components
export const DynamicFeaturesGrid = dynamic(
  () => import('@/components/FeaturesGrid'),
  { loading: LoadingSection }
);

export const DynamicPricing = dynamic(
  () => import('@/components/Pricing'),
  { loading: LoadingSection }
);

/**
 * Preload critical components for better UX
 */
export const preloadCriticalComponents = () => {
  if (typeof window !== 'undefined') {
    // Preload slideshow on user interaction
    const preloadSlideshow = () => {
      import('@/components/slideshow/Slideshow');
    };

    // Preload modal on hover over CTA buttons
    const preloadModal = () => {
      import('@/components/Modal');
    };

    // Add event listeners for preloading
    document.addEventListener('mouseenter', (e) => {
      const target = e.target as Element;
      
      if (target.closest('[data-modal-trigger]')) {
        preloadModal();
      }
      
      if (target.closest('[data-slideshow-trigger]')) {
        preloadSlideshow();
      }
    }, { once: true });

    // Preload on scroll near components
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target as Element;
            
            if (element.hasAttribute('data-preload-testimonials')) {
              import('@/components/restaurant/TestimonialsSection');
            }
            
            if (element.hasAttribute('data-preload-faq')) {
              import('@/components/FAQ');
            }
          }
        });
      },
      { rootMargin: '200px' }
    );

    // Observe preload triggers
    document.querySelectorAll('[data-preload-testimonials], [data-preload-faq]')
      .forEach(el => observer.observe(el));
  }
};

/**
 * Bundle analysis helper
 */
export const getBundleInfo = () => {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.log('🎯 Dynamic Components Status:', {
      slideshow: !!(window as any).__DYNAMIC_SLIDESHOW_LOADED__,
      testimonials: !!(window as any).__DYNAMIC_TESTIMONIALS_LOADED__,
      modal: !!(window as any).__DYNAMIC_MODAL_LOADED__,
    });
  }
};