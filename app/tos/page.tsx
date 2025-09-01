import { getSEOTags, renderSchemaTags } from "@/libs/seo";
import config from "@/config";
import RestaurantLayout from "@/components/restaurant/Layout";
import { TOSHero, TOSContent } from './_components';

export const metadata = getSEOTags({
  title: "Terms of Service | Old Crown Girton - Restaurant Booking & Service Conditions",
  description: "Terms of service for Old Crown Girton covering restaurant bookings, table reservations, cancellations and dining policies for our Cambridge pub.",
  keywords: ["Old Crown Girton terms", "restaurant booking terms", "pub terms of service Cambridge", "dining terms conditions"],
  canonicalUrlRelative: "/tos",
  openGraph: {
    title: "Terms of Service | Old Crown Girton",
    description: "Terms of service for Old Crown Girton covering restaurant bookings, table reservations and dining policies.",
    url: "https://oldcrowngirton.com/tos",
  },
});

const TOS = () => {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @media (prefers-reduced-motion: reduce) {
          *,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}
          html:focus-within{scroll-behavior:auto!important}
        }
      ` }} />
      <RestaurantLayout>
      {renderSchemaTags([
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "@id": "https://oldcrowngirton.com/tos#webpage",
          "name": "Terms of Service - Old Crown Girton",
          "description": "Terms of service and conditions for Old Crown Girton restaurant bookings, reservations and dining services.",
          "url": "https://oldcrowngirton.com/tos",
          "isPartOf": {
            "@type": "WebSite",
            "name": "Old Crown Girton",
            "url": "https://oldcrowngirton.co.uk"
          },
          "about": {
            "@type": "LocalBusiness",
            "name": "Old Crown Girton",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "89 High Street",
              "addressLocality": "Girton",
              "addressRegion": "Cambridgeshire",
              "postalCode": "CB3 0QQ",
              "addressCountry": "GB"
            }
          },
          "mainContentOfPage": {
            "@type": "WebPageElement",
            "cssSelector": "main"
          },
          "speakable": {
            "@type": "SpeakableSpecification",
            "cssSelector": ["h1", "h2"]
          }
        }
      ])}
      <div className="min-h-screen bg-brand-50">
        <TOSHero />
        <TOSContent />
      </div>
    </RestaurantLayout>
    </>
  );
};

export default TOS;
