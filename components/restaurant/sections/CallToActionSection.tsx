'use client';
import Link from '@/lib/debugLink';

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
    const baseClasses = 'font-bold py-4 px-8 rounded-lg text-base focus:outline-none focus:ring-4 focus:ring-offset-2 transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105';
    
    switch (variant) {
      case 'accent':
        return `${baseClasses} bg-white hover:bg-neutral-50 text-brand-800 border-2 border-brand-200 focus:ring-brand-300`;
      case 'brand':
        return `${baseClasses} bg-brand-900 hover:bg-brand-950 text-white border-2 border-white/20 focus:ring-white/30`;
      case 'crimson':
        return `${baseClasses} bg-white hover:bg-neutral-50 text-crimson-700 border-2 border-crimson-200 focus:ring-crimson-300`;
      default:
        return `${baseClasses} bg-white hover:bg-neutral-50 text-brand-800 border-2 border-brand-200 focus:ring-brand-300`;
    }
  };  return (
    <section className={`bg-white py-16 ${className}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-brand-600 to-brand-800 rounded-2xl p-8 md:p-12 shadow-xl transition-all duration-300 hover:transform hover:-translate-y-2 border-2 border-brand-700">
          <div className="text-center">
            <h2 className="font-display font-bold text-white mb-4 h2 drop-shadow-lg text-3xl md:text-4xl">
              🎉 {headline}
            </h2>
            <p className="text-neutral-100 mb-8 text-lg max-w-2xl mx-auto leading-relaxed">
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
                    <Link
                      href={button.href}
                      className={`${getButtonClasses(button.variant)}`}
                      {...buttonProps}
                    >
                      {button.text}
                      {isExternal && (
                        <span className="ml-1 text-xs" aria-hidden="true">
                          ↗
                        </span>
                      )}
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
