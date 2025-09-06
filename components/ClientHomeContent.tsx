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

// Simple progressive loading without complex state management
function ProgressiveSection({ 
  children, 
  delay = 0, 
  className = "",
  placeholder 
}: { 
  children: React.ReactNode;
  delay?: number;
  className?: string;
  placeholder?: React.ReactNode;
}) {
  const [shouldShow, setShouldShow] = useState(delay === 0);

  useEffect(() => {
    if (delay > 0) {
      const timer = setTimeout(() => setShouldShow(true), delay);
      return () => clearTimeout(timer);
    }
  }, [delay]);

  if (!shouldShow) {
    return placeholder || (
      <div className={`bg-neutral-50 animate-pulse rounded ${className}`} style={{ minHeight: '100px' }} />
    );
  }

  return <div className={className}>{children}</div>;
}

export default function ClientHomeContent({ quickLinks, ctaSection, ctaButtons }: ClientHomeContentProps) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return (
    <div className="min-h-screen bg-neutral">
      {/* Critical Navigation - loads first, fixed position */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <Navbar />
      </div>
      
      <main 
        className="overflow-x-hidden relative" 
        id="main-content"
        tabIndex={-1}
        style={{
          paddingTop: '64px', // Account for fixed navbar
        }}
      >
        {/* Hero Section: Slideshow - Above the fold */}
        <ProgressiveSection 
          delay={isHydrated ? 100 : 0}
          placeholder={
            <div className="h-screen bg-gradient-to-br from-neutral-100 to-neutral-200 animate-pulse flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="h-12 bg-neutral-300 rounded w-96 mx-auto"></div>
                <div className="h-6 bg-neutral-300 rounded w-64 mx-auto"></div>
              </div>
            </div>
          }
        >
          <section aria-label="Restaurant showcase">
            <Showcase />
          </section>
        </ProgressiveSection>
        
        {/* About Section */}
        <ProgressiveSection 
          delay={isHydrated ? 300 : 0}
          placeholder={
            <div className="h-96 bg-neutral-50 animate-pulse">
              <div className="container mx-auto px-4 py-16 space-y-6">
                <div className="h-8 bg-neutral-200 rounded w-1/2 mx-auto"></div>
                <div className="h-4 bg-neutral-200 rounded w-3/4 mx-auto"></div>
                <div className="h-4 bg-neutral-200 rounded w-2/3 mx-auto"></div>
              </div>
            </div>
          }
        >
          <section aria-labelledby="about-heading">
            <AboutSection />
          </section>
        </ProgressiveSection>
        
        {/* Menu Highlights */}
        <ProgressiveSection 
          delay={isHydrated ? 500 : 0}
          placeholder={
            <div className="h-96 bg-neutral-50 animate-pulse">
              <div className="container mx-auto px-4 py-16 space-y-6">
                <div className="h-8 bg-neutral-200 rounded w-1/3 mx-auto"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-32 bg-neutral-200 rounded"></div>
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
        
        {/* Below-fold content - loads progressively */}
        <ProgressiveSection 
          delay={isHydrated ? 700 : 0}
          placeholder={<div className="h-64 bg-neutral-50 animate-pulse"></div>}
        >
          <section aria-labelledby="testimonials-heading">
            <Suspense fallback={<div className="h-64 bg-neutral-50 animate-pulse"></div>}>
              <TestimonialsSection />
            </Suspense>
          </section>
        </ProgressiveSection>
        
        <ProgressiveSection 
          delay={isHydrated ? 900 : 0}
          placeholder={<div className="h-32 bg-neutral-50 animate-pulse"></div>}
        >
          <section aria-labelledby="quick-links-heading">
            <Suspense fallback={<div className="h-32 bg-neutral-50 animate-pulse"></div>}>
              <QuickLinksSection links={quickLinks} />
            </Suspense>
          </section>
        </ProgressiveSection>
        
        <ProgressiveSection 
          delay={isHydrated ? 1100 : 0}
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
          delay={isHydrated ? 1300 : 0}
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
          delay={isHydrated ? 1500 : 0}
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
        delay={isHydrated ? 1700 : 0}
        placeholder={<div className="h-64 bg-neutral-50 animate-pulse"></div>}
      >
        <ClientFooter />
      </ProgressiveSection>
    </div>
  );
}
