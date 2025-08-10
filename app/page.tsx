import RestaurantLayout from "@/components/restaurant/Layout";
import Hero from "@/components/restaurant/Hero";
import AboutSection from "@/components/restaurant/AboutSection";
import MenuHighlights from "@/components/restaurant/MenuHighlights";
import TestimonialsSection from "@/components/restaurant/TestimonialsSection";
import TakeawayBanner from "@/components/restaurant/TakeawayBanner";
import LocationSection from "@/components/restaurant/LocationSection";
import { SchemaInjector } from "@/components/seo/RestaurantSchema";
import Link from "next/link";

export default function Page() {
  // FAQ schema now injected only where FAQ component is rendered; not on home by default.

  return (
  <>
      <RestaurantLayout>
        <Hero />
        <AboutSection />
        <MenuHighlights />
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="p-6 rounded-lg border border-gray-200 bg-crown-cream/40">
                <h3 className="font-display font-bold text-xl mb-2 text-crown-slate">Community & Events</h3>
                <p className="text-gray-600 text-sm mb-4">Quiz nights, seasonal gatherings & live sports – see what’s coming up.</p>
                <Link href="/events" className="text-crown-gold font-semibold hover:underline">View Events →</Link>
              </div>
              <div className="p-6 rounded-lg border border-gray-200 bg-crown-cream/40">
                <h3 className="font-display font-bold text-xl mb-2 text-crown-slate">Heritage & Story</h3>
                <p className="text-gray-600 text-sm mb-4">Discover how our thatched village pub evolved into a Nepalese + British hub.</p>
                <Link href="/about" className="text-crown-gold font-semibold hover:underline">Explore Heritage →</Link>
              </div>
              <div className="p-6 rounded-lg border border-gray-200 bg-crown-cream/40">
                <h3 className="font-display font-bold text-xl mb-2 text-crown-slate">Planning a Gathering?</h3>
                <p className="text-gray-600 text-sm mb-4">Group meal, society social or family celebration – get in touch.</p>
                <Link href="/contact" className="text-crown-gold font-semibold hover:underline">Enquire →</Link>
              </div>
            </div>
          </div>
        </section>
        <TestimonialsSection />
        <TakeawayBanner />
        <LocationSection />
        <section className="py-16 bg-crown-gold/10">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-crown-slate mb-4">Ready to Experience Girton’s Thatched Nepalese Pub?</h2>
            <p className="text-gray-600 mb-6">Reserve a table, explore the menu or plan an event – we’d love to host you.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/menu" className="bg-crown-gold hover:bg-crown-gold-dark text-white font-bold py-3 px-6 rounded-lg text-sm md:text-base">View Menu</Link>
              <Link href="/events" className="bg-crown-slate hover:bg-black text-white font-bold py-3 px-6 rounded-lg text-sm md:text-base">What’s On</Link>
              <Link href="/contact" className="bg-crown-red hover:bg-crown-red-dark text-white font-bold py-3 px-6 rounded-lg text-sm md:text-base">Book / Enquire</Link>
            </div>
          </div>
        </section>
      </RestaurantLayout>
    </>
  );
}
