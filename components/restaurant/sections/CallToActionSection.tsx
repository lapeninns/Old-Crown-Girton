'use client';
import Link from 'next/link';

/**
 * Props interfaces for CallToActionSection component
 */
interface CTAButton {
  text: string;
  href: string;
  variant: 'accent' | 'brand' | 'crimson';
  external?: boolean;
  key?: string;
}

interface CallToActionSectionProps {
  headline: string;
  description: string;
  buttons: CTAButton[];
  className?: string;
}

/**
 * CallToActionSection Component
 * 
 * Displays a call-to-action section with headline, description, and action buttons.
 * Extracted from inline section in /app/page.tsx for better modularity.
 * 
 * Features:
 * - Multiple button variants with design system colors
 * - External link handling with proper security attributes
 * - Framer Motion animations for enhanced UX
 * - Responsive button layout
 * - Full accessibility support
 */
export default function CallToActionSection({ 
  headline, 
  description, 
  buttons, 
  className = '' 
}: CallToActionSectionProps) {
  if (!headline || !buttons || buttons.length === 0) {
    return null;
  }

  /**
   * Get button styling based on variant using design system tokens
   */
  const getButtonClasses = (variant: CTAButton['variant']): string => {
    const baseClasses = 'font-bold py-3 px-6 rounded-lg text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    switch (variant) {
      case 'accent':
        return `${baseClasses} bg-accent-600 hover:bg-accent-700 text-neutral-50 focus:ring-accent-500`;
      case 'brand':
        return `${baseClasses} bg-brand-700 hover:bg-brand-800 text-white focus:ring-brand-500`;
      case 'crimson':
        return `${baseClasses} bg-crimson-700 hover:bg-crimson-800 text-white focus:ring-crimson-500`;
      default:
        return `${baseClasses} bg-accent-600 hover:bg-accent-700 text-neutral-50 focus:ring-accent-500`;
    }
  };

  return (
    <section className={`py-16 bg-accent/10 ${className}`}>
      <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="font-display font-bold text-brand-700 mb-4 h2">
            {headline}
          </h2>
          <p className="text-brand-600 mb-6 text-body">
            {description}
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            {buttons.map((button, index) => {
              const isExternal = button.external || button.href.startsWith('http');
              const buttonProps = isExternal 
                ? {
                    target: '_blank' as const,
                    rel: 'noopener noreferrer' as const,
                    'aria-label': `${button.text} (opens in new tab)`
                  }
                : {
                    'aria-label': button.text
                  };

              return (
                <div key={button.key || button.text || index}>
                  <a
                    href={button.href}
                    className={getButtonClasses(button.variant)}
                    {...buttonProps}
                  >
                    {button.text}
                    {isExternal && (
                      <span className="ml-1 text-xs" aria-hidden="true">
                        ↗
                      </span>
                    )}
                  </a>
                </div>
              );
            })}
          </div>
      </div>
    </section>
  );
}
