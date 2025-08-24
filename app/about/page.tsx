/* eslint-disable react/no-unescaped-entities */
import RestaurantLayout from "@/components/restaurant/Layout";
import { getMarketingSmart, getContentSmart } from '@/src/lib/data/server-loader';
import { SchemaInjector } from "@/components/seo/RestaurantSchema";
import { getContactInfo, getHours } from "@/lib/restaurantData";
import dynamic from 'next/dynamic';

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
  const hours = getHours();
  const postcode = contact?.address.postcode || "CB3 0QQ";
  // Derive a concise combined hours summary for quick display
  const kitchenWeek = hours?.display?.kitchen?.weekdays;
  const kitchenWeekend = `${hours?.display?.kitchen?.saturday || ''}${hours?.display?.kitchen?.saturday && hours?.display?.kitchen?.sunday ? ' / ' : ''}${hours?.display?.kitchen?.sunday || ''}`;
  const barWeek = hours?.display?.bar?.mon_thu;
  const barWeekend = `${hours?.display?.bar?.fri_sat || ''}${hours?.display?.bar?.fri_sat && hours?.display?.bar?.sunday ? ' / ' : ''}${hours?.display?.bar?.sunday || ''}`;
  const quickHours = kitchenWeek || barWeek ? `Kitchen ${kitchenWeek}${kitchenWeekend ? ` • W/E ${kitchenWeekend}` : ''} | Bar ${barWeek}${barWeekend ? ` • W/E ${barWeekend}` : ''}` : undefined;
  return (
    <RestaurantLayout>
      <SchemaInjector type="breadcrumb" data={[
        { name: 'Home', url: 'https://oldcrowngirton.co.uk/' },
        { name: 'About', url: 'https://oldcrowngirton.co.uk/about' }
      ]} page="about" />
      <div className="min-h-screen bg-neutral-50">
        {/* Hero Section */}
        <div className="relative bg-brand-700 text-neutral-50 py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              {aboutContent.hero.title}
            </h1>
            <p className="text-xl text-neutral-100 max-w-2xl mx-auto">
              {aboutContent.hero.subtitle}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <StoryTimelineSection 
            title={aboutContent.story.title}
            introduction={aboutContent.story.introduction}
            timeline={aboutContent.story.timeline}
          />

          <AboutCTASection 
            title={aboutContent.cta.title}
            description={aboutContent.cta.description}
            buttonText={aboutContent.cta.button}
            buttonHref="https://togo.uk.com/makebookingv2.aspx?venueid=2640&nv=true"
            buttonLabel={labelBookOnline}
            contact={{
              address: aboutContent.cta.contact.address,
              hours: quickHours || aboutContent.cta.contact.hours
            }}
          />
        </div>
      </div>
    </RestaurantLayout>
  );
}