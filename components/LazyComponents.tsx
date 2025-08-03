// Advanced code splitting for menu components
'use client';

import dynamic from 'next/dynamic';
import { memo } from 'react';
import { LoadingState } from './ui/AdvancedSkeleton';

// Code-split menu components with advanced loading states
export const LazyCompleteMenu = dynamic(
  () => import('../app/menu/menu-content-complete'),
  {
    loading: () => <LoadingState type="menu" />,
    ssr: true // Enable SSR for SEO
  }
);

// Restaurant components with advanced loading states
export const LazyHero = dynamic(
  () => import('./restaurant/Hero'),
  {
    loading: () => <LoadingState type="hero" />,
    ssr: true // Keep hero for SEO
  }
);

export const LazyMenuHighlights = dynamic(
  () => import('./restaurant/MenuHighlights'),
  {
    loading: () => <LoadingState type="highlights" count={3} />,
    ssr: false
  }
);

export const LazyTestimonials = dynamic(
  () => import('./restaurant/TestimonialsSection'),
  {
    loading: () => <LoadingState type="testimonials" count={4} />,
    ssr: false
  }
);

// Memoized lazy components
export const MemoizedLazyCompleteMenu = memo(LazyCompleteMenu);
export const MemoizedLazyHero = memo(LazyHero);
export const MemoizedLazyMenuHighlights = memo(LazyMenuHighlights);
export const MemoizedLazyTestimonials = memo(LazyTestimonials);

// Display names for debugging
MemoizedLazyCompleteMenu.displayName = 'MemoizedLazyCompleteMenu';
MemoizedLazyHero.displayName = 'MemoizedLazyHero';
MemoizedLazyMenuHighlights.displayName = 'MemoizedLazyMenuHighlights';
MemoizedLazyTestimonials.displayName = 'MemoizedLazyTestimonials';
