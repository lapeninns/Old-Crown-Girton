"use client";

import React from 'react';

/**
 * Seamless Loading Skeletons - Ultra-precise dimension matching
 * These skeletons match exact component dimensions to prevent layout shifts
 */

export const NavbarSkeleton = () => (
  <nav 
    className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm"
    style={{ height: '64px' }} // Exact navbar height
    aria-label="Navigation loading"
  >
    <div className="container mx-auto px-4 flex justify-between items-center h-full">
      {/* Logo skeleton */}
      <div className="w-32 h-8 bg-neutral-200 rounded animate-pulse"></div>
      
      {/* Desktop menu skeleton */}
      <div className="hidden md:flex space-x-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-16 h-6 bg-neutral-200 rounded animate-pulse"></div>
        ))}
      </div>
      
      {/* Mobile menu button skeleton */}
      <div className="w-8 h-8 bg-neutral-200 rounded animate-pulse md:hidden"></div>
    </div>
  </nav>
);

export const HeroSkeleton = () => (
  <section 
    className="relative bg-neutral-100 flex items-center justify-center"
    style={{ 
      minHeight: '60vh', // Match Showcase component height
      paddingTop: '64px' // Account for fixed navbar
    }}
    aria-label="Hero section loading"
  >
    <div className="absolute inset-0 bg-neutral-200 animate-pulse"></div>
    
    {/* Content overlay skeleton */}
    <div className="relative z-10 container mx-auto px-4 text-center">
      <div className="w-3/4 h-12 bg-white/90 rounded animate-pulse mx-auto mb-4"></div>
      <div className="w-1/2 h-6 bg-white/90 rounded animate-pulse mx-auto mb-6"></div>
      <div className="w-32 h-12 bg-white/90 rounded animate-pulse mx-auto"></div>
    </div>
  </section>
);

export const AboutSectionSkeleton = () => (
  <section 
    className="bg-white py-16" 
    id="about-heading" 
    aria-label="About section loading"
  >
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Content skeleton */}
        <div>
          <div className="h-10 bg-neutral-200 rounded w-3/4 mb-6 animate-pulse"></div>
          <div className="space-y-3">
            <div className="h-4 bg-neutral-200 rounded w-full animate-pulse"></div>
            <div className="h-4 bg-neutral-200 rounded w-full animate-pulse"></div>
            <div className="h-4 bg-neutral-200 rounded w-3/4 animate-pulse"></div>
          </div>
          
          {/* Awards section skeleton */}
          <div className="mt-8 p-6 bg-brand-100 rounded-lg border border-brand-200">
            <div className="h-6 bg-neutral-200 rounded w-1/2 mb-4 animate-pulse"></div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-neutral-200 rounded-full animate-pulse"></div>
              <div className="h-4 bg-neutral-200 rounded w-1/3 animate-pulse"></div>
            </div>
          </div>
        </div>
        
        {/* Image skeleton */}
        <div className="h-96 bg-neutral-200 rounded-xl animate-pulse"></div>
      </div>
    </div>
  </section>
);

export const MenuHighlightsSkeleton = () => (
  <section className="bg-brand-50 py-16" aria-label="Menu highlights loading">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header skeleton */}
      <div className="text-center mb-12">
        <div className="h-10 bg-neutral-200 rounded w-1/2 mx-auto mb-4 animate-pulse"></div>
        <div className="h-6 bg-neutral-200 rounded w-2/3 mx-auto animate-pulse"></div>
      </div>
      
      {/* Menu items grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
            <div className="h-32 bg-neutral-200 rounded mb-4"></div>
            <div className="h-6 bg-neutral-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-neutral-200 rounded w-full mb-2"></div>
            <div className="h-6 bg-neutral-200 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export const TestimonialsSkeleton = () => (
  <section className="bg-white py-16" aria-label="Testimonials loading">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header skeleton */}
      <div className="text-center mb-12">
        <div className="h-10 bg-neutral-200 rounded w-1/2 mx-auto mb-4 animate-pulse"></div>
        <div className="h-6 bg-neutral-200 rounded w-2/3 mx-auto animate-pulse"></div>
      </div>
      
      {/* Testimonials grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-brand-50 p-6 rounded-xl animate-pulse">
            {/* Stars skeleton */}
            <div className="flex space-x-1 mb-4">
              {[...Array(5)].map((_, j) => (
                <div key={j} className="w-5 h-5 bg-neutral-200 rounded"></div>
              ))}
            </div>
            
            {/* Quote skeleton */}
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-neutral-200 rounded w-full"></div>
              <div className="h-4 bg-neutral-200 rounded w-full"></div>
              <div className="h-4 bg-neutral-200 rounded w-2/3"></div>
            </div>
            
            {/* Author skeleton */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-neutral-200 rounded-full"></div>
              <div>
                <div className="h-4 bg-neutral-200 rounded w-20 mb-1"></div>
                <div className="h-3 bg-neutral-200 rounded w-16"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/**
 * Generic content section skeleton for below-fold sections
 */
export const GenericSectionSkeleton = ({ 
  className = "py-16",
  backgroundColor = "bg-white" 
}: {
  className?: string;
  backgroundColor?: string;
}) => (
  <section className={`${backgroundColor} ${className}`} aria-label="Section loading">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-neutral-200 rounded w-1/3 mx-auto"></div>
        <div className="h-4 bg-neutral-200 rounded w-2/3 mx-auto"></div>
        <div className="h-32 bg-neutral-200 rounded"></div>
      </div>
    </div>
  </section>
);

/**
 * Loading transition wrapper to prevent flicker
 * Enhanced with proper timing and fade transitions
 */
export const SeamlessTransition = ({ 
  isLoaded, 
  skeleton, 
  children,
  className = "",
  minimumLoadTime = 100,
  enableFadeTransition = true
}: {
  isLoaded: boolean;
  skeleton: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  /** Minimum time to show skeleton (prevents flash) */
  minimumLoadTime?: number;
  /** Enable smooth fade between skeleton and content */
  enableFadeTransition?: boolean;
}) => {
  const [showContent, setShowContent] = React.useState(false);
  const [hasMinimumTimeElapsed, setHasMinimumTimeElapsed] = React.useState(false);
  const mountTimeRef = React.useRef<number>(Date.now());

  React.useEffect(() => {
    // Ensure minimum skeleton display time
    const timer = setTimeout(() => {
      setHasMinimumTimeElapsed(true);
    }, minimumLoadTime);

    return () => clearTimeout(timer);
  }, [minimumLoadTime]);

  React.useEffect(() => {
    if (isLoaded && hasMinimumTimeElapsed) {
      if (enableFadeTransition) {
        // Small delay to ensure smooth transition
        const fadeTimer = setTimeout(() => {
          setShowContent(true);
        }, 50);
        return () => clearTimeout(fadeTimer);
      } else {
        setShowContent(true);
      }
    }
  }, [isLoaded, hasMinimumTimeElapsed, enableFadeTransition]);

  if (!enableFadeTransition) {
    return (
      <div className={className}>
        {(isLoaded && hasMinimumTimeElapsed) ? children : skeleton}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Skeleton layer */}
      <div 
        className={`transition-all duration-300 ease-out ${
          showContent ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        style={{
          position: showContent ? 'absolute' : 'static',
          top: 0,
          left: 0,
          right: 0,
          zIndex: showContent ? 1 : 'auto'
        }}
      >
        {skeleton}
      </div>
      
      {/* Content layer */}
      {(isLoaded && hasMinimumTimeElapsed) && (
        <div 
          className={`transition-all duration-300 ease-out ${
            showContent ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            position: showContent ? 'static' : 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: showContent ? 'auto' : 2
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
};
