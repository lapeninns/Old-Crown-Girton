import RestaurantLayout from "@/components/restaurant/Layout";
import { getContentSmart } from '@/src/lib/data/server-loader';
import dynamic from 'next/dynamic';

// Dynamic imports for Contact page sections
const ContactInfoSection = dynamic(() => import("@/components/restaurant/sections/ContactInfoSection"));
const RestaurantHoursCard = dynamic(() => import("@/components/restaurant/RestaurantHoursCard"));
const ContactFeaturesSection = dynamic(() => import("@/components/restaurant/sections/ContactFeaturesSection"));
const SocialMediaSection = dynamic(() => import("@/components/restaurant/sections/SocialMediaSection"));

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
                <h2 className="text-2xl font-semibold text-foreground-strong mb-6">
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
            <div className="bg-neutral-50 rounded-xl shadow-lg overflow-hidden">
              <div className="h-96">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2444.7892358932124!2d0.09036631577853944!3d52.23847767975736!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47d870a1c0e1e9b7%3A0x1f4c4f8c4f8c4f8c!2sGirton%2C%20Cambridge!5e0!3m2!1sen!2suk!4v1635789123456!5m2!1sen!2suk"
                  width="100%"
                  height="100%"
                  className="h-[400px] w-full rounded-xl shadow-lg"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Old Crown Girton Location"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </RestaurantLayout>
  );
}
