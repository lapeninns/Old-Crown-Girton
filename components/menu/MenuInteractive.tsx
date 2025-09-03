'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Menu } from '@/src/lib/data/schemas';
import MenuSearchFilter from './MenuSearchFilter';
import MenuSections from './MenuSections';

type Props = {
  sections: Menu['sections'];
  defaultSelected?: string | null;
  preloadedData?: boolean; // Indicates data is pre-optimized server-side
};

function normalizeId(input?: string | number | null) {
  return ((input || '') as string).toString().toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

/**
 * MenuInteractive component with search, filtering, and optimized performance
 * Now supports server-side preloaded data for faster initial rendering
 * Maintains backward compatibility with existing functionality
 */
export default function MenuInteractive({ sections, defaultSelected, preloadedData = false }: Props) {
  const [selected, setSelected] = useState<string | null>(defaultSelected || null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHydrated, setIsHydrated] = useState(preloadedData); // Start hydrated if data is preloaded
  const [filteredSections, setFilteredSections] = useState<Menu['sections']>(sections);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Debounce hash changes to prevent rapid state updates - maintaining existing pattern
  const debouncedHashChange = useCallback(() => {
    if (isAnimating) return;
    const newHash = window.location.hash ? window.location.hash.replace('#', '') : null;
    if (newHash !== selected) {
      setSelected(newHash);
    }
  }, [selected, isAnimating]);

  // Optimized hydration effect for preloaded data
  useEffect(() => {
    if (preloadedData) {
      // Data is already optimized server-side, skip client-side processing
      setIsHydrated(true);
      
      // Use defaultSelected if provided, or current hash
      const currentHash = typeof window !== 'undefined' && window.location.hash 
        ? window.location.hash.replace('#', '') 
        : null;
      
      const targetSelected = currentHash || defaultSelected;
      
      if (targetSelected && targetSelected !== selected) {
        setSelected(targetSelected);
        if (typeof window !== 'undefined' && !currentHash) {
          const safeTarget = String(targetSelected).toLowerCase().replace(/[^a-z0-9]+/g, '-');
          history.replaceState(null, '', window.location.pathname + window.location.search + `#${safeTarget}`);
        }
      }
      return;
    }
    
    // Legacy hydration logic for non-preloaded data
    setIsHydrated(true);
    
    // Initialize selected state from URL hash or default
    const currentHash = window.location.hash ? window.location.hash.replace('#', '') : null;
    
    if (currentHash) {
      setSelected(currentHash);
    } else {
      // Use existing default selection logic
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
  }, [sections, defaultSelected, preloadedData, selected]);

  // Hash change listener - maintains existing pattern
  useEffect(() => {
    if (!isHydrated) return;
    
    let timeoutId: NodeJS.Timeout;
    
    function onHashChange() {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(debouncedHashChange, 50);
    }

    window.addEventListener('hashchange', onHashChange);
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('hashchange', onHashChange);
    };
  }, [isHydrated, debouncedHashChange]);

  // Handle section changes - maintains existing pattern
  const handleSectionChange = useCallback((newId: string | null) => {
    if (isAnimating || newId === selected) return;
    
    setIsAnimating(true);
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
    
    // Reset animation state
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  }, [selected, isAnimating]);

  // Handle filter changes from search component
  const handleFilterChange = useCallback((newFilteredSections: Menu['sections'], newSearchTerm: string) => {
    setFilteredSections(newFilteredSections);
    setSearchTerm(newSearchTerm);
    
    // If searching/filtering, clear section selection to show all results
    if (newSearchTerm || newFilteredSections.length !== sections.length) {
      if (selected) {
        handleSectionChange(null);
      }
    }
  }, [sections.length, selected, handleSectionChange]);

  // Toggle search panel
  const toggleSearch = useCallback(() => {
    setShowSearch(prev => !prev);
  }, []);

  // Clear search and filters
  const clearSearchAndFilters = useCallback(() => {
    setFilteredSections(sections);
    setSearchTerm('');
    setShowSearch(false);
  }, [sections]);

  // Determine which sections to display
  const displaySections = searchTerm || filteredSections.length !== sections.length 
    ? filteredSections 
    : sections;

  return (
    <div className="scroll-manual">
      {/* Enhanced Navigation Bar */}
      <section className="py-3 bg-neutral/30 sticky top-0 z-30 backdrop-blur-sm sticky-optimized">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Search Toggle and Navigation */}
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={toggleSearch}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                showSearch 
                  ? 'bg-accent text-white shadow-md' 
                  : 'bg-white text-brand-700 hover:bg-accent hover:text-white border border-neutral-300'
              }`}
              aria-expanded={showSearch}
              aria-controls="search-panel"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="hidden sm:inline">
                {showSearch ? 'Hide Search' : 'Search & Filter'}
              </span>
              {(searchTerm || filteredSections.length !== sections.length) && (
                <span className="bg-white bg-opacity-20 text-xs px-2 py-1 rounded-full">
                  Active
                </span>
              )}
            </button>

            {/* Clear filters button */}
            {(searchTerm || filteredSections.length !== sections.length) && (
              <button
                type="button"
                onClick={clearSearchAndFilters}
                className="text-sm text-accent-700 hover:text-accent-800 font-medium px-3 py-1 rounded border border-accent-300 hover:bg-accent-50 transition-colors"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Section Navigation */}
          <div className="overflow-x-auto -mx-4 px-4 scrollbar-hide">
            <nav className="flex gap-3 whitespace-nowrap items-center" aria-label="Menu categories">
              {/* All sections button */}
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
                  All ({displaySections.reduce((total, section) => total + section.items.length, 0)})
                </button>
              </div>

              {/* Section buttons */}
              {sections.map((section) => {
                const idSeed = normalizeId(section?.id || section?.name);
                const isActive = selected === idSeed;
                const sectionItemCount = displaySections.find(s => normalizeId(s?.id || s?.name) === idSeed)?.items.length || 0;
                
                return (
                  <button
                    key={section.id || section.name}
                    type="button"
                    onClick={() => handleSectionChange(isActive ? null : idSeed)}
                    disabled={isAnimating || sectionItemCount === 0}
                    className={`inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      isActive 
                        ? 'bg-accent text-white' 
                        : sectionItemCount > 0
                          ? 'bg-neutral-50 text-brand-700 hover:bg-accent hover:text-white'
                          : 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
                    } ${isAnimating ? 'opacity-70 cursor-not-allowed' : ''}`}
                    aria-pressed={isActive}
                    title={sectionItemCount === 0 ? 'No items in this section match current filters' : undefined}
                  >
                    <span>{section.name}</span>
                    <span className="text-xs bg-white bg-opacity-20 px-1.5 py-0.5 rounded-full">
                      {sectionItemCount}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </section>

      {/* Search Panel */}
      {showSearch && (
        <div id="search-panel" className="bg-neutral-50 border-b border-neutral-200 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <MenuSearchFilter
              sections={sections}
              onFilterChange={handleFilterChange}
              className="w-full"
            />
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="relative min-h-[400px]" ref={contentRef}>
        <div 
          className={`transition-all duration-300 ease-out scroll-optimized ${
            isAnimating ? 'opacity-0 transform translate-y-2' : 'opacity-100 transform translate-y-0'
          }`}
          style={{
            position: 'relative',
            willChange: isAnimating ? 'opacity, transform' : 'auto',
          }}
        >
          <div className="py-8">
            <MenuSections 
              sections={displaySections} 
              selectedId={selected}
              searchTerm={searchTerm}
            />
          </div>
        </div>
      </div>

      {/* Results Summary */}
      {(searchTerm || filteredSections.length !== sections.length) && (
        <div className="bg-neutral-100 border-t border-neutral-200 py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <p className="text-sm text-neutral-600">
              Showing {displaySections.reduce((total, section) => total + section.items.length, 0)} items
              {searchTerm && ` matching "${searchTerm}"`}
              {filteredSections.length !== sections.length && ` with applied filters`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}