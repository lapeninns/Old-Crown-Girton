'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Menu } from '@/src/lib/data/schemas';
import MenuSearchFilter from '@/components/menu/MenuSearchFilter';
import MenuSections from '@/components/menu/MenuSections';

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
 * Enhanced with improved sticky navigation for all responsive devices
 */
export default function MenuInteractive({ sections, defaultSelected, preloadedData = false }: Props) {
  const [selected, setSelected] = useState<string | null>(defaultSelected ?? null);
  const [isHydrated, setIsHydrated] = useState(preloadedData); // Start hydrated if data is preloaded
  const [filteredSections, setFilteredSections] = useState<Menu['sections']>(sections);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSummary, setFilterSummary] = useState<string>('');
  const [showSearch, setShowSearch] = useState(false);
  const [navbarHeight, setNavbarHeight] = useState(64); // Default to 64px
  const contentRef = useRef<HTMLDivElement>(null);

  // Debounce hash changes to prevent rapid state updates - maintaining existing pattern
  const debouncedHashChange = useCallback(() => {
    const newHash = window.location.hash ? window.location.hash.replace('#', '') : null;
    if (newHash !== selected) {
      setSelected(newHash);
    }
  }, [selected]);

  // Detect actual navbar height for accurate sticky positioning
  useEffect(() => {
    const detectNavbarHeight = () => {
      // Try to find the navbar element
      const navbar = document.querySelector('nav[class*="sticky"]') || 
                     document.querySelector('header nav') || 
                     document.querySelector('nav') ||
                     document.querySelector('header');
      
      if (navbar) {
        const rect = navbar.getBoundingClientRect();
        const height = rect.height;
        // Use detected height, but ensure it's reasonable (between 40-120px)
        if (height >= 40 && height <= 120) {
          setNavbarHeight(height);
        } else {
          // Fallback to standard height based on screen size
          setNavbarHeight(window.innerWidth < 768 ? 56 : 64);
        }
      } else {
        // Fallback if no navbar found
        setNavbarHeight(window.innerWidth < 768 ? 56 : 64);
      }
    };

    // Initial detection with a small delay to ensure DOM is ready
    const timeoutId = setTimeout(detectNavbarHeight, 100);
    
    // Re-detect on resize for responsive navbar changes
    const handleResize = () => {
      setTimeout(detectNavbarHeight, 150); // Slightly longer delay on resize
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Optimized hydration effect for preloaded data
  useEffect(() => {
    const hash = typeof window !== 'undefined' && window.location.hash
      ? window.location.hash.replace('#', '')
      : null;

    const target = hash || defaultSelected || null;

    setIsHydrated(true);

    if (target !== selected) {
      setSelected(target);
      if (typeof window !== 'undefined' && target) {
        window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#${target}`);
      }
    }
  }, [sections, preloadedData, defaultSelected, selected]);

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
    if (newId === selected) return;
    setSelected(newId);
    if (typeof window !== 'undefined') {
      if (newId) {
        const safeNewId = String(newId).toLowerCase().replace(/[^a-z0-9]+/g, '-');
        window.history.replaceState(null, '', window.location.pathname + window.location.search + `#${safeNewId}`);
      } else {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    }
  }, [selected]);

  // Handle filter changes from search component
  const handleFilterChange = useCallback((newFilteredSections: Menu['sections'], newSearchTerm: string, meta?: { summary?: string }) => {
    setFilteredSections(newFilteredSections);
    setSearchTerm(newSearchTerm);
    if (meta?.summary !== undefined) setFilterSummary(meta.summary);
    
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
      {/* Enhanced Navigation Bar with dynamic positioning */}
      <section 
        className="py-2 sm:py-3 bg-white/95 border-b border-neutral-200/50 sticky z-30 backdrop-blur-md shadow-sm"
        style={{ 
          top: `${navbarHeight}px`,
        }}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          {/* Search Toggle and Navigation */}
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <button
              type="button"
              onClick={toggleSearch}
              className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium text-sm sm:text-base ${
                showSearch 
                  ? 'bg-accent text-white shadow-md' 
                  : 'bg-white text-brand-700 border border-neutral-300 shadow-sm'
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
                className="text-sm text-accent-700 font-medium px-3 py-1 rounded border border-accent-300"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Section Navigation with improved mobile support */}
          <div className="overflow-x-auto -mx-3 sm:-mx-4 px-3 sm:px-4 scrollbar-hide">
            <nav className="flex gap-2 sm:gap-3 whitespace-nowrap items-center pb-1" aria-label="Menu categories">
              {/* Section buttons with enhanced responsive design */}
              {sections.map((section) => {
                const idSeed = normalizeId(section?.id || section?.name);
                const isActive = selected === idSeed;
                const sectionItemCount = displaySections.find(s => normalizeId(s?.id || s?.name) === idSeed)?.items.length || 0;
                
                return (
                <button
                  key={section.id || section.name}
                  type="button"
                  onClick={() => handleSectionChange(isActive ? null : idSeed)}
                  disabled={sectionItemCount === 0}
                    className={`inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium ${
                      isActive 
                        ? 'bg-accent text-white shadow-sm' 
                        : sectionItemCount > 0
                          ? 'bg-neutral-50 text-brand-700'
                          : 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
                    }`}
                  aria-pressed={isActive}
                  title={sectionItemCount === 0 ? 'No items in this section match current filters' : undefined}
                >
                    <span className="truncate max-w-[80px] sm:max-w-none">{section.name}</span>
                    <span className="text-xs bg-white bg-opacity-20 px-1 sm:px-1.5 py-0.5 rounded-full flex-shrink-0">
                      {sectionItemCount}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>
          {/* Applied filters summary row (visible when search panel collapsed) */}
          {!showSearch && (searchTerm || filteredSections.length !== sections.length) && (
            <div className="mt-2 text-xs text-brand-700">
              <span className="font-semibold">Applied:</span>{' '}
              <span className="text-brand-600">{filterSummary || 'filters active'}</span>
            </div>
          )}
        </div>
      </section>

      {/* Search Panel with improved positioning */}
      {showSearch && (
        <div 
          id="search-panel" 
          className="bg-neutral-50 border-b border-neutral-200 py-3 sm:py-4 sticky"
          style={{
            top: `${navbarHeight + 60}px`, // Account for navbar + menu nav estimated height
            zIndex: 25,
          }}
        >
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
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
        <div style={{ position: 'relative' }}>
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
