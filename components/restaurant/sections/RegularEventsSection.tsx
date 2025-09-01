'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { variants as mv } from '@/lib/motion/variants';

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
  const prefersReduced = useReducedMotion();
  const itemVariant = prefersReduced ? mv.fadeIn : mv.fadeUp;

  return (
    <motion.div className={`space-y-6 ${className}`} variants={mv.staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-10% 0%' }}>
      {events.map((event, index) => {
        // Skip events without required properties
        if (!event.title || !event.description || !event.frequency) {
          return null;
        }
        
        return (
          <motion.div 
            key={index}
            variants={itemVariant as any}
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
                
                {/* Visible date/time for users (also included as schema meta above) */}
                {event.startDate && (
                  <p className="text-sm text-brand-500 mb-1">
                    {formatEventDate(event.startDate, event.endDate)}
                  </p>
                )}

                <p className="text-sm font-medium text-accent-500" itemProp="eventSchedule">
                  {event.frequency}
                </p>
              </div>
            </div>
          </motion.div>
        );
      }).filter(Boolean)}
    </motion.div>
  );
}

// Helper: format ISO date/time into human readable string
function formatEventDate(start?: string, end?: string) {
  if (!start) return '';
  try {
    const s = new Date(start);
    const parts = s.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const time = s.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    if (end) {
      const e = new Date(end);
      const endTime = e.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
      return `${parts} • ${time}–${endTime}`;
    }
    return `${parts} • ${time}`;
  } catch {
    return start;
  }
}
