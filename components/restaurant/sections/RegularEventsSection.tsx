'use client';

import { motion } from 'framer-motion';

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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className={`space-y-6 ${className}`}
    >
      {events.map((event, index) => {
        // Skip events without required properties
        if (!event.title || !event.description || !event.frequency) {
          return null;
        }
        
        return (
          <motion.div 
            key={index}
            variants={item}
            whileHover={{ 
              scale: 1.02,
              boxShadow: "var(--shadow-medium)"
            }}
            className="bg-surface-base rounded-xl shadow-lg p-6 transition-all duration-200" 
            itemScope 
            itemType="https://schema.org/Event"
          >
            <div className="flex items-start gap-4">
              {event.icon && (
                <motion.span 
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="text-4xl"
                  aria-hidden="true"
                >
                  {event.icon}
                </motion.span>
              )}
              
              <div className="flex-1">
                <motion.h3 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="text-xl font-display font-bold text-brand-700 mb-2" 
                  itemProp="name"
                >
                  {event.title}
                </motion.h3>
                
                <motion.p 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="text-brand-600 mb-2" 
                  itemProp="description"
                >
                  {event.description}
                </motion.p>
                
                {/* Schema markup */}
                {event.startDate && (
                  <meta itemProp="startDate" content={event.startDate} />
                )}
                {event.endDate && (
                  <meta itemProp="endDate" content={event.endDate} />
                )}
                
                <motion.p 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="text-sm font-medium text-accent-500" 
                  itemProp="eventSchedule"
                >
                  {event.frequency}
                </motion.p>
              </div>
            </div>
          </motion.div>
        );
      }).filter(Boolean)}
    </motion.div>
  );
}