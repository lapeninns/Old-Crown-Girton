"use client";

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '@/components/restaurant/Navbar';
import ClientFooter from '@/components/ClientFooter';

// Critical above-the-fold content - load immediately with high priority
import Showcase from '@/components/slideshow/Showcase';
import AboutSection from '@/app/_components/AboutSection';
import MenuHighlights from '@/app/_components/MenuHighlights';

// Below-fold components with intersection observer loading
const TestimonialsSection = dynamic(() => import('@/components/restaurant/TestimonialsSection'), {
  ssr: false,
  loading: () => <div className="h-64 bg-neutral-50 animate-pulse" />
});
const QuickLinksSection = dynamic(() => import('@/components/restaurant/sections/QuickLinksSection'), {
  ssr: false,
  loading: () => <div className="h-32 bg-neutral-50 animate-pulse" />
});
const CallToActionSection = dynamic(() => import('@/components/restaurant/sections/CallToActionSection'), {
  ssr: false,
  loading: () => <div className="h-48 bg-neutral-50 animate-pulse" />
});
const TakeawayBanner = dynamic(() => import('@/components/restaurant/TakeawayBanner'), {
  ssr: false,
  loading: () => <div className="h-24 bg-neutral-50 animate-pulse" />
});
// Render LocationSection directly to avoid placeholder swap-induced layout shifts
import LocationSection from '@/components/restaurant/LocationSection';

interface ClientHomeContentProps {
  quickLinks: any[];
  ctaSection: any;
  ctaButtons: any[];
}

export default function ClientHomeContent({ quickLinks, ctaSection, ctaButtons }: ClientHomeContentProps) {
  // Ensure proper loading order by using direct imports for critical content
  React.useEffect(() => {
    // Add inline styles to force proper z-index stacking and prevent layout shifts
    const style = document.createElement('style');
    style.textContent = `
      .critical-content { 
        position: relative;
        z-index: 100 !important;
        opacity: 1;
        visibility: visible;
      }
      .below-fold-content {
        position: relative;
        z-index: 10;
      }
      .footer-content {
        position: relative;
        z-index: 1;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-neutral">
      <div className="critical-content">
        <Navbar />
      </div>
      
      <main 
        className="overflow-x-hidden relative critical-content" 
        id="main-content"
        tabIndex={-1}
        style={{
          minHeight: 'calc(100vh - 64px)',
          isolation: 'isolate',
          paddingTop: '64px',
        }}
      >
        {/* Hero Section: Slideshow - Above the fold, immediate load */}
        <section aria-label="Restaurant showcase" className="critical-content">
          <Showcase />
        </section>
        
        {/* Critical above-fold content */}
        <section aria-labelledby="about-heading" className="critical-content">
          <AboutSection />
        </section>
        
        <section aria-labelledby="menu-highlights-heading" className="critical-content">
          <MenuHighlights />
        </section>
        
        {/* Below-fold content - Lazy loaded with intersection observer */}
        <div className="below-fold-content">
          <Suspense fallback={<div className="h-64 bg-neutral-50 animate-pulse" />}>
            <section aria-labelledby="testimonials-heading">
              <TestimonialsSection />
            </section>
          </Suspense>
          
          <Suspense fallback={<div className="h-32 bg-neutral-50 animate-pulse" />}>
            <section aria-labelledby="quick-links-heading">
              <QuickLinksSection links={quickLinks} />
            </section>
          </Suspense>
          
          <Suspense fallback={<div className="h-24 bg-neutral-50 animate-pulse" />}>
            <section aria-label="Takeaway information">
              <TakeawayBanner />
            </section>
          </Suspense>
          
          <section aria-labelledby="location-heading">
            <LocationSection />
          </section>
          
          <Suspense fallback={<div className="h-48 bg-neutral-50 animate-pulse" />}>
            <section aria-labelledby="cta-heading">
              <CallToActionSection 
                headline={ctaSection?.headline || "Ready to Experience Girton's Thatched Nepalese Pub?"}
                description={ctaSection?.description || "Reserve a table, explore the menu or plan an event – we'd love to host you."}
                buttons={ctaButtons}
              />
            </section>
          </Suspense>
        </div>
      </main>
      
      <div className="footer-content">
        <ClientFooter />
      </div>
    </div>
  );
}
