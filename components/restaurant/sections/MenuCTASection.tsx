'use client';
import Link from '@/lib/debugLink';
import { motion } from 'framer-motion';
import { variants as mv } from '@/lib/motion/variants';
import {
  bannerButtonRecipe,
  ctaPanelRecipe,
  sectionDescriptionRecipe,
  sectionInnerClassName,
  sectionShellClassName,
  sectionTitleRecipe,
} from '@/src/design-system';

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
  description = "Book a table or call for takeaway to experience the best of Nepal and Britain at Girton's historic thatched pub.",
  buttons,
  allergenNotice,
  className = '' 
}: MenuCTASectionProps) {
  if (!buttons || buttons.length === 0) {
    return null;
  }

  const getButtonClasses = (variant: string) => {
    switch (variant) {
      case 'secondary':
        return bannerButtonRecipe('light');
      case 'tertiary':
        return bannerButtonRecipe('heritage');
      case 'primary':
      default:
        return bannerButtonRecipe('light');
    }
  };

  return (
    <motion.section className={`bg-white ${sectionShellClassName} ${className}`} variants={mv.fadeUp} initial="hidden" animate="visible">
      <div className={sectionInnerClassName}>
        <div className={ctaPanelRecipe()}>
          <div className="text-center">
            <h2 className={sectionTitleRecipe('mb-6 text-3xl text-white md:text-4xl')}>
              🍽️ {title}
            </h2>
            
            <p className={sectionDescriptionRecipe('mb-8 text-white/95')}>
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
                      className={getButtonClasses(button.variant)}
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
