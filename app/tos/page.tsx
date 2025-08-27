import { getSEOTags } from "@/libs/seo";
import config from "@/config";
import { TOSHero, TOSContent } from './_components';

export const metadata = getSEOTags({
  title: `Terms of Service | ${config.appName}`,
  description: "Readable terms governing site use, enquiries and bookings for The Old Crown Girton.",
  canonicalUrlRelative: "/tos",
});

const TOS = () => {
  return (
    <>
      <TOSHero />
      <TOSContent />
    </>
  );
};

export default TOS;
