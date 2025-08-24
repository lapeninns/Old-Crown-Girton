/* eslint-disable react/no-unescaped-entities */
import RestaurantLayout from "@/components/restaurant/Layout";
import { getMarketingSmart, getContentSmart } from '@/src/lib/data/server-loader';
import { SchemaInjector } from "@/components/seo/RestaurantSchema";
import { getContactInfo, getHours } from "@/lib/restaurantData";

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
            <div className="prose prose-lg max-w-none">
              <p className="text-neutral-600 mb-6">{aboutContent.story.introduction}</p>
              
              <h2 className="text-2xl font-display font-bold text-brand-700 mb-4 mt-8">{aboutContent.story.title}</h2>
              {aboutContent.story.timeline.map((period, index) => (
                <div key={index} className="mb-6">
                  <h3 className="text-lg font-semibold text-brand-700 mb-2">
                    <span className="font-semibold">{period.period}:</span> {period.title}
                  </h3>
                  <p className="text-neutral-600">{period.description}</p>
                </div>
              ))}

            <div className="bg-accent-50 rounded-xl p-8 text-center">
              <h2 className="text-xl font-display font-bold text-brand-700 mb-4">{aboutContent.cta.title}</h2>
              <a
                href="https://togo.uk.com/makebookingv2.aspx?venueid=2640&nv=true"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-accent-950 text-neutral-50 font-bold py-4 px-8 rounded-lg text-lg transition-colors duration-200 hover:bg-accent-950 focus:outline-none focus-visible:ring-4 focus-visible:ring-accent/60"
                aria-label={labelBookOnline}
              >
                {aboutContent.cta.button}
              </a>
              <p className="text-neutral-600 mt-4 mb-2">{aboutContent.cta.description}</p>
              <div className="mt-4 text-sm text-neutral-600">
                <p><span className="font-semibold">Address:</span> {aboutContent.cta.contact.address}</p>
                <p><span className="font-semibold">Opening Hours:</span> <span className="italic">{quickHours || aboutContent.cta.contact.hours}</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RestaurantLayout>
  );
}