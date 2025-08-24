'use client';

import { motion } from 'framer-motion';

/**
 * Props interfaces for AboutCTASection component
 */
interface ContactInfo {
  address: string;
  hours: string;
}

interface AboutCTASectionProps {
  title: string;
  description: string;
  buttonText: string;
  buttonHref: string;
  contact: ContactInfo;
  buttonLabel?: string;
  className?: string;
}

/**
 * AboutCTASection Component
 * 
 * Displays a call-to-action section for booking with contact information.
 * Extracted from About page for better modularity and reusability.
 * 
 * Features:
 * - Centered layout with prominent CTA button
 * - External link handling with security attributes
 * - Contact information display
 * - Framer Motion animations
 * - Focus management and accessibility
 * - Design system styling
 */
export default function AboutCTASection({ 
  title,
  description,
  buttonText,
  buttonHref,
  contact,
  buttonLabel,
  className = '' 
}: AboutCTASectionProps) {
  if (!title || !buttonText || !buttonHref) {
    return null;
  }

  const isExternal = buttonHref.startsWith('http');

  return (
    <motion.section 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className={`${className}`}
    >
      <div className="bg-accent-50 rounded-xl p-8 text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-xl font-display font-bold text-brand-700 mb-4"
        >
          {title}
        </motion.h2>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <a
            href={buttonHref}
            {...(isExternal && {
              target: '_blank',
              rel: 'noopener noreferrer'
            })}
            className="inline-block bg-accent-950 text-neutral-50 font-bold py-4 px-8 rounded-lg text-lg transition-colors duration-200 hover:bg-accent-950 focus:outline-none focus-visible:ring-4 focus-visible:ring-accent/60"
            aria-label={buttonLabel || buttonText}
          >
            {buttonText}
            {isExternal && (
              <span className="ml-2 text-sm" aria-hidden="true">
                ↗
              </span>
            )}
          </a>
        </motion.div>
        
        {description && (
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-neutral-600 mt-4 mb-2"
          >
            {description}
          </motion.p>
        )}
        
        {contact && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-4 text-sm text-neutral-600"
          >
            {contact.address && (
              <p>
                <span className="font-semibold">Address:</span> {contact.address}
              </p>
            )}
            {contact.hours && (
              <p>
                <span className="font-semibold">Opening Hours:</span>{' '}
                <span className="italic">{contact.hours}</span>
              </p>
            )}
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}