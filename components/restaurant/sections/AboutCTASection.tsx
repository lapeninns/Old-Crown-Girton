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
      <div className="bg-gradient-to-r from-brand-600 to-brand-800 rounded-2xl p-8 md:p-12 shadow-xl transition-all duration-300 hover:transform hover:-translate-y-2 border-2 border-brand-700">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4 drop-shadow-lg">
            🏛️ {title}
          </h2>
          
          {description && (
            <p className="text-lg text-white/95 mb-8 max-w-2xl mx-auto leading-relaxed">
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
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-brand-700 font-bold rounded-xl shadow-lg hover:bg-brand-50 hover:text-brand-800 transition-all duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-300 border-2 border-brand-100"
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
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white/90">
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
