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

// Skeletons
import {
  NavbarSkeleton,
  HeroSkeleton,
  PressFeatureSkeleton,
  SectionStartSkeleton,
  MenuHighlightsSkeleton,
  StandardSectionSkeleton,
  LocationSkeleton
} from '@/components/skeletons/HomeSkeletons';

// Below-fold components - load progressively with stable SSR
const TestimonialsSection = dynamic(() => import('@/components/restaurant/TestimonialsSection'), {
  ssr: true,
  loading: () => <StandardSectionSkeleton height="h-64" />
});

const QuickLinksSection = dynamic(() => import('@/components/restaurant/sections/QuickLinksSection'), {
  ssr: true,
  loading: () => <StandardSectionSkeleton height="h-32" />
});

const CallToActionSection = dynamic(() => import('@/components/restaurant/sections/CallToActionSection'), {
  ssr: true,
  loading: () => <StandardSectionSkeleton height="h-48" />
});

const TakeawayBanner = dynamic(() => import('@/components/restaurant/TakeawayBanner'), {
  ssr: true,
  loading: () => <StandardSectionSkeleton height="h-24" />
});

const LocationSection = dynamic(() => import('@/components/restaurant/LocationSection'), {
  ssr: true,
  loading: () => <LocationSkeleton />
});

const NAVBAR_OFFSET_FALLBACK = '64px';
const NAVBAR_STACK_OFFSET_FALLBACK = '104px';

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

export default function ClientHomeContent({
  quickLinks,
  ctaSection,
  ctaButtons,
  pressFeature,
  slideshow,
  ariaLabels
}: ClientHomeContentProps) {
  // Simplified rendering without artificial delays
  return (
    <div className="min-h-screen bg-neutral">
      {/* Critical Navigation - loads first with priority */}
      <Suspense fallback={<NavbarSkeleton />}>
        <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
          <Navbar />
        </div>
      </Suspense>

      <main
        className="overflow-x-hidden relative"
        id="main-content"
        tabIndex={-1}
        style={{
          isolation: 'isolate',
          minHeight: `calc(100vh - var(--navbar-offset, ${NAVBAR_OFFSET_FALLBACK}))`,
          paddingTop: `var(--navbar-stack-offset, ${NAVBAR_STACK_OFFSET_FALLBACK})`,
        }}
      >
        {/* Hero Section: Slideshow - Above the fold */}
        <Suspense fallback={<HeroSkeleton />}>
          <section aria-label={ariaLabels?.showcaseSection ?? slideshow?.settings?.sectionLabel ?? 'Restaurant showcase'}>
            <Showcase
              slides={slideshow?.slides ?? []}
              settings={slideshow?.settings}
              regionLabel={ariaLabels?.slideshowRegion ?? slideshow?.settings?.regionLabel}
              sectionLabel={ariaLabels?.showcaseSection ?? slideshow?.settings?.sectionLabel}
            />
          </section>
        </Suspense>

        {pressFeature && (
          <Suspense fallback={<PressFeatureSkeleton />}>
            <PressFeatureBanner content={pressFeature} />
          </Suspense>
        )}

        {/* About Section */}
        <Suspense fallback={<SectionStartSkeleton />}>
          <section aria-labelledby="about-heading">
            <AboutSection />
          </section>
        </Suspense>

        {/* Menu Highlights */}
        <Suspense fallback={<MenuHighlightsSkeleton />}>
          <section aria-labelledby="menu-highlights-heading">
            <MenuHighlights />
          </section>
        </Suspense>

        {/* Below-fold content */}
        <section aria-labelledby="testimonials-heading">
          <TestimonialsSection />
        </section>

        <section aria-labelledby="quick-links-heading">
          <QuickLinksSection links={quickLinks} />
        </section>

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

      {/* Footer */}
      <Suspense fallback={<StandardSectionSkeleton height="h-64" />}>
        <ClientFooter />
      </Suspense>
    </div>
  );
}

