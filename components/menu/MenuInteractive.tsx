"use client";

import React, { useEffect, useState } from 'react';
import type { Menu } from '@/src/lib/data/schemas';
import MenuSections from './MenuSections';

type Props = {
  sections: Menu['sections'];
  defaultSelected?: string | null;
};

function normalizeId(input?: string | number | null) {
  return ((input || '') as string).toString().toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

export default function MenuInteractive({ sections, defaultSelected }: Props) {
  const [selected, setSelected] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return window.location.hash ? window.location.hash.replace('#', '') : null;
  });
  const [previous, setPrevious] = useState<string | null>(null);

  useEffect(() => {
    function onHashChange() {
      setSelected(window.location.hash ? window.location.hash.replace('#', '') : null);
    }

    window.addEventListener('hashchange', onHashChange);
    // sync initial hash
    onHashChange();
    // Determine default selection: priority - URL hash > passed defaultSelected > 'starters' match > first section
    if (!window.location.hash && !selected) {
      const normalize = (s: any) => ((s?.id || s?.name) || '').toString().toLowerCase();
      const starterSection = (sections || []).find((s) => normalize(s).includes('starter'));
      const defaultIdFromMenu = defaultSelected
        ? defaultSelected.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-')
        : starterSection
        ? ((starterSection.id || starterSection.name) || '').toString().toLowerCase().replace(/[^a-z0-9]+/g, '-')
        : ((sections && sections[0]) ? (((sections[0].id || sections[0].name) || '').toString().toLowerCase().replace(/[^a-z0-9]+/g, '-')) : null);
      if (defaultIdFromMenu) {
        setSelected(defaultIdFromMenu);
        history.replaceState(null, '', window.location.pathname + window.location.search + `#${defaultIdFromMenu}`);
      }
    }
  return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return (
    <>
  <section className="py-3 bg-neutral/30 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="overflow-x-auto -mx-4 px-4">
            <nav className="flex gap-3 whitespace-nowrap items-center" aria-label="Menu categories">
              {/* Sticky All button */}
              <div className="flex-shrink-0 sticky left-0 z-40 pr-2 bg-transparent">
                <button
                  key="all"
                  type="button"
                  onClick={() => {
                    // clear selection to show all
                    history.replaceState(null, '', window.location.pathname + window.location.search);
                    setPrevious(selected);
                    setSelected(null);
                  }}
                  className={`inline-block px-3 py-2 rounded-md text-sm font-medium ${selected === null ? 'bg-accent text-white' : 'bg-white text-brand-700 hover:bg-accent hover:text-white'}`}
                  aria-pressed={selected === null}
                >
                  All
                </button>
              </div>
              {(sections || []).map((section) => {
                const id = normalizeId(section?.id || section?.name);
                const isActive = selected === id;
                // Determine whether the controlled section is currently present in the DOM.
                // If `selected` is null we render all sections (so controls are valid).
                // If `selected` is a specific id then only that section is rendered —
                // in that case we should only set `aria-controls` for the active button.
                const controlsPresent = selected === null || isActive;
                return (
                  <button
                    key={section.id || section.name}
                    type="button"
                    onClick={() => {
                      const newId = selected === id ? null : id;
                      // update hash to enable deep-linking and back/forward
                      if (typeof window !== 'undefined') {
                        if (newId) {
                          window.location.hash = `#${newId}`;
                        } else {
                          // clear hash without adding history entry
                          history.replaceState(null, '', window.location.pathname + window.location.search);
                          setPrevious(selected);
                          setSelected(null);
                          return;
                        }
                      }
                      // animate crossfade by keeping previous state
                      setPrevious(selected);
                      setSelected(newId);
                    }}
                    className={`inline-block px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-accent text-white' : 'bg-white text-brand-700 hover:bg-accent hover:text-white'}`}
                    aria-pressed={isActive}
                    {...(controlsPresent ? { 'aria-controls': id } : {})}
                  >
                    {section.name || ''}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </section>

      <div className="relative">
        {/* Outgoing (previous) section - fades out */}
        {previous && previous !== selected ? (
          <div className="absolute inset-x-0 top-0 pointer-events-none animate-fade-out">
            <MenuSections sections={sections} selectedId={previous} />
          </div>
        ) : null}

        {/* Incoming/current section - fades in */}
        <div className={`transition-opacity duration-300 ease-out ${previous ? 'opacity-0 animate-fade-in' : 'opacity-100'}`}>
          <MenuSections sections={sections} selectedId={selected} />
        </div>
      </div>
    </>
  );
}
