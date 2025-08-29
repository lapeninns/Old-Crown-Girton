'use client';
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
    <section className={`py-12 bg-surface-base lazy-section ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {links.map((link, index) => {
            // Skip items with missing required data
            if (!link.title || !link.description || !link.link || !link.linkText) {
              return null;
            }
            
            
            return (
              <div
                key={index}
                className="p-6 rounded-lg border border-neutral-200 bg-neutral/40"
              >
                <h3 className="font-display font-bold text-xl mb-2 text-brand-700">
                  {link.title}
                </h3>
                <p className="text-brand-600 text-sm mb-4">
                  {link.description}
                </p>
                <div>
                  <a 
                    href={link.link} 
                    className="text-foreground-strong font-semibold hover:underline"
                    aria-label={`${link.title}: ${link.linkText}`}
                  >
                    {link.linkText}
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
