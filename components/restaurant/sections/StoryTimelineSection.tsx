'use client';

import { motion } from 'framer-motion';

/**
 * Props interfaces for StoryTimelineSection component
 */
interface TimelinePeriod {
  period?: string;
  title?: string;
  description?: string;
}

interface StoryTimelineSectionProps {
  title: string;
  introduction: string;
  timeline: TimelinePeriod[];
  className?: string;
}

/**
 * StoryTimelineSection Component
 * 
 * Displays a timeline of the restaurant's history with introduction text.
 * Extracted from About page for better modularity and reusability.
 * 
 * Features:
 * - Responsive timeline layout
 * - Framer Motion animations with stagger effects
 * - Progressive disclosure of content
 * - Semantic HTML structure for accessibility
 * - Design system color tokens
 */
export default function StoryTimelineSection({ 
  title, 
  introduction, 
  timeline, 
  className = '' 
}: StoryTimelineSectionProps) {
  if (!timeline || timeline.length === 0) {
    return null;
  }

  return (
    <section className={`py-8 ${className}`}>
      <div className="prose prose-lg max-w-none">
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-neutral-600 mb-6"
        >
          {introduction}
        </motion.p>
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-2xl font-display font-bold text-brand-700 mb-4 mt-8"
        >
          {title}
        </motion.h2>
        
        <div className="space-y-6">
          {timeline.map((period, index) => {
            // Skip periods that don't have required properties
            if (!period.period || !period.title || !period.description) {
              return null;
            }
            
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + (index * 0.1) }}
                viewport={{ once: true }}
                className="relative mb-6 last:mb-0"
              >
                {/* Timeline connector */}
                {index < timeline.length - 1 && (
                  <div className="absolute left-0 top-8 w-0.5 h-16 bg-brand-200 hidden md:block" />
                )}
                
                {/* Timeline dot */}
                <div className="absolute left-0 top-2 w-3 h-3 bg-brand-600 rounded-full hidden md:block transform -translate-x-1" />
                
                <div className="md:ml-6">
                  <h3 className="text-lg font-semibold text-brand-700 mb-2">
                    <span className="font-semibold text-accent-600">{period.period}:</span>{' '}
                    {period.title}
                  </h3>
                  <p className="text-neutral-600 leading-relaxed">
                    {period.description}
                  </p>
                </div>
              </motion.div>
            );
          }).filter(Boolean)}
        </div>
      </div>
    </section>
  );
}