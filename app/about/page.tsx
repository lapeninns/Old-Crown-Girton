/* eslint-disable react/no-unescaped-entities */
import RestaurantLayout from "@/components/restaurant/Layout";
import { getMarketingSmart, getContentSmart } from '@/src/lib/data/server-loader';
import { SchemaInjector } from "@/components/seo/RestaurantSchema";
import { getSEOTags, renderSchemaTags } from '@/libs/seo';
import { getContactInfo } from "@/lib/restaurantData";
import { FadeIn } from '@/components/animations/MotionWrappers';
import dynamic from 'next/dynamic';

// SEO Metadata
export const metadata = getSEOTags({
  title: "About Old Crown Girton - Largest Thatched Pub | Nepalese Restaurant Cambridge",
  description: "Historic thatched pub in Girton serving authentic Nepalese cuisine and British pub classics. Discover our unique blend of heritage and hospitality.",
  keywords: ["Old Crown Girton", "largest thatched pub", "Nepalese restaurant Cambridge", "Girton pub", "historic pub", "British pub classics"],
  canonicalUrlRelative: "/about",
  openGraph: {
    title: "About Old Crown Girton - Historic Thatched Pub & Nepalese Kitchen",
    description: "Discover England's largest thatched pub in Girton serving authentic Nepalese cuisine and British pub classics.",
    url: "https://oldcrowngirton.com/about",
  },
});

// Dynamic imports for non-LCP sections
const StoryTimelineSection = dynamic(() => import("@/components/restaurant/sections/StoryTimelineSection"));
const AboutCTASection = dynamic(() => import("@/components/restaurant/sections/AboutCTASection"));

export default async function AboutPage() {
  const m = await getMarketingSmart();
  const content = await getContentSmart();
  
  const labels = m.buttons || {};
  const labelBookOnline = labels.bookOnline || content.global.ui.buttons.bookOnline || 'Book Online';
  
  // About page content
  const aboutContent = content.pages.about;
  const contact = getContactInfo();
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @media (prefers-reduced-motion: reduce) {
          *,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}
          html:focus-within{scroll-behavior:auto!important}
        }
      ` }} />
      <RestaurantLayout>
        {renderSchemaTags()}
        <SchemaInjector type="breadcrumb" data={[
          { name: 'Home', url: 'https://oldcrowngirton.com/' },
          { name: 'About', url: 'https://oldcrowngirton.com/about' }
        ]} page="about" />
        
        {/* Hero Section with motion animation */}
        <section className="relative bg-gradient-to-br from-brand-600 to-brand-800 text-white py-10 md:py-16" aria-labelledby="about-hero-heading">
          <div className="absolute inset-0 bg-black/10"></div>
          <FadeIn>
            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 id="about-hero-heading" className="text-2xl md:text-3xl font-display font-bold text-white mb-3 leading-tight">
                {aboutContent.hero.title}
              </h1>
              <p className="text-base md:text-lg text-brand-100 max-w-2xl mx-auto leading-relaxed">
                {aboutContent.hero.subtitle}
              </p>
            </div>
          </FadeIn>
        </section>

        {/* Main Content with progressive disclosure */}
        <main className="space-y-0">
          <FadeIn>
            <section className="bg-white py-16" aria-labelledby="story-timeline-heading">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <StoryTimelineSection 
                  title={aboutContent.story.title}
                  introduction={aboutContent.story.introduction}
                  timeline={aboutContent.story.timeline}
                />
              </div>
            </section>
          </FadeIn>

          <FadeIn>
            <section className="bg-brand-100 py-16" aria-labelledby="about-cta-heading">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <AboutCTASection 
                  title={aboutContent.cta.title}
                  description={aboutContent.cta.description}
                  buttonText={aboutContent.cta.button}
                  buttonHref="https://togo.uk.com/makebookingv2.aspx?venueid=2640&nv=true"
                  buttonLabel={labelBookOnline}
                  contact={{
                    address: aboutContent.cta.contact.address
                  }}
                />
              </div>
            </section>
          </FadeIn>
        </main>
      </RestaurantLayout>
    </>
  );
}
