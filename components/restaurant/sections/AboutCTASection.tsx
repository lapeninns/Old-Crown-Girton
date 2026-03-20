'use client';
import { useEffect, useState } from 'react';
import BasicTest from '@/components/simple/BasicTest';
import {
  bannerButtonRecipe,
  ctaPanelRecipe,
  glassPanelRecipe,
  sectionDescriptionRecipe,
  sectionTitleRecipe,
} from '@/src/design-system';

/**
 * Props interfaces for AboutCTASection component
 */
interface ContactInfo {
  address: string;
  hours?: string; // Make hours optional since we'll fetch dynamically
}

interface AboutCTASectionProps {
  title: string;
  description: string;
  buttonText: string;
  buttonHref: string;
  contact: ContactInfo;
  buttonLabel?: string;
  className?: string;
}

/**
 * AboutCTASection Component
 * 
 * Displays a call-to-action section for booking with contact information.
 * Extracted from About page for better modularity and reusability.
 * 
 * Features:
 * - Centered layout with prominent CTA button
 * - External link handling with security attributes
 * - Dynamic opening hours from useOpeningHours hook
 * - Contact information display
 * - Framer Motion animations
 * - Focus management and accessibility
 * - Design system styling
 */
export default function AboutCTASection({ 
  title,
  description,
  buttonText,
  buttonHref,
  contact,
  buttonLabel,
  className = '' 
}: AboutCTASectionProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!title || !buttonText || !buttonHref) {
    return null;
  }

  const isExternal = buttonHref.startsWith('http');

  return (
    <section className={`${className}`}>
      <div className={ctaPanelRecipe()}>
        <div className="text-center">
          <h2 className={sectionTitleRecipe('mb-4 text-3xl text-white md:text-4xl')}>
            🏛️ {title}
          </h2>
          
          {description && (
            <p className={sectionDescriptionRecipe('mb-8 text-white/95')}>
              {description}
            </p>
          )}
          
          <div className="mb-8">
            <a
              href={buttonHref}
              {...(isExternal && {
                target: '_blank',
                rel: 'noopener noreferrer'
              })}
              className={bannerButtonRecipe('light', 'focus-visible:ring-offset-brand-700')}
              aria-label={buttonLabel || buttonText}
            >
              <span className="mr-2" aria-hidden="true">📞</span>
              {buttonText}
              {isExternal && (
                <span className="ml-2 text-sm" aria-hidden="true">
                  ↗
                </span>
              )}
            </a>
          </div>
          
          {contact && (
            <div className={glassPanelRecipe()}>
              {contact.address && (
                <p className="mb-2">
                  <span className="font-semibold text-white">Address:</span> {contact.address}
                </p>
              )}
              <p>
                <span className="font-semibold text-white">Opening Hours:</span>{' '}
                <span className="text-accent-200">
                  {isClient ? <BasicTest /> : <span className="italic">Loading hours...</span>}
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
