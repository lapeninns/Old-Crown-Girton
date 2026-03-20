import RestaurantLayout from "@/components/restaurant/Layout";
import { getContentSmart } from '@/src/lib/data/server-loader';
import { getSEOTags, renderSchemaTags } from '@/libs/seo';
import { FadeIn } from '@/components/animations/MotionWrappers';
import { buildBreadcrumbSchema, buildWebPageSchema } from '@/src/lib/seo/schema';
import dynamic from 'next/dynamic';
import {
  mapFrameRecipe,
  pageHeroDescriptionRecipe,
  pageHeroInnerClassName,
  pageHeroOverlayClassName,
  pageHeroSectionRecipe,
  pageHeroTitleRecipe,
  sectionInnerClassName,
  sectionShellClassName,
  subsectionTitleRecipe,
} from '@/src/design-system';

// SEO Metadata
export const metadata = getSEOTags({
  title: "Contact Old Crown Girton - Book Table | Directions | Opening Hours",
  description: "Contact Old Crown Girton for bookings, directions & enquiries. Located at 89 High Street, Girton, Cambridge. Phone: 01223277217. Free parking available.",
  keywords: ["Old Crown Girton contact", "book table Girton pub", "Girton pub phone number", "Old Crown directions", "Cambridge pub booking", "Girton restaurant address"],
  canonicalUrlRelative: "/contact",
  openGraph: {
    title: "Contact Old Crown Girton - Book Table | Directions",
    description: "Contact Old Crown Girton for bookings, directions & enquiries. Located at 89 High Street, Girton, Cambridge. Phone: 01223277217.",
    url: "https://oldcrowngirton.com/contact",
  },
});

const CONTACT_PAGE_TITLE = "Contact Old Crown Girton - Book Table | Directions | Opening Hours";
const CONTACT_PAGE_DESCRIPTION =
  "Contact Old Crown Girton for bookings, directions & enquiries. Located at 89 High Street, Girton, Cambridge. Phone: 01223277217. Free parking available.";

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
          buildWebPageSchema({
            path: '/contact',
            title: CONTACT_PAGE_TITLE,
            description: CONTACT_PAGE_DESCRIPTION,
            type: 'ContactPage',
          }),
          buildBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Contact', path: '/contact' },
          ]),
        ])}
        
        {/* Hero Section with motion animation */}
        <section className={pageHeroSectionRecipe()} aria-labelledby="contact-hero-heading">
          <div className={pageHeroOverlayClassName}></div>
          <FadeIn>
            <div className={pageHeroInnerClassName}>
              <h1 id="contact-hero-heading" className={pageHeroTitleRecipe('mb-3')}>
                {contactContent.hero.title}
              </h1>
              <p className={pageHeroDescriptionRecipe()}>
                {contactContent.hero.subtitle}
              </p>
            </div>
          </FadeIn>
        </section>

        {/* Main contact content with progressive disclosure */}
        <main className={`bg-white ${sectionShellClassName} space-y-16`}>
          <div className={sectionInnerClassName}>
            <FadeIn>
              <section className="grid grid-cols-1 lg:grid-cols-2 gap-8" aria-labelledby="contact-info-heading">
                <div>
                  <h2 id="contact-info-heading" className={subsectionTitleRecipe('mb-6')}>Contact Information</h2>
                  <ContactInfoSection 
                    phone={contactContent.contactInfo.phone}
                    location={contactContent.contactInfo.location}
                  />
                </div>

                <div className="space-y-8">
                  <div>
                    <h2 className={subsectionTitleRecipe('mb-6')}>
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
                <h2 id="map-heading" className={subsectionTitleRecipe('mb-6 text-center')}>Find Us</h2>
                <InteractiveMap 
                  className={mapFrameRecipe()}
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
