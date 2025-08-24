'use client';

import { motion } from 'framer-motion';
import MenuInfoCollapse from '@/components/menu/MenuInfoCollapse';

/**
 * Props interfaces for MenuInformationSection component
 */
interface FAQItem {
  question?: string;
  answer?: string;
}

interface MenuInformationSectionProps {
  title?: string;
  faqItems: FAQItem[];
  className?: string;
}

/**
 * MenuInformationSection Component
 * 
 * Displays menu information and dietary requirements in a collapsed accordion format.
 * Extracted from Menu page for better modularity and reusability.
 * 
 * Features:
 * - Collapsible FAQ accordion
 * - Framer Motion animations
 * - Responsive design
 * - Semantic HTML structure
 * - Design system styling
 */
export default function MenuInformationSection({ 
  title = "Menu Information & Dietary Requirements",
  faqItems,
  className = '' 
}: MenuInformationSectionProps) {
  if (!faqItems || faqItems.length === 0) {
    return null;
  }

  // Transform FAQ items to the format expected by MenuInfoCollapse
  const collapseItems = faqItems
    .filter(item => item.question && item.answer) // Only include items with both question and answer
    .map((item) => ({
      title: item.question!,
      content: <>{item.answer}</>
    }));

  return (
    <motion.section 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className={`py-16 bg-brand-50/20 ${className}`}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-3xl font-display font-bold text-stout-700 text-center mb-12"
        >
          {title}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <MenuInfoCollapse items={collapseItems} />
        </motion.div>
      </div>
    </motion.section>
  );
}