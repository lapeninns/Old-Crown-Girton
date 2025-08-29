'use client';
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

  return (
    <section className={`py-16 bg-stout-700 text-white ${className}`}>
      <div className="max-w-4xl mx-auto text-center px-4">
        <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
          {title}
        </h2>
        
        <p className="text-xl text-neutral-200 mb-8">
          {description}
        </p>
        
        <div className="flex flex-wrap gap-4 justify-center">
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
              <div key={index}>
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
              </div>
            );
          })}
        </div>

        {allergenNotice && (
          <div className="mt-8 text-sm text-neutral-300">
            <p className="text-neutral-300">{allergenNotice}</p>
          </div>
        )}
      </div>
    </section>
  );
}
