import RestaurantLayout from "@/components/restaurant/Layout";
import Showcase from '@/components/slideshow/Showcase';
import dynamic from 'next/dynamic';
// Dynamic non-LCP sections
const AboutSection = dynamic(() => import("@/components/restaurant/AboutSection"), { ssr: true });
const MenuHighlights = dynamic(() => import("@/components/restaurant/MenuHighlights"));
const QuickLinksSection = dynamic(() => import("@/components/restaurant/sections/QuickLinksSection"));
const CallToActionSection = dynamic(() => import("@/components/restaurant/sections/CallToActionSection"));
const TestimonialsSection = dynamic(() => import("@/components/restaurant/TestimonialsSection"));
const TakeawayBanner = dynamic(() => import("@/components/restaurant/TakeawayBanner"));
const LocationSection = dynamic(() => import("@/components/restaurant/LocationSection"));
import Link from "next/link";
import { getMarketingSmart, getContentSmart } from '@/src/lib/data/server-loader';

export default async function Page() {
  // Load content data
  const m = await getMarketingSmart();
  const content = await getContentSmart();
  
  const labels = m.buttons || {};
  const labelViewMenu = labels.viewMenu || content.global.ui.buttons.viewMenu || 'View Menu';
  const labelBookOnline = labels.bookOnline || content.global.ui.buttons.bookOnline || 'Book Online';
  
  // Home page content
  const homeContent = content.pages.home;
  const quickLinks = homeContent.sections.quickLinks || [];
  const ctaSection = (homeContent.sections as any).cta;
  
  // Process CTA buttons with label fallbacks
  const ctaButtons = ctaSection?.buttons?.map((button: any) => ({
    ...button,
    text: button.key && labels[button.key] ? labels[button.key] : button.text
  })) || [];

  return (
  <>
      <RestaurantLayout>
  {/* Slideshow (replaces static hero for now) */}
  <Showcase />
        <AboutSection />
        <MenuHighlights />
        <QuickLinksSection links={quickLinks} />
        <TestimonialsSection />
        <TakeawayBanner />
        <LocationSection />
        <CallToActionSection 
          headline={ctaSection?.headline || "Ready to Experience Girton's Thatched Nepalese Pub?"}
          description={ctaSection?.description || "Reserve a table, explore the menu or plan an event – we'd love to host you."}
          buttons={ctaButtons}
        />
      </RestaurantLayout>
    </>
  );
}