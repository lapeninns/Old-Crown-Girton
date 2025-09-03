"use client";

import React, { useEffect, useState, useCallback, useRef } from 'react';
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
  const [selected, setSelected] = useState<string | null>(null);
  const [previous, setPrevious] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Debounce hash changes to prevent rapid state updates
  const debouncedHashChange = useCallback(() => {
    if (isAnimating) return; // Prevent changes during animation
    const newHash = window.location.hash ? window.location.hash.replace('#', '') : null;
    if (newHash !== selected) {
      setSelected(newHash);
    }
  }, [selected, isAnimating]);

  // Hydration effect - runs only on client after mount
  useEffect(() => {
    setIsHydrated(true);
    
    // Initialize selected state from URL hash or default
    const currentHash = window.location.hash ? window.location.hash.replace('#', '') : null;
    
    if (currentHash) {
      setSelected(currentHash);
    } else {
      // Determine default selection: priority - passed defaultSelected > 'starters' match > first section
      const normalize = (s: any) => ((s?.id || s?.name) || '').toString().toLowerCase();
      const starterSection = (sections || []).find((s) => normalize(s).includes('starter'));
      const defaultIdFromMenu = defaultSelected
        ? defaultSelected.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-')
        : starterSection
        ? ((starterSection.id || starterSection.name) || '').toString().toLowerCase().replace(/[^a-z0-9]+/g, '-')
        : ((sections && sections[0]) ? (((sections[0].id || sections[0].name) || '').toString().toLowerCase().replace(/[^a-z0-9]+/g, '-')) : null);
      
      if (defaultIdFromMenu) {
        setSelected(defaultIdFromMenu);
        const safeDefaultId = String(defaultIdFromMenu).toLowerCase().replace(/[^a-z0-9]+/g, '-');
        history.replaceState(null, '', window.location.pathname + window.location.search + `#${safeDefaultId}`);
      }
    }
  }, []);

  // Hash change listener effect
  useEffect(() => {
    if (!isHydrated) return;
    
    let timeoutId: NodeJS.Timeout;
    
    function onHashChange() {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(debouncedHashChange, 50); // Debounce hash changes
    }

    window.addEventListener('hashchange', onHashChange);
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('hashchange', onHashChange);
    };
  }, [isHydrated, debouncedHashChange]);

  const handleSectionChange = useCallback((newId: string | null) => {
    if (isAnimating || newId === selected) return;
    
    setIsAnimating(true);
    setPrevious(selected);
    setSelected(newId);
    
    // Update URL
    if (typeof window !== 'undefined') {
      if (newId) {
        const safeNewId = String(newId).toLowerCase().replace(/[^a-z0-9]+/g, '-');
        window.history.replaceState(null, '', window.location.pathname + window.location.search + `#${safeNewId}`);
      } else {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    }
    
    // Reset animation state after transition
    setTimeout(() => {
      setIsAnimating(false);
      setPrevious(null);
    }, 300); // Match animation duration
  }, [selected, isAnimating]);

  return (
    <div className="scroll-manual">
      <section className="py-3 bg-neutral/30 sticky top-0 z-30 backdrop-blur-sm sticky-optimized">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="overflow-x-auto -mx-4 px-4 scrollbar-hide">
            <nav className="flex gap-3 whitespace-nowrap items-center" aria-label="Menu categories">
              {/* Sticky All button */}
              <div className="flex-shrink-0 sticky left-0 z-40 pr-2 bg-neutral/30 backdrop-blur-sm">
                <button
                  key="all"
                  type="button"
                  onClick={() => handleSectionChange(null)}
                  disabled={isAnimating}
                  className={`inline-block px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    selected === null ? 'bg-accent text-white' : 'bg-neutral-50 text-brand-700 hover:bg-accent hover:text-white'
                  } ${isAnimating ? 'opacity-70 cursor-not-allowed' : ''}`}
                  aria-pressed={selected === null}
                >
                  All
                </button>
              </div>
              {(sections || []).map((section) => {
                const idSeed = normalizeId(section?.id || section?.name);
                const id = idSeed;
                const isActive = selected === id;
                const controlsId = (selected === null || selected === id || previous === id) ? id : undefined;
                
                return (
                  <button
                    key={section.id || section.name}
                    type="button"
                    onClick={() => handleSectionChange(isActive ? null : id)}
                    disabled={isAnimating}
                    className={`inline-block px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      isActive ? 'bg-accent text-white' : 'bg-neutral-50 text-brand-700 hover:bg-accent hover:text-white'
                    } ${isAnimating ? 'opacity-70 cursor-not-allowed' : ''}`}
                    aria-pressed={isActive}
                    aria-controls={controlsId}
                  >
                    {section.name || ''}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </section>

      <div className="relative min-h-[400px]" ref={contentRef}>
        {/* Current section with improved transitions */}
        <div 
          className={`transition-all duration-300 ease-out scroll-optimized ${
            isAnimating ? 'opacity-0 transform translate-y-2' : 'opacity-100 transform translate-y-0'
          }`}
          style={{
            // Remove absolute positioning that interferes with scroll
            position: 'relative',
            willChange: isAnimating ? 'opacity, transform' : 'auto',
          }}
        >
          <MenuSections sections={sections} selectedId={selected} />
        </div>
      </div>
    </div>
  );
}
