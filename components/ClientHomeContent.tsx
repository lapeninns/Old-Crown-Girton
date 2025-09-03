"use client";

import React from 'react';
import Navbar from '@/components/restaurant/Navbar';
import ClientFooter from '@/components/ClientFooter';
import Showcase from '@/components/slideshow/Showcase';
import AboutSection from '@/app/_components/AboutSection';
import MenuHighlights from '@/app/_components/MenuHighlights';
import TestimonialsSection from '@/components/restaurant/TestimonialsSection';
import QuickLinksSection from '@/components/restaurant/sections/QuickLinksSection';
import CallToActionSection from '@/components/restaurant/sections/CallToActionSection';
import TakeawayBanner from '@/components/restaurant/TakeawayBanner';
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
        {/* Hero Section: Slideshow */}
        <section aria-label="Restaurant showcase">
          <Showcase />
        </section>
        
        {/* Testimonials Section */}
        <section aria-labelledby="testimonials-heading">
          <TestimonialsSection />
        </section>
        
        {/* About Section */}
        <section aria-labelledby="about-heading">
          <AboutSection />
        </section>
        
        {/* Menu Highlights */}
        <section aria-labelledby="menu-highlights-heading">
          <MenuHighlights />
        </section>
        
        {/* Quick Links */}
        <section aria-labelledby="quick-links-heading">
          <QuickLinksSection links={quickLinks} />
        </section>
        
        {/* Takeaway Banner */}
        <section aria-label="Takeaway information">
          <TakeawayBanner />
        </section>
        
        {/* Location Section */}
        <section aria-labelledby="location-heading">
          <LocationSection />
        </section>
        
        {/* Call to Action */}
        <section aria-labelledby="cta-heading">
          <CallToActionSection 
            headline={ctaSection?.headline || "Ready to Experience Girton's Thatched Nepalese Pub?"}
            description={ctaSection?.description || "Reserve a table, explore the menu or plan an event – we'd love to host you."}
            buttons={ctaButtons}
          />
        </section>
      </main>
      
      <ClientFooter />
    </div>
  );
}