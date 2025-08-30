'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { variants as mv } from '@/lib/motion/variants';

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
  const prefersReduced = useReducedMotion();
  const itemVariant = prefersReduced ? mv.fadeIn : mv.fadeUp;

  return (
    <motion.section className={`py-8 ${className}`} variants={itemVariant as any} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-10% 0%' }}>
      <div className="prose prose-lg max-w-none">
        <p className="text-neutral-600 mb-6">
          {introduction}
        </p>
        
        <h2 className="text-2xl font-display font-bold text-brand-700 mb-4 mt-8">
          {title}
        </h2>
        
        <motion.div className="space-y-6" variants={mv.staggerContainer} initial="hidden" whileInView="visible">
          {timeline.map((period, index) => {
            if (!period.period || !period.title || !period.description) {
              return null;
            }
            
            return (
              <motion.div key={index} className="relative mb-6 last:mb-0" variants={itemVariant as any}>
                {index < timeline.length - 1 && (
                  <div className="absolute left-0 top-8 w-0.5 h-16 bg-brand-200 hidden md:block" />
                )}
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
        </motion.div>
      </div>
    </motion.section>
  );
}
