'use client';

import { motion } from 'framer-motion';

/**
 * Props interfaces for OpeningHoursSection component
 */
interface ScheduleItem {
  days: string;
  hours: string;
}

interface HoursInfo {
  title: string;
  schedule: ScheduleItem[];
}

interface OpeningHoursSectionProps {
  title: string;
  restaurant: HoursInfo;
  bar: HoursInfo;
  className?: string;
}

/**
 * OpeningHoursSection Component
 * 
 * Displays restaurant and bar opening hours in a structured format.
 * Extracted from Contact page for better modularity and reusability.
 * 
 * Features:
 * - Clear separation between restaurant and bar hours
 * - Structured table-like layout for easy scanning
 * - Responsive design with proper spacing
 * - Framer Motion animations
 * - Semantic HTML with proper heading hierarchy
 * - Design system styling
 */
export default function OpeningHoursSection({ 
  title,
  restaurant, 
  bar,
  className = '' 
}: OpeningHoursSectionProps) {
  if (!title || !restaurant || !bar) {
    return null;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02 }}
      className={`bg-neutral-100 p-6 rounded-xl transition-transform duration-200 ${className}`}
    >
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        viewport={{ once: true }}
        className="flex items-center gap-4 mb-6"
      >
        <span className="text-4xl" aria-hidden="true">⏰</span>
        <h2 className="text-xl font-display font-bold text-brand-700">
          {title}
        </h2>
      </motion.div>
      
      <div className="space-y-4">
        {/* Restaurant Hours */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <h3 className="font-bold text-brand-700 mb-2">
            {restaurant.title}
          </h3>
          <div className="space-y-1 text-neutral-600">
            {restaurant.schedule.map((schedule: ScheduleItem, index: number) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + (index * 0.1) }}
                viewport={{ once: true }}
                className="flex justify-between hover:bg-neutral-200/50 px-2 py-1 rounded transition-colors duration-200"
              >
                <span className="font-medium">{schedule.days}</span>
                <span className="font-mono text-sm">{schedule.hours}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Separator */}
        <motion.div 
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="border-t border-neutral-300 pt-4"
        >
          {/* Bar Hours */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <h3 className="font-bold text-brand-700 mb-2">
              {bar.title}
            </h3>
            <div className="space-y-1 text-neutral-600">
              {bar.schedule.map((schedule: ScheduleItem, index: number) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 + (index * 0.1) }}
                  viewport={{ once: true }}
                  className="flex justify-between hover:bg-neutral-200/50 px-2 py-1 rounded transition-colors duration-200"
                >
                  <span className="font-medium">{schedule.days}</span>
                  <span className="font-mono text-sm">{schedule.hours}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}