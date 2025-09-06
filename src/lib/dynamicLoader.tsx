/**
 * Dynamic Component Loader
 * Provides optimized lazy loading for heavy components
 */

import dynamic from 'next/dynamic';
import { ComponentType, useEffect, useRef, useState } from 'react';
import { observe } from '@/src/lib/lazy/intersection';
import LoadQueue from '@/src/lib/lazy/loadQueue';

const LAZY_V2 = process.env.NEXT_PUBLIC_LAZY_V2 === 'true';

const queue = new LoadQueue();

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

// Enhanced dynamic with queue
export function createLazyDynamic(importFn: () => Promise<any>, options: { loading?: React.ComponentType; ssr?: boolean; rootMargin?: string } = {}) {
  const { loading: LoadingComp = LoadingSection, ssr = true, rootMargin = '300px 0px' } = options;
  return dynamic(importFn, { 
    loading: function LazyWrapper({ error, isLoading, pastDelay, retry, timedOut, ...props }: { error?: Error; isLoading?: boolean; pastDelay?: boolean; retry?: () => void; timedOut?: boolean; }) {
      const [Comp, setComp] = useState<React.ComponentType | null>(null);
      const ref = useRef<HTMLDivElement>(null);
      const unobserveRef = useRef<(() => void) | null>(null);

      useEffect(() => {
        if (isLoading && LAZY_V2 && ref.current) {
          const callback = (entries: IntersectionObserverEntry[]) => {
            if (entries[0].isIntersecting) {
              queue.add(async () => {
                const mod = await importFn();
                setComp(() => mod.default);
              });
              unobserveRef.current?.();
            }
          };
          const unobserve = observe(ref.current, callback, { rootMargin });
          unobserveRef.current = unobserve;
          return unobserve;
        }
      }, [isLoading]);

      return Comp ? <Comp {...props} /> : <LoadingComp {...props} />;
    },
    ssr 
  });
}

// Slideshow components (large bundle impact)
export const DynamicSlideshow = createLazyDynamic(
  () => import('@/components/slideshow/Slideshow'),
  { loading: LoadingCard }
);

// Modal components (interaction-based)
export const DynamicModal = createLazyDynamic(
  () => import('@/components/Modal'),
  { ssr: false, loading: LoadingSpinner }
);

// Form components (heavy with validation)
export const DynamicCTA = createLazyDynamic(
  () => import('@/components/CTA'),
  { loading: LoadingCard }
);

// Animation-heavy components
export const DynamicTestimonials = createLazyDynamic(
  () => import('@/components/restaurant/TestimonialsSection'),
  { loading: LoadingSection }
);

export const DynamicTestimonials11 = createLazyDynamic(
  () => import('@/components/Testimonials11'),
  { loading: LoadingSection }
);

export const DynamicFAQ = createLazyDynamic(
  () => import('@/components/FAQ'),
  { loading: LoadingSection }
);

// Analytics and tracking (client-side only)
export const DynamicErrorBoundary = createLazyDynamic(
  () => import('@/components/ErrorBoundary'),
  { ssr: false }
);

// Features components
export const DynamicFeaturesGrid = createLazyDynamic(
  () => import('@/components/FeaturesGrid'),
  { loading: LoadingSection }
);

export const DynamicPricing = createLazyDynamic(
  () => import('@/components/Pricing'),
  { loading: LoadingSection }
);

/**
 * Preload critical components for better UX
 */
export const preloadCriticalComponents = () => {
  if (typeof window !== 'undefined' && LAZY_V2) {
    // Queue preloads to avoid herd
    queue.add(() => import('@/components/slideshow/Slideshow').then(() => {}));

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
    }, { passive: true });
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

// Legacy exports for backwards compatibility  
export const DynamicTestimonialsV2 = DynamicTestimonials;