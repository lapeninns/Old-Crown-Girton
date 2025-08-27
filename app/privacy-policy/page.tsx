import { getSEOTags } from "@/libs/seo";
import config from "@/config";
import RestaurantLayout from "@/components/restaurant/Layout";
import { PrivacyHero, PrivacyContent } from './_components';

export const metadata = getSEOTags({
  title: `Privacy Policy | ${config.appName}`,
  description: "Privacy policy for The Old Crown Girton outlining data handling for enquiries, bookings and site usage.",
  canonicalUrlRelative: "/privacy-policy",
});

const PrivacyPolicy = () => {
  return (
    <RestaurantLayout>
      <PrivacyHero />
      <PrivacyContent />
    </RestaurantLayout>
  );
};

export default PrivacyPolicy;
