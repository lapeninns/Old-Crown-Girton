'use client';

/**
 * Props interfaces for ContactFeaturesSection component
 */
interface FeatureItem {
  icon?: string;
  text?: string;
}

interface ContactFeaturesSectionProps {
  title: string;
  items: FeatureItem[];
  className?: string;
}

/**
 * ContactFeaturesSection Component
 * 
 * Displays restaurant features in a grid layout with icons.
 * Extracted from Contact page for better modularity and reusability.
 * 
 * Features:
 * - Responsive 2-column grid layout
 * - Icon and text combination for each feature
 * - Framer Motion stagger animations
 * - Hover effects for interactive feel
 * - Semantic HTML structure
 * - Design system styling with proper spacing
 */
export default function ContactFeaturesSection({ 
  title, 
  items, 
  className = '' 
}: ContactFeaturesSectionProps) {
  if (!title || !items || items.length === 0) {
    return null;
  }

  return (
    <div className={`bg-neutral-50 p-6 rounded-xl shadow-lg ${className}`}>
      <h2 className="text-xl font-display font-bold text-brand-700 mb-4">
        {title}
      </h2>
      
      <div className="grid grid-cols-2 gap-3 text-sm">
        {items.map((feature: FeatureItem, index: number) => {
          if (!feature.icon || !feature.text) {
            return null;
          }
          
          return (
            <div key={index} className="flex items-center gap-2 p-2 rounded-md cursor-default">
              <span className="text-lg flex-shrink-0" aria-hidden="true">
                {feature.icon}
              </span>
              <span className="text-foreground font-medium">
                {feature.text}
              </span>
            </div>
          );
        }).filter(Boolean)}
      </div>
    </div>
  );
}
