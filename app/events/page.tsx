import RestaurantLayout from "@/components/restaurant/Layout";
import { SchemaInjector } from "@/components/seo/RestaurantSchema";
import { getContentSmart } from '@/src/lib/data/server-loader';

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
          <div className="space-y-6 mb-12">
            {events.map((event, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6" itemScope itemType="https://schema.org/Event">
                <div className="flex items-start gap-4">
                  <span className="text-4xl">{event.icon}</span>
                  <div className="flex-1">
                    <h3 className="text-xl font-display font-bold text-brand-700 mb-2" itemProp="name">{event.title}</h3>
                    <p className="text-brand-600 mb-2" itemProp="description">{event.description}</p>
                    <meta itemProp="startDate" content={event.startDate} />
                    {(event as any).endDate && <meta itemProp="endDate" content={(event as any).endDate} />}
                    <p className="text-sm font-medium text-accent-500" itemProp="eventSchedule">{event.frequency}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Private Events */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="text-center">
              <span className="text-6xl mb-4 block">🎉</span>
              <h2 className="text-2xl font-display font-bold text-brand-700 mb-4">
                {eventsContent.contact.title}
              </h2>
              <p className="text-brand-600 mb-6">
                {eventsContent.contact.description}
              </p>
              
              <div className="bg-neutral-100 rounded-lg p-6 mb-6">
                <h3 className="font-bold text-brand-700 mb-3">Sample Use Cases:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-brand-600">
                  <div>• Birthday / anniversary</div>
                  <div>• Society socials</div>
                  <div>• Project / team wrap-up</div>
                  <div>• Family celebrations</div>
                  <div>• Seasonal gatherings</div>
                  <div>• Visitor meet-ups</div>
                </div>
              </div>
              
              <a
                href={`tel:${eventsContent.contact.phone.replace(/\s/g, '')}`}
                className="inline-block bg-accent hover:bg-accent-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors duration-200"
              >
                📞 Enquire / Book: {eventsContent.contact.phone}
              </a>
            </div>
          </div>

          {/* Contact for Updates */}
          <div className="bg-accent-50 border-2 border-accent-500 rounded-xl p-6 text-center">
            <h3 className="text-xl font-display font-bold text-brand-700 mb-3">Stay Updated</h3>
            <p className="text-brand-600 mb-4">
              Follow for fixture announcements, seasonal dates & last‑minute quiz availability.
            </p>
            <div className="flex justify-center space-x-4">
              <a href="https://facebook.com" className="text-accent-500 hover:text-accent-600 transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="https://instagram.com" className="text-accent-500 hover:text-accent-600 transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.621 5.367 11.987 11.988 11.987 6.62 0 11.987-5.366 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.291C3.897 14.411 3.29 13.043 3.29 11.498c0-1.544.608-2.913 1.837-4.198.875-.801 2.026-1.291 3.323-1.291 1.297 0 2.448.49 3.323 1.291 1.228 1.285 1.837 2.654 1.837 4.198 0 1.545-.609 2.913-1.837 4.199-.875.8-2.026 1.291-3.323 1.291z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </RestaurantLayout>
  );
}
