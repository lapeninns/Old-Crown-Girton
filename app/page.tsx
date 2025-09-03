import { getSEOTags, renderSchemaTags } from '@/libs/seo';
import Link from '@/lib/debugLink';
import { getMarketingSmart, getContentSmart } from '@/src/lib/data/server-loader';
import React from 'react';
import dynamic from 'next/dynamic';

// Simple dynamic import for client-side content with no loading fallback
const ClientHomeContent = dynamic(() => import('@/components/ClientHomeContent'), {
  ssr: false
});

function HomePageContent({ 
  quickLinks, 
  ctaSection, 
  ctaButtons 
}: {
  quickLinks: any[];
  ctaSection: any;
  ctaButtons: any[];
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
          "telephone": "+441223276027",
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
      />
    </>
  );
}

export default async function Page() {
  // Load content data server-side
  const m = await getMarketingSmart();
  const content = await getContentSmart();
  
  const labels = m.buttons || {};
  const labelViewMenu = labels.viewMenu || content.global.ui.buttons.viewMenu || 'View Menu';
  const labelBookOnline = labels.bookOnline || content.global.ui.buttons.bookOnline || 'Book Online';
  
  // Home page content
  const homeContent = content.pages.home;
  const quickLinks = homeContent.sections.quickLinks || [];
  const ctaSection = (homeContent.sections as any).cta;
  
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
    />
  );
}
