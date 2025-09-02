import RestaurantLayout from "@/components/restaurant/Layout";
import Showcase from '@/components/slideshow/Showcase';
import dynamic from 'next/dynamic';
import { getSEOTags, renderSchemaTags } from '@/libs/seo';
// Motion wrappers for consistent animations
import { FadeIn } from '@/components/animations/MotionWrappers';
// Dynamic non-LCP sections
import AboutSection from './_components/AboutSection';
import MenuHighlights from './_components/MenuHighlights';
const QuickLinksSection = dynamic(() => import("@/components/restaurant/sections/QuickLinksSection"));
const CallToActionSection = dynamic(() => import("@/components/restaurant/sections/CallToActionSection"));
const TestimonialsSection = dynamic(() => import("@/components/restaurant/TestimonialsSection"));
const TakeawayBanner = dynamic(() => import("@/components/restaurant/TakeawayBanner"));
const LocationSection = dynamic(() => import("@/components/restaurant/LocationSection"));
import Link from "next/link";
import { getMarketingSmart, getContentSmart } from '@/src/lib/data/server-loader';

// SEO Metadata
export const metadata = getSEOTags({
  title: "Old Crown Girton - Historic Thatched Pub & Nepalese Restaurant | Cambridge",
  description: "Historic thatched pub in Girton serving authentic Nepalese cuisine & British pub classics. Family & dog friendly. Voted #1 restaurant in Girton. Book now!",
  keywords: ["Girton pub", "Nepalese restaurant Cambridge", "historic thatched pub", "family friendly pub Cambridge", "dog friendly pub Girton", "Sunday roast Cambridge", "Old Crown Girton"],
  canonicalUrlRelative: "/",
  openGraph: {
    title: "Old Crown Girton - Historic Thatched Pub & Nepalese Restaurant",
    description: "Historic thatched pub in Girton serving authentic Nepalese cuisine & British pub classics. Family & dog friendly. Voted #1 restaurant in Girton.",
    url: "https://oldcrowngirton.com//",
  },
});

export default async function Page() {
  // Load content data
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
      <RestaurantLayout>
        {/* Hero Section: Slideshow with semantic markup */}
        <section aria-label="Restaurant showcase">
          <Showcase />
        </section>
        
        {/* Main Content Sections with progressive animation */}
        <main>
          <FadeIn>
            <section aria-labelledby="testimonials-heading">
              <TestimonialsSection />
            </section>
          </FadeIn>
          
          <FadeIn>
            <section aria-labelledby="about-heading">
              <AboutSection />
            </section>
          </FadeIn>
          
          <FadeIn>
            <section aria-labelledby="menu-highlights-heading">
              <MenuHighlights />
            </section>
          </FadeIn>
          
          <FadeIn>
            <section aria-labelledby="quick-links-heading">
              <QuickLinksSection links={quickLinks} />
            </section>
          </FadeIn>
          
          <FadeIn>
            <section aria-label="Takeaway information">
              <TakeawayBanner />
            </section>
          </FadeIn>
          
          <FadeIn>
            <section aria-labelledby="location-heading">
              <LocationSection />
            </section>
          </FadeIn>
          
          <FadeIn>
            <section aria-labelledby="cta-heading">
              <CallToActionSection 
                headline={ctaSection?.headline || "Ready to Experience Girton's Thatched Nepalese Pub?"}
                description={ctaSection?.description || "Reserve a table, explore the menu or plan an event – we'd love to host you."}
                buttons={ctaButtons}
              />
            </section>
          </FadeIn>
        </main>
      </RestaurantLayout>
    </>
  );
}
