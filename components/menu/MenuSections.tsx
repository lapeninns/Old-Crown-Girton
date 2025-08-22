"use client";

import React from 'react';
import type { Menu } from '@/src/lib/data/schemas';

type Props = {
  sections: Menu['sections'];
  selectedId?: string | null; // if provided, render only this section
};

import { useEffect, useRef } from 'react';

export default function MenuSections({ sections, selectedId }: Props) {
  // Simple mount animation: add a data-mounted attribute to trigger CSS
  const firstRenderRef = useRef(true);

  useEffect(() => {
    firstRenderRef.current = false;
  }, []);

  return (
    <>
      {(sections || []).map((section) => {
        const sectionId = ((section.id || section.name || '') as string).toString().toLowerCase().replace(/[^a-z0-9]+/g, '-');
        if (selectedId && selectedId !== sectionId) return null;
        return (
          <section key={sectionId} id={sectionId} className="py-8 bg-white" data-mounted={!firstRenderRef.current}>
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
                    <li key={item.id || item.name} className="py-3 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <span className="text-sm sm:text-base text-stout-700">{item.name}</span>
                        <div className="flex items-center gap-2" aria-hidden={true}>
                          {isGlutenFree && <span className="text-xs px-1.5 py-0.5 bg-green-100 text-green-800 rounded">GF</span>}
                          {isVeg && <span className="text-xs px-1.5 py-0.5 bg-yellow-100 text-yellow-800 rounded">V</span>}
                          {isVegan && <span className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-800 rounded">VE</span>}
                        </div>
                      </div>
                      <div className="text-sm sm:text-base font-semibold text-accent tabular-nums">{priceText}</div>
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
