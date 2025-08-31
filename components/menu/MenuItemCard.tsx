'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import type { Menu } from '@/src/lib/data/schemas';

interface MenuItemProps {
  item: Menu['sections'][0]['items'][0];
  section: string;
  searchTerm?: string;
  className?: string;
}

interface DietaryBadgeProps {
  type: 'vegetarian' | 'vegan' | 'glutenFree' | 'spicy';
  label: string;
  className?: string;
}

/**
 * Enhanced dietary badge component with proper contrast and accessibility
 * Follows slideshow-text-contrast-standard from memory
 */
function DietaryBadge({ type, label, className = '' }: DietaryBadgeProps) {
  const badgeClasses = {
    vegetarian: 'bg-indiagreen-100 text-indiagreen-800 border-indiagreen-200',
    vegan: 'bg-marigold-100 text-marigold-800 border-marigold-200',
    glutenFree: 'bg-cardamom-100 text-cardamom-800 border-cardamom-200',
    spicy: 'bg-crimson-100 text-crimson-800 border-crimson-200'
  };

  return (
    <span 
      className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-md border ${badgeClasses[type]} ${className}`}
      aria-label={`${label} dietary option`}
    >
      {label}
    </span>
  );
}

/**
 * Enhanced menu item card with image support and improved accessibility
 * Follows React hook import pattern from memory for Next.js App Router compatibility
 */
export default function MenuItemCard({ 
  item, 
  section, 
  searchTerm,
  className = '' 
}: MenuItemProps) {
  const [imageError, setImageError] = useState(false);
  // Feature flag: disable menu item images by default
  const MENU_ITEM_IMAGES_ENABLED = process.env.NEXT_PUBLIC_MENU_ITEM_IMAGES === 'true';
  
  // Format price with proper currency formatting
  const priceText = item?.price
    ? new Intl.NumberFormat('en-GB', { 
        style: 'currency', 
        currency: item.price.currency || 'GBP' 
      }).format(item.price.amount)
    : '';

  // Handle image error
  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  // Check for dietary options
  const dietary = item.dietary || {};
  const isGlutenFree = dietary.glutenFree;
  const isVegetarian = dietary.vegetarian;
  const isVegan = dietary.vegan;
  const isSpicy = dietary.spicy;

  // Extract spice level from tags (e.g., "spice-2" -> 2)
  const spiceTag = item.tags?.find(tag => tag.startsWith('spice-'));
  const spiceLevel = spiceTag ? parseInt(spiceTag.split('-')[1]) : null;

  // Generate image URL only if images are enabled
  // Prefer item.image if present in data; fallback to a dishes slug under /images/dishes (rewritten to /dishes)
  const imageUrl = (() => {
    if (!MENU_ITEM_IMAGES_ENABLED || imageError || !item?.name) return null;
    const fromData = (item as any).image as string | undefined;
    if (fromData && typeof fromData === 'string') return fromData;
    const slug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return `/images/dishes/${slug}.jpg`;
  })();

  // Highlight search terms if provided
  const highlightText = (text: string) => {
    if (!searchTerm || !text) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-accent-200 text-accent-900 px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  return (
    <article 
      className={`group bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden ${className}`}
      aria-label={`Menu item: ${item.name}`}
    >
      {/* Image Section */}
      {imageUrl && (
        <div className="relative h-32 w-full bg-neutral-100">
          <Image
            src={imageUrl}
            alt={`${item.name} - ${section} from Old Crown Girton`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
            onError={handleImageError}
          />
        </div>
      )}

      {/* Content Section */}
      <div className="p-4 space-y-3">
        {/* Header with Name and Price */}
        <div className="flex justify-between items-start gap-3">
          <h3 className="font-semibold text-brand-800 text-base leading-tight flex-1 min-w-0">
            <span className="break-words hyphens-auto" lang="en">
              {highlightText(item.name)}
            </span>
          </h3>
          {priceText && (
            <span className="text-brand-700 font-bold text-base tabular-nums flex-shrink-0 ml-2">
              {priceText}
            </span>
          )}
        </div>

        {/* Description */}
        {item.description && (
          <p className="text-sm text-brand-600 leading-relaxed">
            {highlightText(item.description)}
          </p>
        )}

        {/* Dietary Badges and Spice Level */}
        {(isGlutenFree || isVegetarian || isVegan || isSpicy || spiceLevel) && (
          <div className="flex flex-wrap gap-2" role="list" aria-label="Dietary and spice information">
            {isGlutenFree && (
              <DietaryBadge type="glutenFree" label="GF" />
            )}
            {isVegetarian && (
              <DietaryBadge type="vegetarian" label="V" />
            )}
            {isVegan && (
              <DietaryBadge type="vegan" label="VE" />
            )}
            {isSpicy && (
              <DietaryBadge type="spicy" label="🌶️" />
            )}
            {spiceLevel && (
              <span 
                className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-md border ${
                  spiceLevel === 1 ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                  spiceLevel === 2 ? 'bg-orange-100 text-orange-800 border-orange-200' :
                  spiceLevel === 3 ? 'bg-red-100 text-red-800 border-red-200' :
                  'bg-red-100 text-red-800 border-red-200'
                }`}
                aria-label={`Spice level ${spiceLevel} out of 3`}
              >
                {spiceLevel === 1 ? '🌶️' : spiceLevel === 2 ? '🌶️🌶️' : '🌶️🌶️🌶️'}
              </span>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
