'use client';
import { useEffect, useState } from 'react';
import BasicTest from '@/components/simple/BasicTest';

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
      <div className="bg-accent-50 rounded-xl p-8 text-center">
        <h2 className="text-xl font-display font-bold text-brand-700 mb-4">
          {title}
        </h2>
        
        <div>
          <a
            href={buttonHref}
            {...(isExternal && {
              target: '_blank',
              rel: 'noopener noreferrer'
            })}
            className="inline-block bg-brand-600 text-neutral-50 font-bold py-4 px-8 rounded-lg text-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/60 shadow-lg"
            aria-label={buttonLabel || buttonText}
          >
            {buttonText}
            {isExternal && (
              <span className="ml-2 text-sm" aria-hidden="true">
                ↗
              </span>
            )}
          </a>
        </div>
        
        {description && (
          <p className="text-neutral-600 mt-4 mb-2">
            {description}
          </p>
        )}
        
        {contact && (
          <div className="mt-4 text-sm text-neutral-600">
            {contact.address && (
              <p>
                <span className="font-semibold">Address:</span> {contact.address}
              </p>
            )}
            <p>
              <span className="font-semibold">Opening Hours:</span>{' '}
              {isClient ? <BasicTest /> : <span className="italic">Loading hours...</span>}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
