export const revalidate = 300;

import { renderSchemaTags } from '@/libs/seo';
import type { PressFeatureContent } from '@/components/restaurant/sections/PressFeatureBanner';
import { getMarketingSmart, getContentSmart } from '@/src/lib/data/server-loader';
import React from 'react';
import dynamic from 'next/dynamic';

// Optimized dynamic import with SSR enabled and loading fallback
const ClientHomeContent = dynamic(() => import('@/components/ClientHomeContent'), {
  ssr: true,
  loading: () => (
    <div className="min-h-screen bg-neutral-50">
      {/* Fixed navbar placeholder */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="h-8 bg-neutral-200 rounded w-32 animate-pulse"></div>
          <div className="hidden md:flex space-x-6">
            <div className="h-6 bg-neutral-200 rounded w-16 animate-pulse"></div>
            <div className="h-6 bg-neutral-200 rounded w-16 animate-pulse"></div>
            <div className="h-6 bg-neutral-200 rounded w-16 animate-pulse"></div>
          </div>
          <div className="h-8 bg-neutral-200 rounded w-24 animate-pulse"></div>
        </div>
      </div>
      
      {/* Main content placeholder */}
      <main className="pt-16">
        {/* Hero section placeholder */}
        <div className="h-screen bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="h-12 bg-neutral-300 rounded w-96 mx-auto animate-pulse"></div>
            <div className="h-6 bg-neutral-300 rounded w-64 mx-auto animate-pulse"></div>
          </div>
        </div>
      </main>
    </div>
  )
});

function HomePageContent({ 
  quickLinks, 
  ctaSection, 
  ctaButtons,
  pressFeature,
  schemaEntries,
  slideshow,
  ariaLabels
}: {
  quickLinks: any[];
  ctaSection: any;
  ctaButtons: any[];
  pressFeature?: PressFeatureContent | null;
  schemaEntries?: Record<string, any>[];
  slideshow?: {
    slides: any[];
    settings?: {
      autoplay?: boolean;
      intervalMs?: number;
      sessionSize?: number;
    };
  } | null;
  ariaLabels?: Record<string, string>;
}) {
  return (
    <>
      {schemaEntries && schemaEntries.length > 0 ? renderSchemaTags(schemaEntries) : null}
      <style dangerouslySetInnerHTML={{ __html: `
        @media (prefers-reduced-motion: reduce) {
          *,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}
          html:focus-within{scroll-behavior:auto!important}
        }
      ` }} />
      <ClientHomeContent 
        quickLinks={quickLinks}
        ctaSection={ctaSection}
        ctaButtons={ctaButtons}
        pressFeature={pressFeature}
        slideshow={slideshow ? {
          slides: slideshow.slides ?? [],
          settings: slideshow.settings ?? {}
        } : null}
        ariaLabels={ariaLabels}
      />
    </>
  );
}

export default async function Page() {
  // Load content data server-side
  const m = await getMarketingSmart();
  const content = await getContentSmart();
  
  const labels = m.buttons || {};
  
  // Home page content
  const homeContent = content.pages.home;
  const quickLinks = homeContent.sections.quickLinks || [];
  const ctaSection = (homeContent.sections as any).cta;
  const pressFeatureContent = (homeContent.sections as any).pressFeature;
  const pressFeature = pressFeatureContent || null;
  const schemaEntries = Array.isArray(homeContent.seo?.schemas) ? homeContent.seo?.schemas : [];
  const rawSlideshow = content.components?.slideshow;
  const slideshowContent = rawSlideshow
    ? {
        slides: Array.isArray(rawSlideshow.slides) ? rawSlideshow.slides : [],
        settings: rawSlideshow.settings ?? {}
      }
    : null;
  const ariaLabels = content.global?.accessibility?.ariaLabels ?? {};
  
  // Process CTA buttons with label fallbacks
  const ctaButtons = ctaSection?.buttons?.map((button: any) => ({
    ...button,
    text: button.key && labels[button.key] ? labels[button.key] : button.text
  })) || [];

  return (
    <HomePageContent 
      quickLinks={quickLinks}
      ctaSection={ctaSection}
      ctaButtons={ctaButtons}
      pressFeature={pressFeature}
      slideshow={slideshowContent}
      ariaLabels={ariaLabels}
      schemaEntries={schemaEntries}
    />
  );
}
