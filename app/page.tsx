export const revalidate = 300;

import { renderSchemaTags } from '@/libs/seo';
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

type PressFeatureContent = {
  label?: string;
  eyebrow?: string;
  title?: string;
  summary?: string;
  quote?: string;
  quoteAttribution?: string;
  cta?: {
    text?: string;
    href?: string;
  };
};

const DEFAULT_PRESS_FEATURE: PressFeatureContent = {
  label: "In the press",
  eyebrow: "Country pub of the week",
  title: "Evening Standard spotlights The Old Crown, Girton",
  summary: "David Ellis praises our welcoming village pub, authentic Nepalese cooking, and ever-evolving menu in the Evening Standard's Country Pub of the Week column.",
  quote: "The changes keep locals coming back.",
  quoteAttribution: "David Ellis, Evening Standard",
  cta: {
    text: "Read the review",
    href: "https://www.standard.co.uk/going-out/bars/old-crown-girton-hotel-pub-review-b1249473.html"
  }
};

function HomePageContent({ 
  quickLinks, 
  ctaSection, 
  ctaButtons,
  pressFeature
}: {
  quickLinks: any[];
  ctaSection: any;
  ctaButtons: any[];
  pressFeature?: PressFeatureContent | null;
}) {
  return (
    <>
      {renderSchemaTags([
        {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Old Crown Girton",
          "url": "https://oldcrowngirton.com/",
          "description": "Historic thatched pub in Girton serving authentic Nepalese cuisine and British pub classics",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://oldcrowngirton.com//menu",
            "query-input": "required name=search_term_string"
          }
        },
        {
          "@context": "https://schema.org",
          "@type": "Restaurant",
          "@id": "https://oldcrowngirton.com//#restaurant",
          "name": "Old Crown Girton",
          "image": "https://oldcrowngirton.com//opengraph-image.png",
          "description": "Historic thatched pub in Girton serving authentic Nepalese cuisine and British pub classics. Family and dog friendly venue voted #1 restaurant in Girton.",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "89 High Street",
            "addressLocality": "Girton",
            "addressRegion": "Cambridgeshire",
            "postalCode": "CB3 0QQ",
            "addressCountry": "GB"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": 52.2462,
            "longitude": 0.0731
          },
          "url": "https://oldcrowngirton.com/",
          "telephone": "+441223 277217",
          "priceRange": "££",
          "servesCuisine": ["Nepalese", "British", "Pub food"],
          "acceptsReservations": true,
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.6",
            "bestRating": "5",
            "worstRating": "1",
            "ratingCount": "150"
          },
          "openingHoursSpecification": [
            {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
              "opens": "12:00",
              "closes": "22:00"
            },
            {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": "Saturday",
              "opens": "12:00",
              "closes": "23:00"
            },
            {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": "Sunday",
              "opens": "12:00",
              "closes": "22:00"
            }
          ],
          "hasMenu": "https://oldcrowngirton.com//menu",
          "sameAs": [
            "https://www.facebook.com/oldcrowngirton",
            "https://www.instagram.com/theoldcrowngirton"
          ]
        }
      ])}
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
  const pressFeature = pressFeatureContent
    ? {
        ...DEFAULT_PRESS_FEATURE,
        ...pressFeatureContent,
        cta: {
          ...DEFAULT_PRESS_FEATURE.cta,
          ...(pressFeatureContent.cta ?? {}),
        }
      }
    : DEFAULT_PRESS_FEATURE;
  
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
    />
  );
}
