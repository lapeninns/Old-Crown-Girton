import RestaurantLayout from "@/components/restaurant/Layout";
import { SchemaInjector } from "@/components/seo/RestaurantSchema";
import { getContentSmart } from '@/src/lib/data/server-loader';
import { getSEOTags, renderSchemaTags } from '@/libs/seo';
import dynamic from 'next/dynamic';

// SEO Metadata
export const metadata = getSEOTags({
  title: "Events at Old Crown Girton - Quiz Nights, Sports & Community Events | Cambridge",
  description: "Join our regular events: weekly quiz nights, live sports on big screens, Girton Feast celebrations & private functions. Family & student-friendly events in Cambridge.",
  keywords: ["Girton pub quiz", "Cambridge sports pub", "Girton Feast events", "Cambridge quiz night", "live sports Cambridge", "private events Girton", "student events Cambridge"],
  canonicalUrlRelative: "/events",
  openGraph: {
    title: "Events at Old Crown Girton - Quiz Nights, Sports & Community Events",
    description: "Join our regular events: weekly quiz nights, live sports on big screens, Girton Feast celebrations & private functions. Family & student-friendly events.",
    url: "https://oldcrowngirton.co.uk/events",
  },
});

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
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        *,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}
        html:focus-within{scroll-behavior:auto!important}
      ` }} />
      <RestaurantLayout noMotion>
      {renderSchemaTags([
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "@id": "https://oldcrowngirton.co.uk/events#webpage",
          "name": "Events at Old Crown Girton",
          "description": "Regular events, quiz nights, live sports and community celebrations at Old Crown Girton - the historic thatched pub in Cambridge.",
          "url": "https://oldcrowngirton.co.uk/events",
          "isPartOf": {
            "@type": "WebSite",
            "name": "Old Crown Girton",
            "url": "https://oldcrowngirton.co.uk"
          },
          "about": {
            "@type": "LocalBusiness",
            "name": "Old Crown Girton",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "89 High Street",
              "addressLocality": "Girton",
              "addressRegion": "Cambridgeshire",
              "postalCode": "CB3 0QQ",
              "addressCountry": "GB"
            }
          }
        },
        {
          "@context": "https://schema.org",
          "@type": "EventSeries",
          "@id": "https://oldcrowngirton.co.uk/events#eventseries",
          "name": "Old Crown Girton Regular Events",
          "description": "Weekly quiz nights, live sports viewing, seasonal celebrations and community events at Old Crown Girton.",
          "organizer": {
            "@type": "LocalBusiness",
            "name": "Old Crown Girton",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "89 High Street",
              "addressLocality": "Girton",
              "addressRegion": "Cambridgeshire",
              "postalCode": "CB3 0QQ",
              "addressCountry": "GB"
            },
            "telephone": "+441223276027",
            "url": "https://oldcrowngirton.co.uk"
          },
          "location": {
            "@type": "Place",
            "name": "Old Crown Girton",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "89 High Street",
              "addressLocality": "Girton",
              "addressRegion": "Cambridgeshire",
              "postalCode": "CB3 0QQ",
              "addressCountry": "GB"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": 52.2462,
              "longitude": 0.0731
            }
          },
          "subEvent": [
            {
              "@type": "Event",
              "name": "Weekly Quiz Night",
              "description": "Test your knowledge at our friendly weekly quiz night. Great prizes and community atmosphere.",
              "startDate": "2025-08-28T20:00:00+01:00",
              "endDate": "2025-08-28T22:30:00+01:00",
              "eventSchedule": {
                "@type": "Schedule",
                "repeatFrequency": "P1W",
                "byDay": "Thursday"
              },
              "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
              "eventStatus": "https://schema.org/EventScheduled"
            },
            {
              "@type": "Event",
              "name": "Live Sports Viewing",
              "description": "Watch all the big games on our large screens. Perfect atmosphere for football, rugby and more.",
              "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
              "eventStatus": "https://schema.org/EventScheduled"
            },
            {
              "@type": "Event",
              "name": "Girton Feast Celebrations",
              "description": "Join us during Girton Feast Week for special events and community celebrations.",
              "startDate": "2025-07-12T12:00:00+01:00",
              "endDate": "2025-07-19T23:00:00+01:00",
              "eventSchedule": {
                "@type": "Schedule",
                "repeatFrequency": "P1Y"
              },
              "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
              "eventStatus": "https://schema.org/EventScheduled"
            }
          ]
        }
      ])}
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
    </>
  );
}
