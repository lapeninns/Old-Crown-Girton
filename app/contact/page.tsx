import RestaurantLayout from "@/components/restaurant/Layout";
import { getContentSmart } from '@/src/lib/data/server-loader';
import { getSEOTags, renderSchemaTags } from '@/libs/seo';
import dynamic from 'next/dynamic';

// SEO Metadata
export const metadata = getSEOTags({
  title: "Contact Old Crown Girton - Book Table | Directions | Opening Hours",
  description: "Contact Old Crown Girton for bookings, directions & enquiries. Located at 89 High Street, Girton, Cambridge. Phone: 01223277217. Free parking available.",
  keywords: ["Old Crown Girton contact", "book table Girton pub", "Girton pub phone number", "Old Crown directions", "Cambridge pub booking", "Girton restaurant address"],
  canonicalUrlRelative: "/contact",
  openGraph: {
    title: "Contact Old Crown Girton - Book Table | Directions",
    description: "Contact Old Crown Girton for bookings, directions & enquiries. Located at 89 High Street, Girton, Cambridge. Phone: 01223277217.",
    url: "https://oldcrowngirton.co.uk/contact",
  },
});

// Dynamic imports for Contact page sections
const ContactInfoSection = dynamic(() => import("@/components/restaurant/sections/ContactInfoSection"));
const RestaurantHoursCard = dynamic(() => import("@/components/restaurant/RestaurantHoursCard"));
const ContactFeaturesSection = dynamic(() => import("@/components/restaurant/sections/ContactFeaturesSection"));
const SocialMediaSection = dynamic(() => import("@/components/restaurant/sections/SocialMediaSection"));
const InteractiveMap = dynamic(() => import("@/components/restaurant/InteractiveMap"));

export default async function ContactPage() {
  const content = await getContentSmart();
  const contactContent = content.pages.contact;
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
          "@type": "LocalBusiness",
          "@id": "https://oldcrowngirton.co.uk/#localbusiness",
          "name": "Old Crown Girton",
          "image": "https://oldcrowngirton.co.uk/opengraph-image.png",
          "description": "Historic thatched pub in Girton serving authentic Nepalese cuisine and British pub classics. Family and dog friendly with free parking.",
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
          "url": "https://oldcrowngirton.co.uk",
          "telephone": "+441223276027",
          "email": "oldcrown@lapeninns.com",
          "priceRange": "££",
          "servesCuisine": ["Nepalese", "British", "Pub food"],
          "acceptsReservations": true,
          "hasMap": "https://oldcrowngirton.co.uk/contact",
          "openingHoursSpecification": [
            {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday"],
              "opens": "12:00",
              "closes": "22:00"
            },
            {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": "Friday",
              "opens": "12:00",
              "closes": "23:00"
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
          "amenityFeature": [
            {
              "@type": "LocationFeatureSpecification",
              "name": "Free Parking",
              "value": true
            },
            {
              "@type": "LocationFeatureSpecification",
              "name": "Dog Friendly",
              "value": true
            },
            {
              "@type": "LocationFeatureSpecification",
              "name": "Family Friendly",
              "value": true
            },
            {
              "@type": "LocationFeatureSpecification",
              "name": "Outdoor Seating",
              "value": true
            }
          ]
        },
        {
          "@context": "https://schema.org",
          "@type": "ContactPoint",
          "telephone": "+441223276027",
          "contactType": "Reservations",
          "email": "oldcrown@lapeninns.com",
          "areaServed": ["Girton", "Cambridge", "Cambridgeshire"],
          "availableLanguage": ["English", "Nepali"]
        }
      ])}
      <div className="min-h-screen bg-neutral-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-brand-700 mb-4">
              {contactContent.hero.title}
            </h1>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              {contactContent.hero.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <ContactInfoSection 
              phone={contactContent.contactInfo.phone}
              location={contactContent.contactInfo.location}
            />

            {/* Opening Hours & Additional Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold text-brand-700 mb-6">
                  {contactContent.hours.title}
                </h2>
                <RestaurantHoursCard />
              </div>

              <ContactFeaturesSection 
                title={contactContent.features.title}
                items={contactContent.features.items}
              />

              <SocialMediaSection />
            </div>
          </div>

          {/* Map Section */}
          <div className="mt-12">
            <InteractiveMap 
              className="bg-neutral-50 rounded-xl shadow-lg overflow-hidden"
              height="400px"
              title="Old Crown Girton Location"
            />
          </div>
        </div>
      </div>
      </RestaurantLayout>
    </>
  );
}
