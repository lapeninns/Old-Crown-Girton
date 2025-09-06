"use client";

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '@/components/restaurant/Navbar';
import ClientFooter from '@/components/ClientFooter';

// Mobile-first dynamic imports with network-aware loading
const Showcase = dynamic(() => import('@/components/slideshow/Showcase'), {
  ssr: false
});

const AboutSection = dynamic(() => import('@/app/_components/AboutSection'));

const MenuHighlights = dynamic(() => import('@/app/_components/MenuHighlights'));

// Below-fold components with intersection observer loading
const TestimonialsSection = dynamic(() => import('@/components/restaurant/TestimonialsSection'));
const QuickLinksSection = dynamic(() => import('@/components/restaurant/sections/QuickLinksSection'));
const CallToActionSection = dynamic(() => import('@/components/restaurant/sections/CallToActionSection'));
const TakeawayBanner = dynamic(() => import('@/components/restaurant/TakeawayBanner'));
// Render LocationSection directly to avoid placeholder swap-induced layout shifts
import LocationSection from '@/components/restaurant/LocationSection';

interface ClientHomeContentProps {
  quickLinks: any[];
  ctaSection: any;
  ctaButtons: any[];
}

export default function ClientHomeContent({ quickLinks, ctaSection, ctaButtons }: ClientHomeContentProps) {
  return (
    <div className="min-h-screen bg-neutral">
      <Navbar />
      
      <main 
        className="overflow-x-hidden relative" 
        id="main-content"
        tabIndex={-1}
        style={{
          minHeight: 'calc(100vh - 64px)',
          isolation: 'isolate',
          paddingTop: '64px',
        }}
      >
        {/* Hero Section: Slideshow - Above the fold, immediate load */}
        <section aria-label="Restaurant showcase">
          <Showcase />
        </section>
        
        {/* Critical above-fold content */}
        <Suspense fallback={null}>
          <section aria-labelledby="about-heading">
            <AboutSection />
          </section>
        </Suspense>
        
        <Suspense fallback={null}>
          <section aria-labelledby="menu-highlights-heading">
            <MenuHighlights />
          </section>
        </Suspense>
        
        {/* Below-fold content - Lazy loaded with intersection observer */}
        <Suspense fallback={null}>
          <section aria-labelledby="testimonials-heading">
            <TestimonialsSection />
          </section>
        </Suspense>
        
        <Suspense fallback={null}>
          <section aria-labelledby="quick-links-heading">
            <QuickLinksSection links={quickLinks} />
          </section>
        </Suspense>
        
        <Suspense fallback={null}>
          <section aria-label="Takeaway information">
            <TakeawayBanner />
          </section>
        </Suspense>
        
        <section aria-labelledby="location-heading">
          <LocationSection />
        </section>
        
        <Suspense fallback={null}>
          <section aria-labelledby="cta-heading">
            <CallToActionSection 
              headline={ctaSection?.headline || "Ready to Experience Girton's Thatched Nepalese Pub?"}
              description={ctaSection?.description || "Reserve a table, explore the menu or plan an event – we'd love to host you."}
              buttons={ctaButtons}
            />
          </section>
        </Suspense>
      </main>
      
      <ClientFooter />
    </div>
  );
}
