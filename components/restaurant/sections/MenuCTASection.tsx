'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

/**
 * Props interfaces for MenuCTASection component
 */
interface CTAButton {
  text: string;
  href: string;
  variant: 'primary' | 'secondary' | 'tertiary';
  external?: boolean;
}

interface MenuCTASectionProps {
  title?: string;
  description?: string;
  buttons: CTAButton[];
  allergenNotice?: string;
  className?: string;
}

/**
 * MenuCTASection Component
 * 
 * Displays the final call-to-action section with booking buttons and allergen notice.
 * Extracted from Menu page for better modularity and reusability.
 * 
 * Features:
 * - Multiple CTA buttons with different variants
 * - External and internal link handling
 * - Allergen notice display
 * - Framer Motion animations
 * - Responsive button layout
 * - Design system styling
 */
export default function MenuCTASection({ 
  title = "Ready to Try Our Unique Menu?",
  description = "Book a table or order takeaway to experience the best of Nepal and Britain at Girton's historic thatched pub.",
  buttons,
  allergenNotice,
  className = '' 
}: MenuCTASectionProps) {
  if (!buttons || buttons.length === 0) {
    return null;
  }

  const getButtonClasses = (variant: string) => {
    switch (variant) {
      case 'primary':
        return 'bg-accent hover:bg-accent-700 text-white';
      case 'secondary':
        return 'bg-crimson-600 hover:bg-crimson-800 text-white';
      case 'tertiary':
        return 'bg-white hover:bg-neutral-100 text-stout-700';
      default:
        return 'bg-accent hover:bg-accent-700 text-white';
    }
  };

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

  return (
    <motion.section 
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className={`py-16 bg-stout-700 text-white ${className}`}
    >
      <div className="max-w-4xl mx-auto text-center px-4">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-display font-bold mb-6"
        >
          {title}
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-xl text-neutral-200 mb-8"
        >
          {description}
        </motion.p>
        
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="flex flex-wrap gap-4 justify-center"
        >
          {buttons.map((button, index) => {
            const ButtonComponent = button.external ? 'a' : Link;
            const buttonProps = button.external 
              ? { 
                  href: button.href,
                  target: '_blank',
                  rel: 'noopener noreferrer'
                }
              : { href: button.href };

            return (
              <motion.div key={index} variants={item}>
                <ButtonComponent
                  {...buttonProps}
                  className={`${getButtonClasses(button.variant)} font-bold py-4 px-8 rounded-lg text-lg transition-colors duration-200 hover:scale-105 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/30 inline-block`}
                >
                  {button.text}
                  {button.external && (
                    <span className="ml-2 text-sm" aria-hidden="true">
                      ↗
                    </span>
                  )}
                </ButtonComponent>
              </motion.div>
            );
          })}
        </motion.div>

        {allergenNotice && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="mt-8 text-sm text-neutral-300"
          >
            <p className="text-neutral-300">{allergenNotice}</p>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}