import RestaurantLayout from "@/components/restaurant/Layout";
import { SchemaInjector } from "@/components/seo/RestaurantSchema";
import { getContentSmart } from '@/src/lib/data/server-loader';
import dynamic from 'next/dynamic';

// Dynamic imports for Events page sections
const RegularEventsSection = dynamic(() => import("@/components/restaurant/sections/RegularEventsSection"));
const EventsContactSection = dynamic(() => import("@/components/restaurant/sections/EventsContactSection"));
const EventsUpdatesSection = dynamic(() => import("@/components/restaurant/sections/EventsUpdatesSection"));

export default async function EventsPage() {
  const content = await getContentSmart();
  const eventsContent = content.pages.events;
  
  // Add schema dates for events (using placeholder dates)
  const events = eventsContent.regularEvents.map((event, index) => ({
    ...event,
    startDate: `2025-08-${14 + index}T20:00:00+01:00`, // Placeholder dates for schema
    endDate: index === 3 ? "2025-08-31T22:00:00+01:00" : undefined // Only for seasonal event
  }));

  return (
    <RestaurantLayout>
      {/* Breadcrumb Schema */}
      <SchemaInjector type="breadcrumb" data={[
        { name: 'Home', url: 'https://oldcrowngirton.co.uk/' },
        { name: 'Events', url: 'https://oldcrowngirton.co.uk/events' }
      ]} page="events" />
      {/* Individual Event Schemas */}
      {events.map((e, i) => (
        <SchemaInjector key={i} type="event" data={{ name: e.title, description: e.description, startDate: e.startDate, endDate: (e as any).endDate }} page={`events-${i}`} />
      ))}
      <div className="min-h-screen bg-neutral-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-brand-700 mb-4">
              {eventsContent.hero.title}
            </h1>
            <p className="text-lg text-brand-600 max-w-2xl mx-auto mb-8">
              {eventsContent.hero.subtitle}
            </p>
          </div>

          {/* Regular Events */}
          <RegularEventsSection events={events} className="mb-12" />

          {/* Private Events */}
          <EventsContactSection 
            title={eventsContent.contact.title}
            description={eventsContent.contact.description}
            phone={eventsContent.contact.phone}
            className="mb-8"
          />

          {/* Contact for Updates */}
          <EventsUpdatesSection />
        </div>
      </div>
    </RestaurantLayout>
  );
}
