'use client';

import { motion } from 'framer-motion';

/**
 * Props interfaces for SocialMediaSection component
 */
interface SocialMediaSectionProps {
  title?: string;
  description?: string;
  className?: string;
}

/**
 * SocialMediaSection Component
 * 
 * Displays social media links with proper icons and accessibility.
 * Extracted from Contact page for better modularity and reusability.
 * 
 * Features:
 * - Facebook and Instagram links with SVG icons
 * - External link security attributes
 * - Hover and focus animations
 * - Screen reader accessible labels
 * - Centered layout design
 * - Design system color scheme
 */
export default function SocialMediaSection({ 
  title = "Follow Us",
  description = "Stay updated with our latest news and special offers",
  className = '' 
}: SocialMediaSectionProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02 }}
      className={`bg-accent-50 border-2 border-accent-500 p-6 rounded-xl text-center transition-transform duration-200 ${className}`}
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
      
      {description && (
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-neutral-600 mb-4"
        >
          {description}
        </motion.p>
      )}
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        viewport={{ once: true }}
        className="flex justify-center space-x-6"
      >
        {/* Facebook Link */}
        <motion.a 
          href="https://facebook.com" 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="text-accent hover:text-accent-700 transition-colors duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-accent/60 rounded-full p-1"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Follow us on Facebook"
        >
          <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </motion.a>
        
        {/* Instagram Link */}
        <motion.a 
          href="https://instagram.com" 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="text-accent hover:text-accent-700 transition-colors duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-accent/60 rounded-full p-1"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Follow us on Instagram"
        >
          <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.621 5.367 11.987 11.988 11.987 6.62 0 11.987-5.366 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.291C3.897 14.411 3.29 13.043 3.29 11.498c0-1.544.608-2.913 1.837-4.198.875-.801 2.026-1.291 3.323-1.291 1.297 0 2.448.49 3.323 1.291 1.228 1.285 1.837 2.654 1.837 4.198 0 1.545-.609 2.913-1.837 4.199-.875.8-2.026 1.291-3.323 1.291z"/>
          </svg>
        </motion.a>
      </motion.div>
    </motion.div>
  );
}