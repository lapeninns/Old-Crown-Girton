"use client";

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '@/components/restaurant/Navbar';
import ClientFooter from '@/components/ClientFooter';

// Mobile-first dynamic imports with network-aware loading
const Showcase = dynamic(() => import('@/components/slideshow/Showcase'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 sm:h-96 bg-gradient-to-r from-brand-100 to-brand-200 animate-pulse flex items-center justify-center">
      <div className="text-brand-600 font-medium">Loading showcase...</div>
    </div>
  )
});

const AboutSection = dynamic(() => import('@/app/_components/AboutSection'), {
  loading: () => (
    <section className="bg-white py-8 sm:py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-neutral-200 rounded w-1/2"></div>
          <div className="h-4 bg-neutral-200 rounded"></div>
          <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
        </div>
      </div>
    </section>
  )
});

const MenuHighlights = dynamic(() => import('@/app/_components/MenuHighlights'), {
  loading: () => (
    <section className="bg-neutral-50 py-8 sm:py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-neutral-200 rounded w-1/3 mx-auto"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3].map(i => (
              <div key={i} className="bg-white rounded-lg p-4 space-y-3">
                <div className="h-32 bg-neutral-200 rounded"></div>
                <div className="h-4 bg-neutral-200 rounded"></div>
                <div className="h-4 bg-neutral-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
});

// Below-fold components with intersection observer loading
const TestimonialsSection = dynamic(() => import('@/components/restaurant/TestimonialsSection'));
const QuickLinksSection = dynamic(() => import('@/components/restaurant/sections/QuickLinksSection'));
const CallToActionSection = dynamic(() => import('@/components/restaurant/sections/CallToActionSection'));
const TakeawayBanner = dynamic(() => import('@/components/restaurant/TakeawayBanner'));
const LocationSection = dynamic(() => import('@/components/optimized/LazyLocationSection'));

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
        <Suspense fallback={<div className="h-32 animate-pulse bg-neutral-100"></div>}>
          <section aria-labelledby="about-heading">
            <AboutSection />
          </section>
        </Suspense>
        
        <Suspense fallback={<div className="h-48 animate-pulse bg-neutral-50"></div>}>
          <section aria-labelledby="menu-highlights-heading">
            <MenuHighlights />
          </section>
        </Suspense>
        
        {/* Below-fold content - Lazy loaded with intersection observer */}
        <Suspense fallback={<div className="h-32 animate-pulse bg-white"></div>}>
          <section aria-labelledby="testimonials-heading">
            <TestimonialsSection />
          </section>
        </Suspense>
        
        <Suspense fallback={<div className="h-24 animate-pulse bg-neutral-50"></div>}>
          <section aria-labelledby="quick-links-heading">
            <QuickLinksSection links={quickLinks} />
          </section>
        </Suspense>
        
        <Suspense fallback={<div className="h-20 animate-pulse bg-accent-50"></div>}>
          <section aria-label="Takeaway information">
            <TakeawayBanner />
          </section>
        </Suspense>
        
        <Suspense fallback={<div className="h-64 animate-pulse bg-neutral-100"></div>}>
          <section aria-labelledby="location-heading">
            <LocationSection />
          </section>
        </Suspense>
        
        <Suspense fallback={<div className="h-32 animate-pulse bg-brand-50"></div>}>
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