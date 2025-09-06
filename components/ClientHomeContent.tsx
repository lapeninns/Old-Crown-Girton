"use client";

import React, { Suspense, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Critical components - load immediately, no lazy loading
import Navbar from '@/components/restaurant/Navbar';
import ClientFooter from '@/components/ClientFooter';
import Showcase from '@/components/slideshow/Showcase';
import AboutSection from '@/app/_components/AboutSection';
import MenuHighlights from '@/app/_components/MenuHighlights';

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
}

// Optimized progressive loading with better timing coordination
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
  const [shouldShow, setShouldShow] = useState(delay === 0 || priority);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Always show priority components immediately
    if (priority) {
      setShouldShow(true);
      setIsVisible(true);
      return;
    }

    // For non-priority components, use progressive timing
    if (delay > 0) {
      const timer = setTimeout(() => {
        setShouldShow(true);
        // Small additional delay for smooth transition
        setTimeout(() => setIsVisible(true), 50);
      }, delay);
      return () => clearTimeout(timer);
    } else {
      setShouldShow(true);
      setIsVisible(true);
    }
  }, [delay, priority]);

  if (!shouldShow) {
    return (
      <div className={className}>
        {placeholder || (
          <div className="bg-neutral-50 animate-pulse rounded" style={{ minHeight: '100px' }} />
        )}
      </div>
    );
  }

  return (
    <div 
      className={`${className} progressive-section ${isVisible ? 'progressive-section-loaded' : 'progressive-section-loading'}`}
    >
      {children}
    </div>
  );
}

export default function ClientHomeContent({ quickLinks, ctaSection, ctaButtons }: ClientHomeContentProps) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [navbarLoaded, setNavbarLoaded] = useState(false);
  const [criticalAssetsLoaded, setCriticalAssetsLoaded] = useState(false);

  useEffect(() => {
    // Preload critical resources
    const preloadCriticalAssets = () => {
      // Preload critical images or fonts if any
      const criticalImages: string[] = [
        // Add any critical hero images here
      ];
      
      Promise.all(
        criticalImages.map(src => {
          return new Promise((resolve) => {
            const img = new Image();
            img.onload = img.onerror = resolve;
            img.src = src;
          });
        })
      ).then(() => setCriticalAssetsLoaded(true));
    };

    setIsHydrated(true);
    preloadCriticalAssets();
    
    // Navbar loads first, then trigger other components
    setTimeout(() => setNavbarLoaded(true), 100);
  }, []);

  // Optimized delay sequence - starts after navbar is ready and critical assets loaded
  const getDelay = (baseDelay: number) => {
    if (!isHydrated) return 0;
    const readyToLoad = navbarLoaded && criticalAssetsLoaded;
    return readyToLoad ? baseDelay : baseDelay + 300;
  };

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
          <section aria-label="Restaurant showcase">
            <Showcase />
          </section>
        </ProgressiveSection>
        
        {/* About Section - loads 400ms after showcase starts */}
        <ProgressiveSection 
          delay={getDelay(400)}
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
        
        {/* Menu Highlights - loads 600ms after about starts */}
        <ProgressiveSection 
          delay={getDelay(800)}
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
          delay={getDelay(1200)}
          placeholder={<div className="h-64 bg-neutral-50 animate-pulse"></div>}
        >
          <section aria-labelledby="testimonials-heading">
            <Suspense fallback={<div className="h-64 bg-neutral-50 animate-pulse"></div>}>
              <TestimonialsSection />
            </Suspense>
          </section>
        </ProgressiveSection>
        
        <ProgressiveSection 
          delay={getDelay(1600)}
          placeholder={<div className="h-32 bg-neutral-50 animate-pulse"></div>}
        >
          <section aria-labelledby="quick-links-heading">
            <Suspense fallback={<div className="h-32 bg-neutral-50 animate-pulse"></div>}>
              <QuickLinksSection links={quickLinks} />
            </Suspense>
          </section>
        </ProgressiveSection>
        
        <ProgressiveSection 
          delay={getDelay(2000)}
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
          delay={getDelay(2400)}
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
          delay={getDelay(2800)}
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
        delay={getDelay(3200)}
        placeholder={<div className="h-64 bg-neutral-50 animate-pulse"></div>}
      >
        <ClientFooter />
      </ProgressiveSection>
    </div>
  );
}
