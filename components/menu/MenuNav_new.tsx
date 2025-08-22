"use client";

import React, { useEffect, useState } from 'react';
import type { Menu } from '@/src/lib/data/schemas';

type Props = {
  sections: any[];
};

// Helper function to normalize section IDs
function normalizeId(input?: string): string {
  return (input || '').toString().toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

export default function MenuNav({ sections }: Props) {
  const [current, setCurrent] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return window.location.hash ? window.location.hash.replace('#', '') : null;
  });

  useEffect(() => {
    function onHash() {
      setCurrent(window.location.hash ? window.location.hash.replace('#', '') : null);
    }
    window.addEventListener('hashchange', onHash);
    // ensure initial state in case hash changed before mount
    onHash();
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  return (
    <section className="py-3 bg-neutral-100/30 sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="overflow-x-auto -mx-4 px-4">
          <nav className="flex gap-3 whitespace-nowrap">
            {(sections || []).map((section) => {
              const id = normalizeId(section?.id || section?.name);
              const isActive = current === id;
              return (
                <a
                  key={section.id || section.name}
                  href={`#${id}`}
                  className={`inline-block px-3 py-2 rounded-md text-sm font-medium ${
                    isActive 
                      ? 'bg-accent text-neutral-50' 
                      : 'bg-neutral-50 text-brand-700 hover:bg-accent hover:text-neutral-50'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {section.name || ''}
                </a>
              );
            })}
          </nav>
        </div>
      </div>
    </section>
  );
}