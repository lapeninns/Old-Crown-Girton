'use client';

import { motion } from 'framer-motion';

/**
 * Props interfaces for ContactInfoSection component
 */
interface PhoneInfo {
  title: string;
  description: string;
  number: string;
}

interface LocationInfo {
  title: string;
  description: string;
  address: string;
}

interface ContactInfoSectionProps {
  phone: PhoneInfo;
  location: LocationInfo;
  className?: string;
}

/**
 * ContactInfoSection Component
 * 
 * Displays phone, address, and email contact information for the restaurant.
 * Extracted from Contact page for better modularity and reusability.
 * 
 * Features:
 * - Responsive card layout with icons
 * - Clickable phone number and email links
 * - Accessible link labels and focus management
 * - Framer Motion stagger animations
 * - Design system styling with proper contrast
 * - Address parsing for multi-line display
 */
export default function ContactInfoSection({ 
  phone, 
  location, 
  className = '' 
}: ContactInfoSectionProps) {
  if (!phone || !location) {
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

  // Parse address into lines for better display
  const addressLines = location.address.split(', ');

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className={`space-y-8 ${className}`}
    >
      {/* Phone */}
      <motion.div 
        variants={item}
        whileHover={{ scale: 1.02 }}
        className="bg-neutral-50 p-6 rounded-xl shadow-lg transition-transform duration-200"
      >
        <div className="flex items-center gap-4 mb-4">
          <span className="text-4xl" aria-hidden="true">📞</span>
          <div>
            <h2 className="text-xl font-display font-bold text-brand-700">
              {phone.title}
            </h2>
            <p className="text-neutral-600">
              {phone.description}
            </p>
          </div>
        </div>
              <p>
                <strong>Phone:</strong> 
                <a href={`tel:${phone.number.replace(/\s/g, '')}`} className="inline-block bg-brand-600 hover:bg-brand-700 text-neutral-50 font-semibold py-1 px-3 rounded ml-2 transition-colors duration-200">
                  {phone.number}
                </a>
              </p>
      </motion.div>

      {/* Address */}
      <motion.div 
        variants={item}
        whileHover={{ scale: 1.02 }}
        className="bg-neutral-50 p-6 rounded-xl shadow-lg transition-transform duration-200"
      >
        <div className="flex items-start gap-4 mb-4">
          <span className="text-4xl" aria-hidden="true">📍</span>
          <div>
            <h2 className="text-xl font-display font-bold text-brand-700 mb-2">
              {location.title}
            </h2>
            <address className="text-neutral-600 not-italic">
              {addressLines.map((line: string, index: number) => (
                <p key={index}>{line}</p>
              ))}
            </address>
          </div>
        </div>
        <p className="text-sm text-neutral-500">
          {location.description}
        </p>
      </motion.div>

      {/* Email */}
      <motion.div 
        variants={item}
        whileHover={{ scale: 1.02 }}
        className="bg-neutral-50 p-6 rounded-xl shadow-lg transition-transform duration-200"
      >
        <div className="flex items-center gap-4 mb-4">
          <span className="text-4xl" aria-hidden="true">📧</span>
          <div>
            <h2 className="text-xl font-display font-bold text-brand-700">
              Email
            </h2>
            <p className="text-neutral-600">
              Send us a message
            </p>
          </div>
        </div>
              <motion.a
                href={`mailto:${'info@oldcrowngirton.co.uk'}`}
                whileHover={{ scale: 1.05 }}
                className="inline-block bg-brand-600 hover:bg-brand-700 text-neutral-50 font-semibold py-2 px-4 rounded transition-colors duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/60"
                aria-label="Email restaurant at info@oldcrowngirton.co.uk"
              >
                info@oldcrowngirton.co.uk
              </motion.a>
      </motion.div>
    </motion.div>
  );
}