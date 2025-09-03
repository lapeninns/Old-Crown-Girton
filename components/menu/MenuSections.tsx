'use client';

import { useCallback } from 'react';
import type { Menu } from '@/src/lib/data/schemas';
import MenuItemCard from './MenuItemCard';

type Props = {
  sections: Menu['sections'];
  selectedId?: string | null;
  searchTerm?: string;
  className?: string;
};

/**
 * MenuSections component with card layout and improved accessibility
 * Maintains performance optimizations from the original while adding new features
 * Follows scroll-performance-conflict-resolution from memory
 */
export default function MenuSections({ 
  sections, 
  selectedId, 
  searchTerm = '',
  className = '' 
}: Props) {

  // Filter sections based on selectedId
  const displaySections = selectedId 
    ? sections.filter(section => {
        const sectionId = ((section.id || section.name || '') as string)
          .toString()
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-');
        return sectionId === selectedId;
      })
    : sections; // Show all sections when selectedId is null/undefined

  // Early return if no sections to display
  if (!displaySections || displaySections.length === 0) {
    return (
      <div className="py-16 text-center">
        <div className="max-w-md mx-auto">
          <svg
            className="mx-auto h-12 w-12 text-neutral-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-neutral-900">No menu items found</h3>
          <p className="mt-2 text-sm text-neutral-500">
            {searchTerm 
              ? `No items match your search for "${searchTerm}"`
              : 'No menu items are currently available'
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`space-y-12 ${className}`}>
        {displaySections.map((section) => {
          const sectionId = ((section.id || section.name || '') as string)
            .toString()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-');

          // Skip sections with no items
          if (!section.items || section.items.length === 0) {
            return null;
          }

          return (
            <section 
              key={sectionId} 
              id={sectionId} 
              className="scroll-optimized" 
              aria-labelledby={`section-${sectionId}-title`}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="mb-8 text-center">
                  <h2 
                    id={`section-${sectionId}-title`}
                    className="text-2xl md:text-3xl font-display font-bold text-brand-700 mb-2"
                  >
                    {section.name}
                  </h2>
                  {section.description && (
                    <p className="text-lg text-brand-600 max-w-2xl mx-auto">
                      {section.description}
                    </p>
                  )}
                  <div className="mt-4 flex items-center justify-center">
                    <div className="h-1 w-16 bg-accent-500 rounded-full"></div>
                  </div>
                </div>

                {/* Items Grid */}
                <div 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  role="list"
                  aria-label={`${section.name} menu items`}
                >
                  {section.items.map((item) => (
                    <div key={item.id || item.name} role="listitem">
                      <MenuItemCard
                        item={item}
                        section={sectionId}
                        searchTerm={searchTerm}
                        className="h-full"
                      />
                    </div>
                  ))}
                </div>

                {/* Section Stats */}
                <div className="mt-6 text-center text-sm text-neutral-500">
                  {section.items.length} item{section.items.length !== 1 ? 's' : ''} in {section.name}
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
