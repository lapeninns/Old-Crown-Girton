'use client';

import { motion } from 'framer-motion';

/**
 * Props interfaces for EventsContactSection component
 */
interface EventsContactSectionProps {
  title: string;
  description: string;
  phone: string;
  className?: string;
}

/**
 * EventsContactSection Component
 * 
 * Displays private events booking section with contact information and use cases.
 * Extracted from Events page for better modularity and reusability.
 * 
 * Features:
 * - Call-to-action button with phone link
 * - Grid layout for use cases examples
 * - Framer Motion animations
 * - Responsive design
 * - Semantic HTML structure
 * - Design system styling
 */
export default function EventsContactSection({ 
  title, 
  description, 
  phone, 
  className = '' 
}: EventsContactSectionProps) {
  if (!title || !phone) {
    return null;
  }

  const useCases = [
    'Birthday / anniversary',
    'Society socials', 
    'Project / team wrap-up',
    'Family celebrations',
    'Seasonal gatherings',
    'Visitor meet-ups'
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02 }}
      className={`bg-white rounded-xl shadow-lg p-8 transition-transform duration-200 ${className}`}
    >
      <div className="text-center">
        <motion.span 
          initial={{ scale: 0, rotate: -180 }}
          whileInView={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-6xl mb-4 block"
          aria-hidden="true"
        >
          🎉
        </motion.span>
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-2xl font-display font-bold text-brand-700 mb-4"
        >
          {title}
        </motion.h2>
        
        {description && (
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-brand-600 mb-6"
          >
            {description}
          </motion.p>
        )}
        
        {/* Use Cases Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="bg-neutral-100 rounded-lg p-6 mb-6"
        >
          <h3 className="font-bold text-brand-700 mb-3">
            Sample Use Cases:
          </h3>
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6, staggerChildren: 0.1 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-brand-600"
          >
            {useCases.map((useCase, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.7 + (index * 0.1) }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="flex items-center hover:bg-neutral-200/50 px-2 py-1 rounded transition-colors duration-200"
              >
                <span className="mr-2 text-accent">•</span>
                {useCase}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
        
        {/* Contact Button */}
        <motion.a
          href={`tel:${phone.replace(/\\s/g, '')}`}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block bg-accent hover:bg-accent-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-accent/60"
          aria-label={`Call restaurant to enquire about private events at ${phone}`}
        >
          📞 Enquire / Book: {phone}
        </motion.a>
      </div>
    </motion.div>
  );
}