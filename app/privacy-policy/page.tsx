import { getSEOTags, renderSchemaTags } from "@/libs/seo";
import config from "@/config";
import RestaurantLayout from "@/components/restaurant/Layout";
import { PrivacyHero, PrivacyContent } from './_components';

export const metadata = getSEOTags({
  title: "Privacy Policy | Old Crown Girton - Data Protection & GDPR Compliance",
  description: "Privacy policy for Old Crown Girton outlining data handling for restaurant bookings, enquiries and website usage. GDPR compliant data protection policy.",
  keywords: ["Old Crown Girton privacy policy", "restaurant data protection", "GDPR compliance Cambridge", "pub privacy policy"],
  canonicalUrlRelative: "/privacy-policy",
  openGraph: {
    title: "Privacy Policy | Old Crown Girton",
    description: "Privacy policy for Old Crown Girton outlining data handling for restaurant bookings, enquiries and website usage.",
    url: "https://oldcrowngirton.co.uk/privacy-policy",
  },
});

const PrivacyPolicy = () => {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        *,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}
        html:focus-within{scroll-behavior:auto!important}
      ` }} />
      <RestaurantLayout noMotion>
      {renderSchemaTags([
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "@id": "https://oldcrowngirton.co.uk/privacy-policy#webpage",
          "name": "Privacy Policy - Old Crown Girton",
          "description": "Privacy policy and data protection information for Old Crown Girton restaurant and website users.",
          "url": "https://oldcrowngirton.co.uk/privacy-policy",
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
      <PrivacyHero />
      <PrivacyContent />
    </RestaurantLayout>
    </>
  );
};

export default PrivacyPolicy;
