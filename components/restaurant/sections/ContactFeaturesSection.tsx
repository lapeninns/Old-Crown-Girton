'use client';

import { motion } from 'framer-motion';

/**
 * Props interfaces for ContactFeaturesSection component
 */
interface FeatureItem {
  icon?: string;
  text?: string;
}

interface ContactFeaturesSectionProps {
  title: string;
  items: FeatureItem[];
  className?: string;
}

/**
 * ContactFeaturesSection Component
 * 
 * Displays restaurant features in a grid layout with icons.
 * Extracted from Contact page for better modularity and reusability.
 * 
 * Features:
 * - Responsive 2-column grid layout
 * - Icon and text combination for each feature
 * - Framer Motion stagger animations
 * - Hover effects for interactive feel
 * - Semantic HTML structure
 * - Design system styling with proper spacing
 */
export default function ContactFeaturesSection({ 
  title, 
  items, 
  className = '' 
}: ContactFeaturesSectionProps) {
  if (!title || !items || items.length === 0) {
    return null;
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02 }}
      className={`bg-neutral-50 border-2 border-neutral-200 p-6 rounded-xl transition-transform duration-200 ${className}`}
    >
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        viewport={{ once: true }}
        className="text-xl font-display font-bold text-stout-700 mb-4"
      >
        {title}
      </motion.h2>
      
      <motion.div 
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-2 gap-3 text-sm"
      >
        {items.map((feature: FeatureItem, index: number) => {
          // Skip items that don't have required properties
          if (!feature.icon || !feature.text) {
            return null;
          }
          
          return (
            <motion.div 
              key={index}
              variants={item}
              whileHover={{ 
                scale: 1.05,
                backgroundColor: "var(--overlay-10)"
              }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 p-2 rounded-md transition-colors duration-200 cursor-default"
            >
              <span className="text-lg flex-shrink-0" aria-hidden="true">
                {feature.icon}
              </span>
              <span className="text-foreground font-medium">
                {feature.text}
              </span>
            </motion.div>
          );
        }).filter(Boolean)}
      </motion.div>
    </motion.div>
  );
}