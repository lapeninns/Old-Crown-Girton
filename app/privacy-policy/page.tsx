import { getSEOTags, renderSchemaTags } from "@/libs/seo";
import config from "@/config";
import RestaurantLayout from "@/components/restaurant/Layout";
import { FadeIn } from '@/components/animations/MotionWrappers';
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
        @media (prefers-reduced-motion: reduce) {
          *,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}
          html:focus-within{scroll-behavior:auto!important}
        }
      ` }} />
      <RestaurantLayout>
        {renderSchemaTags([
          // ... existing schema markup remains the same
        ])}
        
        {/* Privacy policy with motion animation and semantic structure */}
        <section aria-labelledby="privacy-hero-heading">
          <PrivacyHero />
        </section>
        
        <main className="bg-white py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <PrivacyContent />
            </FadeIn>
          </div>
        </main>
      </RestaurantLayout>
    </>
  );
};

export default PrivacyPolicy;
