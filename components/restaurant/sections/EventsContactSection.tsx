'use client';
import { buttonRecipe, contentPanelRecipe, panelTextRecipe, softPanelRecipe, subsectionTitleRecipe } from '@/src/design-system';

/**
 * Props interfaces for EventsContactSection component
 */
interface EventsContactSectionProps {
  title: string;
  description: string;
  phone: string;
  className?: string;
}

/**
 * EventsContactSection Component
 * 
 * Displays private events booking section with contact information and use cases.
 * Extracted from Events page for better modularity and reusability.
 * 
 * Features:
 * - Call-to-action button with phone link
 * - Grid layout for use cases examples
 * - Framer Motion animations
 * - Responsive design
 * - Semantic HTML structure
 * - Design system styling
 */
export default function EventsContactSection({ 
  title, 
  description, 
  phone, 
  className = '' 
}: EventsContactSectionProps) {
  if (!title || !phone) {
    return null;
  }

  const useCases = [
    'Birthday / anniversary',
    'Society socials', 
    'Project / team wrap-up',
    'Family celebrations',
    'Seasonal gatherings',
    'Visitor meet-ups'
  ];

  return (
    <div className={contentPanelRecipe(`text-center ${className}`.trim())}>
      <div className="text-center">
        <span className="text-6xl mb-4 block" aria-hidden="true">
          🎉
        </span>
        
        <h2 className={subsectionTitleRecipe('mb-4')}>
          {title}
        </h2>
        
        {description && (
          <p className={panelTextRecipe('mb-6')}>{description}</p>
        )}
        
        {/* Use Cases Grid */}
        <div className={softPanelRecipe('mb-6')}>
          <h3 className="font-bold text-brand-700 mb-3">
            Events? We host all kinds of private events, including:
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-brand-600">
            {useCases.map((useCase, index) => (
              <div key={index} className="flex items-center px-2 py-1 rounded">
                <span className="mr-2 text-accent">•</span>
                {useCase}
              </div>
            ))}
          </div>
        </div>
        
        {/* Contact Button */}
        <a
          href={`tel:${phone.replace(/\s/g, '')}`}
          className={buttonRecipe({ variant: 'accent', size: 'lg', className: 'inline-flex text-stout-950' })}
          aria-label={`Call restaurant to enquire about private events at ${phone}`}
        >
          📞 Enquire / Book: {phone}
        </a>
      </div>
    </div>
  );
}
