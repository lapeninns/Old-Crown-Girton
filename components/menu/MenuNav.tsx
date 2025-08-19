<<<<<<< Updated upstream
import React from 'react';
=======
"use client";

import React, { useEffect, useState } from 'react';
import type { Menu } from '@/src/lib/data/schemas';
>>>>>>> Stashed changes

type Props = {
  sections: any[];
};

export default function MenuNav({ sections }: Props) {
<<<<<<< Updated upstream
=======
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

>>>>>>> Stashed changes
  return (
    <section className="py-3 bg-crown-cream/30 sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="overflow-x-auto -mx-4 px-4">
          <nav className="flex gap-3 whitespace-nowrap">
<<<<<<< Updated upstream
            {(sections || []).map((section) => (
              <a
                key={section.id || section.name}
                href={`#${((section.id || section.name || '') as string).toString().toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                className="inline-block px-3 py-2 bg-white hover:bg-crown-gold hover:text-white rounded-md text-sm text-crown-slate font-medium"
              >
                {section.name || ''}
              </a>
            ))}
=======
            {(sections || []).map((section) => {
              const id = normalizeId(section?.id || section?.name);
              const isActive = current === id;
              return (
                <a
                  key={section.id || section.name}
                  href={`#${id}`}
                  className={`inline-block px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-crown-gold text-white' : 'bg-white text-crown-slate hover:bg-crown-gold hover:text-white'}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {section.name || ''}
                </a>
              );
            })}
>>>>>>> Stashed changes
          </nav>
        </div>
      </div>
    </section>
  );
}
