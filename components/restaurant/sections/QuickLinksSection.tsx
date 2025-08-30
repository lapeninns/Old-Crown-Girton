'use client';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { v } from '@/components/variants';

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

  const prefersReduced = useReducedMotion();
  const itemVariant = prefersReduced ? { initial: { opacity: 0 }, animate: { opacity: 1 } } : v.fadeUp;

  return (
    <section className={`py-12 bg-surface-base lazy-section ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div className="grid gap-8 md:grid-cols-3" variants={v.list()} initial="initial" whileInView="animate" viewport={{ once: true, margin: '-10% 0%' }}>
          {links.map((link, index) => {
            // Skip items with missing required data
            if (!link.title || !link.description || !link.link || !link.linkText) {
              return null;
            }
            
            
            return (
              <motion.div
                key={index}
                variants={itemVariant as any}
                className="p-6 rounded-lg border border-neutral-200 bg-neutral/40 hover-lift gpu-fix"
                whileHover={{ y: -2, scale: 1.01 }}
                transition={{ duration: 0.18 }}
              >
                <h3 className="font-display font-bold text-xl mb-2 text-brand-700">
                  {link.title}
                </h3>
                <p className="text-brand-600 text-sm mb-4">
                  {link.description}
                </p>
                <div>
                  <motion.a 
                    href={link.link} 
                    className="text-foreground-strong font-semibold hover:underline inline-block"
                    aria-label={`${link.title}: ${link.linkText}`}
                    whileHover={{ y: -2, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.18 }}
                  >
                    {link.linkText}
                  </motion.a>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
