'use client';

/**
 * Props interfaces for RegularEventsSection component
 */
interface RegularEvent {
  title?: string;
  description?: string;
  frequency?: string;
  icon?: string;
  startDate?: string;
  endDate?: string;
}

interface RegularEventsSectionProps {
  events: RegularEvent[];
  className?: string;
}

/**
 * RegularEventsSection Component
 * 
 * Displays regular events list with schema markup and animations.
 * Extracted from Events page for better modularity and reusability.
 * 
 * Features:
 * - Schema.org Event markup for SEO
 * - Framer Motion stagger animations
 * - Responsive card layout with icons
 * - Hover effects and smooth transitions
 * - Semantic HTML structure
 * - Design system styling
 */
export default function RegularEventsSection({ 
  events, 
  className = '' 
}: RegularEventsSectionProps) {
  if (!events || events.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {events.map((event, index) => {
        // Skip events without required properties
        if (!event.title || !event.description || !event.frequency) {
          return null;
        }
        
        return (
          <div 
            key={index}
            className="bg-surface-base rounded-xl shadow-lg p-6"
            itemScope
            itemType="https://schema.org/Event"
          >
            <div className="flex items-start gap-4">
              {event.icon && (
                <span className="text-4xl" aria-hidden="true">
                  {event.icon}
                </span>
              )}
              
              <div className="flex-1">
                <h3 
                  className="text-xl font-display font-bold text-brand-700 mb-2" 
                  itemProp="name"
                >
                  {event.title}
                </h3>
                
                <p className="text-brand-600 mb-2" itemProp="description">
                  {event.description}
                </p>
                
                {/* Schema markup */}
                {event.startDate && (
                  <meta itemProp="startDate" content={event.startDate} />
                )}
                {event.endDate && (
                  <meta itemProp="endDate" content={event.endDate} />
                )}
                
                <p className="text-sm font-medium text-accent-500" itemProp="eventSchedule">
                  {event.frequency}
                </p>
              </div>
            </div>
          </div>
        );
      }).filter(Boolean)}
    </div>
  );
}
