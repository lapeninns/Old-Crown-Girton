"use client";

import React, { Suspense, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Critical components - load immediately, no lazy loading
import Navbar from '@/components/restaurant/Navbar';
import ClientFooter from '@/components/ClientFooter';
import Showcase from '@/components/slideshow/Showcase';
import AboutSection from '@/app/_components/AboutSection';
import MenuHighlights from '@/app/_components/MenuHighlights';
import PressFeatureBanner, { PressFeatureContent } from '@/components/restaurant/sections/PressFeatureBanner';
import type { Slide } from '@/components/slideshow/types';

// Below-fold components - load progressively with stable SSR
const TestimonialsSection = dynamic(() => import('@/components/restaurant/TestimonialsSection'), {
  ssr: true,
});

const QuickLinksSection = dynamic(() => import('@/components/restaurant/sections/QuickLinksSection'), {
  ssr: true,
});

const CallToActionSection = dynamic(() => import('@/components/restaurant/sections/CallToActionSection'), {
  ssr: true,
});

const TakeawayBanner = dynamic(() => import('@/components/restaurant/TakeawayBanner'), {
  ssr: true,
});

const LocationSection = dynamic(() => import('@/components/restaurant/LocationSection'), {
  ssr: true,
});

interface ClientHomeContentProps {
  quickLinks: any[];
  ctaSection: any;
  ctaButtons: any[];
  pressFeature?: PressFeatureContent | null;
  slideshow?: {
    slides: Slide[];
    settings?: {
      autoplay?: boolean;
      intervalMs?: number;
      sessionSize?: number;
      regionLabel?: string;
      sectionLabel?: string;
    };
  } | null;
  ariaLabels?: Record<string, string>;
}

// Optimized progressive loading with immediate display for SSR
function ProgressiveSection({ 
  children, 
  delay = 0, 
  className = "",
  placeholder,
  priority = false
}: { 
  children: React.ReactNode;
  delay?: number;
  className?: string;
  placeholder?: React.ReactNode;
  priority?: boolean;
}) {
  const [shouldShow, setShouldShow] = useState(priority || delay === 0);
  const [isVisible, setIsVisible] = useState(priority || delay === 0);

  useEffect(() => {
    // For SSR, show immediately if priority or no delay
    if (priority || delay === 0) {
      setShouldShow(true);
      setIsVisible(true);
      return;
    }

    // For non-priority components with delay, use progressive timing
    const timer = setTimeout(() => {
      setShouldShow(true);
      // Small additional delay for smooth transition
      setTimeout(() => setIsVisible(true), 50);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [delay, priority]);

  // Always show content for SSR, use progressive loading only for enhancements
  return (
    <div 
      className={`${className} progressive-section ${isVisible ? 'progressive-section-loaded' : 'progressive-section-loading'}`}
      data-priority={priority ? 'true' : 'false'}
    >
      {shouldShow ? children : (placeholder || (
        <div className="bg-neutral-50 animate-pulse rounded" style={{ minHeight: '100px' }} />
      ))}
    </div>
  );
}

export default function ClientHomeContent({
  quickLinks,
  ctaSection,
  ctaButtons,
  pressFeature,
  slideshow,
  ariaLabels
}: ClientHomeContentProps) {
  const [isHydrated, setIsHydrated] = useState(true); // Start with true for SSR
  const [navbarLoaded, setNavbarLoaded] = useState(true); // Start with true for immediate display
  const [criticalAssetsLoaded, setCriticalAssetsLoaded] = useState(true); // Start with true

  useEffect(() => {
    // Preload critical resources in background
    const preloadCriticalAssets = () => {
      // Preload critical images or fonts if any
      const criticalImages: string[] = [
        // Add any critical hero images here
      ];
      
      if (criticalImages.length > 0) {
        Promise.all(
          criticalImages.map(src => {
            return new Promise((resolve) => {
              const img = new Image();
              img.onload = img.onerror = resolve;
              img.src = src;
            });
          })
        ).then(() => setCriticalAssetsLoaded(true));
      }
    };

    // Run preloading in background without blocking UI
    preloadCriticalAssets();
  }, []);

  // Remove delays completely for snappier scrolling and rendering
  const getDelay = (_baseDelay: number) => 0;

  return (
    <div className="min-h-screen bg-neutral">
      {/* Critical Navigation - loads first with priority */}
      <ProgressiveSection 
        priority={true}
        className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm"
        placeholder={
          <div className="fixed top-0 left-0 right-0 z-50 navbar-placeholder">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
              <div className="h-8 bg-neutral-200 rounded w-32 section-placeholder"></div>
              <div className="hidden md:flex space-x-6">
                <div className="h-6 bg-neutral-200 rounded w-16 section-placeholder"></div>
                <div className="h-6 bg-neutral-200 rounded w-16 section-placeholder"></div>
                <div className="h-6 bg-neutral-200 rounded w-16 section-placeholder"></div>
              </div>
              <div className="h-8 bg-neutral-200 rounded w-24 section-placeholder"></div>
            </div>
          </div>
        }
      >
        <Navbar />
      </ProgressiveSection>
      
      <main 
        className="overflow-x-hidden relative" 
        id="main-content"
        tabIndex={-1}
        style={{
          paddingTop: '64px', // Account for fixed navbar
        }}
      >
        {/* Hero Section: Slideshow - Above the fold, loads immediately after navbar */}
        <ProgressiveSection 
          delay={getDelay(0)}
          placeholder={
            <div className="h-screen bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="h-12 bg-neutral-300 rounded w-96 mx-auto section-placeholder"></div>
                <div className="h-6 bg-neutral-300 rounded w-64 mx-auto section-placeholder"></div>
              </div>
            </div>
          }
        >
          <section aria-label={ariaLabels?.showcaseSection ?? slideshow?.settings?.sectionLabel ?? 'Restaurant showcase'}>
            <Showcase
              slides={slideshow?.slides ?? []}
              settings={slideshow?.settings}
              regionLabel={ariaLabels?.slideshowRegion ?? slideshow?.settings?.regionLabel}
              sectionLabel={ariaLabels?.showcaseSection ?? slideshow?.settings?.sectionLabel}
            />
          </section>
        </ProgressiveSection>

        {pressFeature && (
          <ProgressiveSection 
            delay={getDelay(150)}
            placeholder={
              <div className="bg-brand-700 py-10 md:py-12">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
                  <div className="h-4 w-32 bg-white/30 rounded section-placeholder"></div>
                  <div className="h-8 w-3/4 bg-white/40 rounded section-placeholder"></div>
                  <div className="h-4 w-full md:w-2/3 bg-white/30 rounded section-placeholder"></div>
                </div>
              </div>
            }
          >
            <PressFeatureBanner content={pressFeature} />
          </ProgressiveSection>
        )}
        
        {/* About Section - render immediately for snappier feel */}
        <ProgressiveSection 
          delay={getDelay(0)}
          placeholder={
            <div className="h-96 bg-neutral-50">
              <div className="container mx-auto px-4 py-16 space-y-6">
                <div className="h-8 bg-neutral-200 rounded w-1/2 mx-auto section-placeholder"></div>
                <div className="h-4 bg-neutral-200 rounded w-3/4 mx-auto section-placeholder"></div>
                <div className="h-4 bg-neutral-200 rounded w-2/3 mx-auto section-placeholder"></div>
              </div>
            </div>
          }
        >
          <section aria-labelledby="about-heading">
            <AboutSection />
          </section>
        </ProgressiveSection>
        
        {/* Menu Highlights - loads 1200ms after showcase starts, giving about section more time */}
        <ProgressiveSection 
          delay={getDelay(1200)}
          placeholder={
            <div className="h-96 bg-neutral-50">
              <div className="container mx-auto px-4 py-16 space-y-6">
                <div className="h-8 bg-neutral-200 rounded w-1/3 mx-auto section-placeholder"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-32 bg-neutral-200 rounded section-placeholder"></div>
                  ))}
                </div>
              </div>
            </div>
          }
        >
          <section aria-labelledby="menu-highlights-heading">
            <MenuHighlights />
          </section>
        </ProgressiveSection>
        
        {/* Below-fold content - loads progressively with longer intervals */}
        <ProgressiveSection 
          delay={getDelay(1600)}
          placeholder={<div className="h-64 bg-neutral-50 animate-pulse"></div>}
        >
          <section aria-labelledby="testimonials-heading">
            <Suspense fallback={<div className="h-64 bg-neutral-50 animate-pulse"></div>}>
              <TestimonialsSection />
            </Suspense>
          </section>
        </ProgressiveSection>
        
        <ProgressiveSection 
          delay={getDelay(2000)}
          placeholder={<div className="h-32 bg-neutral-50 animate-pulse"></div>}
        >
          <section aria-labelledby="quick-links-heading">
            <Suspense fallback={<div className="h-32 bg-neutral-50 animate-pulse"></div>}>
              <QuickLinksSection links={quickLinks} />
            </Suspense>
          </section>
        </ProgressiveSection>
        
        <ProgressiveSection 
          delay={getDelay(2400)}
          placeholder={<div className="h-24 bg-neutral-50 animate-pulse"></div>}
        >
          <section aria-label="Takeaway information">
            <Suspense fallback={<div className="h-24 bg-neutral-50 animate-pulse"></div>}>
              <TakeawayBanner />
            </Suspense>
          </section>
        </ProgressiveSection>
        
        {/* Location Section - includes maps, loads last of main content */}
        <ProgressiveSection 
          delay={getDelay(2800)}
          placeholder={
            <div className="h-96 bg-neutral-50 animate-pulse">
              <div className="container mx-auto px-4 py-16 space-y-6">
                <div className="h-6 bg-neutral-200 rounded w-1/4"></div>
                <div className="h-64 bg-neutral-200 rounded"></div>
              </div>
            </div>
          }
        >
          <section aria-labelledby="location-heading">
            <Suspense fallback={
              <div className="h-96 bg-neutral-50 animate-pulse">
                <div className="container mx-auto px-4 py-16 space-y-6">
                  <div className="h-6 bg-neutral-200 rounded w-1/4"></div>
                  <div className="h-64 bg-neutral-200 rounded"></div>
                </div>
              </div>
            }>
              <LocationSection />
            </Suspense>
          </section>
        </ProgressiveSection>
        
        {/* Call to Action */}
        <ProgressiveSection 
          delay={getDelay(3200)}
          placeholder={<div className="h-48 bg-neutral-50 animate-pulse"></div>}
        >
          <section aria-labelledby="cta-heading">
            <Suspense fallback={<div className="h-48 bg-neutral-50 animate-pulse"></div>}>
              <CallToActionSection 
                headline={ctaSection?.headline || "Ready to Experience Girton's Thatched Nepalese Pub?"}
                description={ctaSection?.description || "Reserve a table, explore the menu or plan an event – we'd love to host you."}
                buttons={ctaButtons}
              />
            </Suspense>
          </section>
        </ProgressiveSection>
      </main>
      
      {/* Footer - loads after all main content */}
      <ProgressiveSection 
        delay={getDelay(3600)}
        placeholder={<div className="h-64 bg-neutral-50 animate-pulse"></div>}
      >
        <ClientFooter />
      </ProgressiveSection>
    </div>
  );
}
