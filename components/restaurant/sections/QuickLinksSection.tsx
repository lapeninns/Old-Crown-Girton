'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

/**
 * Props interface for QuickLinksSection component
 * Following the established pattern from existing components
 */
interface QuickLinkItem {
  title?: string;
  description?: string;
  link?: string;
  linkText?: string;
}

interface QuickLinksSectionProps {
  links: QuickLinkItem[];
  className?: string;
}

/**
 * QuickLinksSection Component
 * 
 * Displays a grid of quick navigation links for the home page.
 * Extracted from inline section in /app/page.tsx for better modularity.
 * 
 * Features:
 * - Responsive grid layout (1 col mobile, 3 cols desktop)
 * - Framer Motion animations following existing patterns
 * - Semantic HTML and accessibility features
 * - Design system color tokens
 */
export default function QuickLinksSection({ links, className = '' }: QuickLinksSectionProps) {
  if (!links || links.length === 0) {
    return null;
  }

  return (
    <section className={`py-12 bg-white lazy-section ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid gap-8 md:grid-cols-3"
        >
          {links.map((link, index) => {
            // Skip items with missing required data
            if (!link.title || !link.description || !link.link || !link.linkText) {
              return null;
            }
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 rounded-lg border border-neutral-200 bg-neutral/40 hover:bg-neutral/60 transition-colors duration-200"
              >
                <h3 className="font-display font-bold text-xl mb-2 text-brand-700">
                  {link.title}
                </h3>
                <p className="text-brand-600 text-sm mb-4">
                  {link.description}
                </p>
                <Link 
                  href={link.link} 
                  className="text-foreground-strong font-semibold hover:underline transition-all duration-200 hover:text-accent-700"
                  aria-label={`${link.title}: ${link.linkText}`}
                >
                  {link.linkText}
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}