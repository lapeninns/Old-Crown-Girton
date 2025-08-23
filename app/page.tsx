import RestaurantLayout from "@/components/restaurant/Layout";
import Showcase from '@/components/slideshow/Showcase';
import dynamic from 'next/dynamic';
// Dynamic non-LCP sections
const AboutSection = dynamic(() => import("@/components/restaurant/AboutSection"), { ssr: true });
const MenuHighlights = dynamic(() => import("@/components/restaurant/MenuHighlights"));
const TestimonialsSection = dynamic(() => import("@/components/restaurant/TestimonialsSection"));
const TakeawayBanner = dynamic(() => import("@/components/restaurant/TakeawayBanner"));
const LocationSection = dynamic(() => import("@/components/restaurant/LocationSection"));
import Link from "next/link";
import { getMarketingSmart } from '@/src/lib/data/loader';

export default async function Page() {
  // FAQ schema now injected only where FAQ component is rendered; not on home by default.
  const m = await getMarketingSmart();
  const labels = m.buttons || {};
  const labelViewMenu = labels.viewMenu || 'View Menu';
  const labelBookOnline = labels.bookOnline || 'Book Online';

  return (
  <>
      <RestaurantLayout>
  {/* Slideshow (replaces static hero for now) */}
  <Showcase />
        <AboutSection />
        <MenuHighlights />
  <section className="py-12 bg-white lazy-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="p-6 rounded-lg border border-neutral-200 bg-neutral/40">
                <h3 className="font-display font-bold text-xl mb-2 text-brand-700">Community & Events</h3>
                <p className="text-brand-600 text-sm mb-4">Quiz nights, seasonal gatherings & live sports – see what’s coming up.</p>
                <Link href="/events" className="text-foreground-strong font-semibold hover:underline">View Events →</Link>
              </div>
              <div className="p-6 rounded-lg border border-neutral-200 bg-neutral/40">
                <h3 className="font-display font-bold text-xl mb-2 text-brand-700">Heritage & Story</h3>
                <p className="text-brand-600 text-sm mb-4">Discover how our thatched village pub evolved into a Nepalese + British hub.</p>
                <Link href="/about" className="text-foreground-strong font-semibold hover:underline">Explore Heritage →</Link>
              </div>
              <div className="p-6 rounded-lg border border-neutral-200 bg-neutral/40">
                <h3 className="font-display font-bold text-xl mb-2 text-brand-700">Planning a Gathering?</h3>
                <p className="text-brand-600 text-sm mb-4">Group meal, society social or family celebration – get in touch.</p>
                <Link href="/contact" className="text-foreground-strong font-semibold hover:underline">Enquire →</Link>
              </div>
            </div>
          </div>
        </section>
        <TestimonialsSection />
        <TakeawayBanner />
        <LocationSection />
  <section className="py-16 bg-accent/10">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="font-display font-bold text-brand-700 mb-4 h2">Ready to Experience Girton’s Thatched Nepalese Pub?</h2>
            <p className="text-brand-600 mb-6 text-body">Reserve a table, explore the menu or plan an event – we’d love to host you.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/menu" className="bg-accent-600 hover:bg-accent-700 text-neutral-50 font-bold py-3 px-6 rounded-lg text-sm md:text-base">{labelViewMenu}</Link>
                <Link href="/events" className="bg-brand-700 hover:bg-brand-800 text-white font-bold py-3 px-6 rounded-lg text-sm md:text-base">What’s On</Link>
              <Link href="https://togo.uk.com/makebookingv2.aspx?venueid=2640&nv=true" target="_blank" rel="noopener noreferrer" className="bg-crimson-700 hover:bg-crimson-800 text-white font-bold py-3 px-6 rounded-lg text-sm md:text-base">{labelBookOnline}</Link>
            </div>
          </div>
        </section>
      </RestaurantLayout>
    </>
  );
}
