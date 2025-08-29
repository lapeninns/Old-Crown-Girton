/* eslint-disable react/no-unescaped-entities */
import RestaurantLayout from "@/components/restaurant/Layout";
import { getMarketingSmart, getContentSmart } from '@/src/lib/data/server-loader';
import { SchemaInjector } from "@/components/seo/RestaurantSchema";
import { getSEOTags, renderSchemaTags } from '@/libs/seo';
import { getContactInfo } from "@/lib/restaurantData";
import dynamic from 'next/dynamic';

// SEO Metadata
export const metadata = getSEOTags({
  title: "About Old Crown Girton - Largest Thatched Pub | Nepalese Restaurant Cambridge",
  description: "Historic thatched pub in Girton serving authentic Nepalese cuisine and British pub classics. While we don't serve a traditional Sunday roast, we offer comforting Sunday roast alternatives in Cambridge.",
  keywords: ["Old Crown Girton", "largest thatched pub", "Nepalese restaurant Cambridge", "Girton pub", "Sunday roast Cambridge", "British pub classics"],
  canonicalUrlRelative: "/about",
  openGraph: {
    title: "About Old Crown Girton - Historic Thatched Pub & Nepalese Kitchen",
    description: "Discover England's largest thatched pub in Girton serving authentic Nepalese cuisine and British pub classics.",
    url: "https://oldcrowngirton.co.uk/about",
  },
});

// Dynamic imports for non-LCP sections
const StoryTimelineSection = dynamic(() => import("@/components/restaurant/sections/StoryTimelineSection"));
const AboutCTASection = dynamic(() => import("@/components/restaurant/sections/AboutCTASection"));

export default async function AboutPage() {
  const m = await getMarketingSmart();
  const content = await getContentSmart();
  
  const labels = m.buttons || {};
  const labelBookOnline = labels.bookOnline || content.global.ui.buttons.bookOnline || 'Book Online';
  
  // About page content
  const aboutContent = content.pages.about;
  const contact = getContactInfo();
  const postcode = contact?.address.postcode || "CB3 0QQ";
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
          "@type": "Organization",
          "@id": "https://oldcrowngirton.co.uk/#organization",
          "name": "Old Crown Girton",
          "alternateName": "The Old Crown",
          "description": "Historic thatched pub in Girton, claimed to be the largest thatched pub in the country, serving authentic Nepalese cuisine alongside traditional British pub fare.",
          "url": "https://oldcrowngirton.co.uk",
          "logo": "https://oldcrowngirton.co.uk/icon.png",
          "image": "https://oldcrowngirton.co.uk/opengraph-image.png",
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
          "telephone": "+441223276027",
          "email": "info@oldcrowngirton.co.uk",
          "foundingDate": "1930",
          "sameAs": [
            "https://www.facebook.com/oldcrowngirton",
            "https://www.instagram.com/theoldcrowngirton",
            "https://www.tripadvisor.com/Restaurant_Review-g3135834-d17412510-Reviews-Old_Crown_Girton-Girton_Cambridgeshire_England.html"
          ],
          "brand": {
            "@type": "Brand",
            "name": "Old Crown Girton",
            "description": "Historic thatched pub with authentic Nepalese cuisine"
          }
        }
      ])}
      <SchemaInjector type="breadcrumb" data={[
        { name: 'Home', url: 'https://oldcrowngirton.co.uk/' },
        { name: 'About', url: 'https://oldcrowngirton.co.uk/about' }
      ]} page="about" />
      <div className="min-h-screen bg-neutral-50">
        {/* Hero Section */}
        <div className="relative bg-brand-700 text-neutral-50 py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              {aboutContent.hero.title}
            </h1>
            <p className="text-xl text-neutral-100 max-w-2xl mx-auto">
              {aboutContent.hero.subtitle}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <StoryTimelineSection 
            title={aboutContent.story.title}
            introduction={aboutContent.story.introduction}
            timeline={aboutContent.story.timeline}
          />

          <AboutCTASection 
            title={aboutContent.cta.title}
            description={aboutContent.cta.description}
            buttonText={aboutContent.cta.button}
            buttonHref="https://togo.uk.com/makebookingv2.aspx?venueid=2640&nv=true"
            buttonLabel={labelBookOnline}
            contact={{
              address: aboutContent.cta.contact.address
            }}
          />
        </div>
      </div>
      </RestaurantLayout>
    </>
  );
}
