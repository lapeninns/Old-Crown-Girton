'use client';
import Link from '@/lib/debugLink';
import { motion } from 'framer-motion';
import { variants as mv } from '@/lib/motion/variants';

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
    const base = 'transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105';
    switch (variant) {
      case 'primary':
        return `${base} bg-white hover:bg-neutral-50 text-brand-800 border-2 border-brand-200`;
      case 'secondary':
        return `${base} bg-brand-900 hover:bg-brand-950 text-white border-2 border-white/20`;
      case 'tertiary':
        return `${base} bg-white hover:bg-neutral-50 text-brand-700 border-2 border-brand-200`;
      default:
        return `${base} bg-white hover:bg-neutral-50 text-brand-800 border-2 border-brand-200`;
    }
  };

  return (
    <motion.section className={`py-16 bg-white ${className}`} variants={mv.fadeUp} initial="hidden" animate="visible">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-brand-600 to-brand-800 rounded-2xl p-8 md:p-12 shadow-xl transition-all duration-300 hover:transform hover:-translate-y-2 border-2 border-brand-700">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6 text-white drop-shadow-lg">
              🍽️ {title}
            </h2>
            
            <p className="text-lg text-white/95 mb-8 max-w-2xl mx-auto leading-relaxed">
              {description}
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center mb-6">
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
                  <motion.div key={index} whileHover={mv.button.hover} whileTap={mv.button.tap}>
                    <ButtonComponent
                      {...buttonProps}
                      className={`${getButtonClasses(button.variant)} font-bold py-4 px-8 rounded-lg text-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-white/30 inline-block`}
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
            </div>

            {allergenNotice && (
              <div className="text-sm text-white/80 bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <p>{allergenNotice}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
