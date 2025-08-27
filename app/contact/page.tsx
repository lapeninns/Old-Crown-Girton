import RestaurantLayout from "@/components/restaurant/Layout";
import { getContentSmart } from '@/src/lib/data/server-loader';
import dynamic from 'next/dynamic';

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
    <RestaurantLayout>
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
  );
}
