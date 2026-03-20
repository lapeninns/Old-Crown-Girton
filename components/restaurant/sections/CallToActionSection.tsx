'use client';
import Link from '@/lib/debugLink';
import {
  bannerButtonRecipe,
  ctaPanelRecipe,
  sectionDescriptionRecipe,
  sectionInnerClassName,
  sectionShellClassName,
  sectionTitleRecipe,
} from '@/src/design-system';

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

  const getButtonClasses = (variant: CTAButton['variant']): string => {
    switch (variant) {
      case 'brand':
        return bannerButtonRecipe('light');
      case 'crimson':
        return bannerButtonRecipe('heritage');
      case 'accent':
      default:
        return bannerButtonRecipe('light');
    }
  };

  return (
    <section className={`bg-white ${sectionShellClassName} ${className}`}>
      <div className={sectionInnerClassName}>
        <div className={ctaPanelRecipe()}>
          <div className="text-center">
            <h2 className={sectionTitleRecipe('mb-4 text-3xl text-white md:text-4xl')}>
              🎉 {headline}
            </h2>
            <p className={sectionDescriptionRecipe('mb-8 text-neutral-100')}>
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
                      className={getButtonClasses(button.variant)}
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
