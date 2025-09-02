import RestaurantLayout from "@/components/restaurant/Layout";
import { getContentSmart } from '@/src/lib/data/server-loader';
import { getSEOTags, renderSchemaTags } from '@/libs/seo';
import { FadeIn } from '@/components/animations/MotionWrappers';
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
    url: "https://oldcrowngirton.com//contact",
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
        @media (prefers-reduced-motion: reduce) {
          *,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}
          html:focus-within{scroll-behavior:auto!important}
        }
      ` }} />
      <RestaurantLayout>
        {renderSchemaTags([
          // ... existing schema markup remains the same
        ])}
        
        {/* Hero Section with motion animation */}
        <section className="relative bg-gradient-to-br from-brand-600 to-brand-800 text-white py-10 md:py-16" aria-labelledby="contact-hero-heading">
          <div className="absolute inset-0 bg-black/10"></div>
          <FadeIn>
            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 id="contact-hero-heading" className="text-2xl md:text-3xl font-display font-bold text-white mb-3 leading-tight">
                {contactContent.hero.title}
              </h1>
              <p className="text-base md:text-lg text-brand-100 max-w-2xl mx-auto leading-relaxed">
                {contactContent.hero.subtitle}
              </p>
            </div>
          </FadeIn>
        </section>

        {/* Main contact content with progressive disclosure */}
        <main className="bg-white py-16 space-y-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <section className="grid grid-cols-1 lg:grid-cols-2 gap-8" aria-labelledby="contact-info-heading">
                <div>
                  <h2 id="contact-info-heading" className="text-2xl font-display font-bold text-brand-700 mb-6">Contact Information</h2>
                  <ContactInfoSection 
                    phone={contactContent.contactInfo.phone}
                    location={contactContent.contactInfo.location}
                  />
                </div>

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
              </section>
            </FadeIn>

            <FadeIn>
              <section className="mt-16" aria-labelledby="map-heading">
                <h2 id="map-heading" className="text-2xl font-display font-bold text-brand-700 mb-6 text-center">Find Us</h2>
                <InteractiveMap 
                  className="bg-neutral-50 rounded-xl shadow-lg overflow-hidden"
                  height="400px"
                  title="Old Crown Girton Location"
                />
              </section>
            </FadeIn>
          </div>
        </main>
      </RestaurantLayout>
    </>
  );
}
