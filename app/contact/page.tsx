import RestaurantLayout from "@/components/restaurant/Layout";
import { getContentSmart } from '@/src/lib/data/server-loader';
import Link from '@/lib/debugLink';
import { getSEOTags, renderSchemaTags } from '@/libs/seo';
import { FadeIn } from '@/components/animations/MotionWrappers';
import { buildBreadcrumbSchema, buildFaqSchema, buildWebPageSchema } from '@/src/lib/seo/schema';
import dynamic from 'next/dynamic';
import {
  buttonRecipe,
  mapFrameRecipe,
  pageHeroDescriptionRecipe,
  pageHeroEyebrowRecipe,
  pageHeroInnerClassName,
  pageHeroOverlayClassName,
  pageHeroSectionRecipe,
  pageHeroTitleRecipe,
  panelTextRecipe,
  sectionInnerClassName,
  sectionShellClassName,
  subsectionTitleRecipe,
} from '@/src/design-system';

// SEO Metadata
export const metadata = getSEOTags({
  title: "Directions, Parking & Contact | Old Crown Girton",
  description: "Find directions, parking, opening hours, and booking contact details for Old Crown Girton near Cambridge.",
  keywords: ["Old Crown Girton contact", "book table Girton pub", "Girton pub phone number", "Old Crown directions", "Cambridge pub booking", "Girton restaurant address"],
  canonicalUrlRelative: "/contact",
  openGraph: {
    title: "Directions, Parking & Contact | Old Crown Girton",
    description: "Find directions, parking, opening hours, and booking contact details for Old Crown Girton near Cambridge.",
    url: "https://oldcrowngirton.com/contact",
  },
});

const CONTACT_PAGE_TITLE = "Directions, Parking & Contact | Old Crown Girton";
const CONTACT_PAGE_DESCRIPTION =
  "Find directions, parking, opening hours, and booking contact details for Old Crown Girton near Cambridge.";

const CONTACT_FAQ_ITEMS = [
  {
    question: 'Where is Old Crown Girton located?',
    answer:
      'Old Crown Girton is on High Street in Girton, just outside Cambridge, making it an easy option for local diners and visitors coming from the city.',
  },
  {
    question: 'Is there parking at Old Crown Girton?',
    answer:
      'Yes. We offer free on-site parking, which helps make booking, takeaway collection, and event visits more convenient.',
  },
  {
    question: 'Can I contact the pub directly for bookings or enquiries?',
    answer:
      'Yes. You can call the team directly for table bookings, event enquiries, directions, or questions about accessibility and dietary requirements.',
  },
];

const VISIT_REASONS = [
  'Free on-site parking',
  'Straightforward access from Cambridge and Girton',
  'Table bookings, takeaway collection, and event enquiries in one place',
];

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
          buildFaqSchema(CONTACT_FAQ_ITEMS),
        ])}
        
        {/* Hero Section with motion animation */}
        <section className={pageHeroSectionRecipe()} aria-labelledby="contact-hero-heading">
          <div className={pageHeroOverlayClassName}></div>
          <FadeIn>
            <div className={pageHeroInnerClassName}>
              <p className={pageHeroEyebrowRecipe()}>
                Plan your visit
              </p>
              <h1 id="contact-hero-heading" className={pageHeroTitleRecipe('mb-3')}>
                Directions, parking, and direct contact
              </h1>
              <p className={pageHeroDescriptionRecipe()}>
                Everything practical in one place, so guests can move from search to visit without extra friction.
              </p>
            </div>
          </FadeIn>
        </section>

        {/* Main contact content with progressive disclosure */}
        <main className={`bg-white ${sectionShellClassName} space-y-16`}>
          <div className={sectionInnerClassName}>
            <FadeIn>
              <section className="grid grid-cols-1 gap-8 lg:grid-cols-[1.15fr,0.85fr]" aria-labelledby="contact-info-heading">
                <div>
                  <h2 id="contact-info-heading" className={subsectionTitleRecipe('mb-6')}>Make visiting easy</h2>
                  <div className="rounded-3xl border border-brand-100 bg-brand-50 p-6 shadow-sm">
                    <p className={panelTextRecipe()}>
                      People land here because they want the practical details fast. This page should answer those
                      questions before they need to call.
                    </p>
                    <ul className="mt-5 space-y-3 text-brand-700">
                      {VISIT_REASONS.map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <span aria-hidden="true" className="mt-1 text-brand-500">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <Link href="/book-a-table" className={buttonRecipe({ variant: 'brand', size: 'md' })}>
                        Book a Table
                      </Link>
                      <Link href="/takeaway-menu" className={buttonRecipe({ variant: 'outline', size: 'md' })}>
                        Takeaway
                      </Link>
                    </div>
                  </div>

                  <div className="mt-8">
                    <ContactInfoSection 
                      phone={contactContent.contactInfo.phone}
                      location={contactContent.contactInfo.location}
                    />
                  </div>
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
