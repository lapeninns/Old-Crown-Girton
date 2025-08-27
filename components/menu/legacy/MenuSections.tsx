"use client";

import React from 'react';
import type { Menu } from '@/src/lib/data/schemas';

type Props = {
  sections: Menu['sections'];
  selectedId?: string | null; // if provided, render only this section
};

import { usePerformantMountAnimation } from '@/hooks/utils';

export default function MenuSections({ sections, selectedId }: Props) {
  // Use our performance-optimized mount animation hook
  // This prevents scroll jank during initial page load
  const isMounted = usePerformantMountAnimation();

  return (
    <>
      {(sections || []).map((section) => {
        const sectionId = ((section.id || section.name || '') as string).toString().toLowerCase().replace(/[^a-z0-9]+/g, '-');
        if (selectedId && selectedId !== sectionId) return null;
        return (
          <section key={sectionId} id={sectionId} className="py-8 bg-neutral-50" data-mounted={isMounted}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
              <div className="mb-4">
                  <h2 className="text-lg sm:text-xl font-semibold text-brand-700 inline-block border-b-2 border-accent pb-1">{section.name}</h2>
                </div>

              <ul className="divide-y">
                {(section.items || []).map((item) => {
                  const isGlutenFree = !!(item?.dietary && item.dietary.glutenFree);
                  const isVeg = !!(item?.dietary && item.dietary.vegetarian);
                  const isVegan = !!(item?.dietary && item.dietary.vegan);
                  const priceText = item?.price
                    ? new Intl.NumberFormat('en-GB', { style: 'currency', currency: item.price.currency || 'GBP' }).format(item.price.amount)
                    : '';
                  return (
                    // This is a static content list item (not interactive). Removing invalid ARIA attributes
                    // and relying on semantic markup. Prices are visually emphasized for contrast.
                    <li key={item.id || item.name} className="py-3 flex justify-between items-center gap-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className="text-sm sm:text-base text-brand-800 break-words hyphens-auto" lang="en">{item.name}</span>
                        <div className="flex items-center gap-2" aria-hidden={true}>
                          {isGlutenFree && <span className="text-xs px-1.5 py-0.5 bg-cardamom-100 text-cardamom-800 rounded">GF</span>}
                          {isVeg && <span className="text-xs px-1.5 py-0.5 bg-indiagreen-100 text-indiagreen-800 rounded">V</span>}
                          {isVegan && <span className="text-xs px-1.5 py-0.5 bg-marigold-100 text-marigold-800 rounded">VE</span>}
                        </div>
                      </div>
                      <div className="text-sm sm:text-base font-semibold text-brand-800 tabular-nums flex-shrink-0 ml-2">{priceText}</div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>
        );
      })}
    </>
  );
}
