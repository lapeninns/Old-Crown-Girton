'use client';
import { buttonRecipe, contentPanelRecipe, panelTextRecipe, panelTitleRecipe } from '@/src/design-system';

/**
 * Props interfaces for ContactInfoSection component
 */
interface PhoneInfo {
  title: string;
  description: string;
  number: string;
}

interface LocationInfo {
  title: string;
  description: string;
  address: string;
}

interface ContactInfoSectionProps {
  phone: PhoneInfo;
  location: LocationInfo;
  className?: string;
}

/**
 * ContactInfoSection Component
 * 
 * Displays phone, address, and email contact information for the restaurant.
 * Extracted from Contact page for better modularity and reusability.
 * 
 * Features:
 * - Responsive card layout with icons
 * - Clickable phone number and email links
 * - Accessible link labels and focus management
 * - Framer Motion stagger animations
 * - Design system styling with proper contrast
 * - Address parsing for multi-line display
 */
export default function ContactInfoSection({ 
  phone, 
  location, 
  className = '' 
}: ContactInfoSectionProps) {
  if (!phone || !location) {
    return null;
  }

  // No motion: remove animation variants

  // Parse address into lines for better display
  const addressLines = location.address.split(', ');

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Phone */}
      <div className={contentPanelRecipe()}>
        <div className="flex items-center gap-4 mb-4">
          <span className="text-4xl" aria-hidden="true">📞</span>
          <div>
            <h2 className={panelTitleRecipe()}>
              {phone.title}
            </h2>
            <p className={panelTextRecipe()}>
              {phone.description}
            </p>
          </div>
        </div>
              <p>
                <strong>Phone:</strong> 
                <a href={`tel:${phone.number.replace(/\s/g, '')}`} className={buttonRecipe({ variant: 'brand', size: 'sm', className: 'ml-2 inline-flex' })}>
                  {phone.number}
                </a>
              </p>
      </div>

      {/* Address */}
      <div className={contentPanelRecipe()}>
        <div className="flex items-start gap-4 mb-4">
          <span className="text-4xl" aria-hidden="true">📍</span>
          <div>
            <h2 className={panelTitleRecipe('mb-2')}>
              {location.title}
            </h2>
            <address className={`${panelTextRecipe()} not-italic`}>
              {addressLines.map((line: string, index: number) => (
                <p key={index}>{line}</p>
              ))}
            </address>
          </div>
        </div>
        <p className={panelTextRecipe('text-neutral-500')}>
          {location.description}
        </p>
      </div>

      {/* Email */}
      <div className={contentPanelRecipe()}>
        <div className="flex items-center gap-4 mb-4">
          <span className="text-4xl" aria-hidden="true">📧</span>
          <div>
            <h2 className={panelTitleRecipe()}>
              Email
            </h2>
            <p className={panelTextRecipe()}>
              Send us a message
            </p>
          </div>
        </div>
              <a
                href={`mailto:${'oldcrown@lapeninns.com'}`}
                className={buttonRecipe({ variant: 'outline', size: 'sm', className: 'inline-flex' })}
                aria-label="Email restaurant at oldcrown@lapeninns.com"
              >
                oldcrown@lapeninns.com
              </a>
      </div>
    </div>
  );
}
