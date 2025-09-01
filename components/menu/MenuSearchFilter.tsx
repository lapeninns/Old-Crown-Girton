'use client';

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import type { Menu } from '@/src/lib/data/schemas';

interface MenuSearchFilterProps {
  sections: Menu['sections'];
  onFilterChange: (
    filteredSections: Menu['sections'],
    searchTerm: string,
    meta?: { filters: FilterState; summary: string }
  ) => void;
  className?: string;
}

interface FilterState {
  searchTerm: string;
  dietary: {
    vegetarian: boolean;
    vegan: boolean;
    glutenFree: boolean;
    spicy: boolean;
  };
  priceRange: {
    min: number;
    max: number;
  };
}

/**
 * Enhanced search and filter component for menu items
 * Implements debounced search and accessibility features
 * Follows React hook import pattern from memory
 */
export default function MenuSearchFilter({ 
  sections, 
  onFilterChange, 
  className = '' 
}: MenuSearchFilterProps) {
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    dietary: {
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      spicy: false
    },
    priceRange: {
      min: 0,
      max: 50
    }
  });

  const [isExpanded, setIsExpanded] = useState(false);
  const [resultsCount, setResultsCount] = useState<number | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout>();

  // Calculate price range from menu data
  const priceRange = useMemo(() => {
    const prices = sections.flatMap(section => 
      section.items
        .filter(item => item.price)
        .map(item => item.price!.amount)
    );
    
    return {
      min: Math.floor(Math.min(...prices, 0)),
      max: Math.ceil(Math.max(...prices, 50))
    };
  }, [sections]);

  // Build a concise human-readable summary of applied filters
  const buildSummary = useCallback(
    (f: FilterState, base: { min: number; max: number }) => {
      const parts: string[] = [];
      if (f.searchTerm) parts.push(`“${f.searchTerm}”`);
      const d: string[] = [];
      if (f.dietary.vegetarian) d.push('Vegetarian');
      if (f.dietary.vegan) d.push('Vegan');
      if (f.dietary.glutenFree) d.push('Gluten Free');
      if (f.dietary.spicy) d.push('Spicy');
      if (d.length) parts.push(d.join(', '));
      if (f.priceRange.min > base.min || f.priceRange.max < base.max) {
        parts.push(`£${f.priceRange.min}–£${f.priceRange.max}`);
      }
      return parts.join(' • ');
    },
    []
  );

  // Sync selected filters to URL query for persistence/shareability
  const syncFiltersToUrl = useCallback((f: FilterState) => {
    try {
      const url = new URL(window.location.href);
      const q = url.searchParams;
      // Text query
      if (f.searchTerm) q.set('q', f.searchTerm); else q.delete('q');
      // Dietary flags (compact 1/0)
      f.dietary.vegetarian ? q.set('veg', '1') : q.delete('veg');
      f.dietary.vegan ? q.set('vegan', '1') : q.delete('vegan');
      f.dietary.glutenFree ? q.set('gf', '1') : q.delete('gf');
      f.dietary.spicy ? q.set('spicy', '1') : q.delete('spicy');
      // Price
      if (f.priceRange.min) q.set('min', String(f.priceRange.min)); else q.delete('min');
      if (f.priceRange.max) q.set('max', String(f.priceRange.max)); else q.delete('max');
      // Preserve hash (selected section handled by parent)
      const next = url.pathname + '?' + q.toString() + (url.hash || '');
      window.history.replaceState(null, '', next);
    } catch {}
  }, []);

  // Helper to parse number inputs without treating 0 as falsy
  const parseNumber = (value: string, fallback: number) => {
    if (value === '' || value === null || value === undefined) return fallback;
    const n = parseFloat(value);
    return Number.isNaN(n) ? fallback : n;
  };

  // Debounced filter application
  const applyFilters = useCallback((newFilters: FilterState) => {
    clearTimeout(debounceTimeoutRef.current);
    
    debounceTimeoutRef.current = setTimeout(() => {
      const filteredSections = sections.map(section => ({
        ...section,
        items: section.items.filter(item => {
          // Search term filter
          if (newFilters.searchTerm) {
            const searchLower = newFilters.searchTerm.toLowerCase();
            const nameMatch = item.name.toLowerCase().includes(searchLower);
            const descMatch = item.description?.toLowerCase().includes(searchLower);
            if (!nameMatch && !descMatch) return false;
          }

          // Dietary filters
          const dietary = item.dietary || {};
          if (newFilters.dietary.vegetarian && !dietary.vegetarian) return false;
          if (newFilters.dietary.vegan && !dietary.vegan) return false;
          if (newFilters.dietary.glutenFree && !dietary.glutenFree) return false;
          if (newFilters.dietary.spicy && !dietary.spicy) return false;

          // Price range filter
          if (item.price) {
            const price = item.price.amount;
            if (price < newFilters.priceRange.min || price > newFilters.priceRange.max) {
              return false;
            }
          }

          return true;
        })
      })).filter(section => section.items.length > 0);

      // Notify parent and update local results count for a11y/status
      onFilterChange(
        filteredSections,
        newFilters.searchTerm,
        { filters: newFilters, summary: buildSummary(newFilters, priceRange) }
      );
      try {
        const total = filteredSections.reduce((sum, s) => sum + s.items.length, 0);
        setResultsCount(total);
      } catch {
        setResultsCount(null);
      }
      // Persist to URL
      syncFiltersToUrl(newFilters);
    }, 300); // 300ms debounce
  }, [sections, onFilterChange, buildSummary, priceRange, syncFiltersToUrl]);

  // Update filters and apply
  const updateFilters = useCallback((newFilters: Partial<FilterState>) => {
    setFilters(prev => {
      const updated = { ...prev, ...newFilters };
      applyFilters(updated);
      return updated;
    });
  }, [applyFilters]);

  // Handle search input
  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value;
    updateFilters({ searchTerm });
  }, [updateFilters]);

  // Handle dietary filter changes
  const handleDietaryChange = useCallback((dietary: keyof FilterState['dietary']) => {
    updateFilters({
      dietary: {
        ...filters.dietary,
        [dietary]: !filters.dietary[dietary]
      }
    });
  }, [filters.dietary, updateFilters]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    const clearedFilters: FilterState = {
      searchTerm: '',
      dietary: {
        vegetarian: false,
        vegan: false,
        glutenFree: false,
        spicy: false
      },
      priceRange: {
        min: priceRange.min,
        max: priceRange.max
      }
    };
    setFilters(clearedFilters);
    applyFilters(clearedFilters);
    
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [priceRange, applyFilters]);

  // Initialize price range
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      priceRange: priceRange
    }));
  }, [priceRange]);

  // On first mount (and when priceRange ready), read filters from URL
  useEffect(() => {
    if (!priceRange) return;
    try {
      const url = new URL(window.location.href);
      const q = url.searchParams;
      const next: FilterState = {
        searchTerm: q.get('q') || '',
        dietary: {
          vegetarian: q.get('veg') === '1',
          vegan: q.get('vegan') === '1',
          glutenFree: q.get('gf') === '1',
          spicy: q.get('spicy') === '1',
        },
        priceRange: {
          min: parseNumber(q.get('min') || '', priceRange.min),
          max: parseNumber(q.get('max') || '', priceRange.max),
        }
      };
      // Clamp
      next.priceRange.min = Math.min(Math.max(next.priceRange.min, priceRange.min), next.priceRange.max);
      next.priceRange.max = Math.max(Math.min(next.priceRange.max, priceRange.max), next.priceRange.min);
      setFilters(next);
      // Apply immediately without waiting for typing debounce
      const filteredSections = sections.map(section => ({
        ...section,
        items: section.items.filter(item => {
          // Search
          if (next.searchTerm) {
            const s = next.searchTerm.toLowerCase();
            const nameMatch = item.name.toLowerCase().includes(s);
            const descMatch = item.description?.toLowerCase().includes(s);
            if (!nameMatch && !descMatch) return false;
          }
          const d = item.dietary || {};
          if (next.dietary.vegetarian && !d.vegetarian) return false;
          if (next.dietary.vegan && !d.vegan) return false;
          if (next.dietary.glutenFree && !d.glutenFree) return false;
          if (next.dietary.spicy && !d.spicy) return false;
          if (item.price) {
            const price = item.price.amount;
            if (price < next.priceRange.min || price > next.priceRange.max) return false;
          }
          return true;
        })
      })).filter(section => section.items.length > 0);
      onFilterChange(filteredSections, next.searchTerm, { filters: next, summary: buildSummary(next, priceRange) });
      setResultsCount(filteredSections.reduce((sum, s) => sum + s.items.length, 0));
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priceRange.min, priceRange.max]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.searchTerm) count++;
    if (Object.values(filters.dietary).some(Boolean)) count++;
    if (filters.priceRange.min > priceRange.min || filters.priceRange.max < priceRange.max) count++;
    return count;
  }, [filters, priceRange]);

  // Build active filter chips for quick removal
  const activeChips = useMemo(() => {
    const chips: Array<{ key: string; label: string; onRemove: () => void }> = [];
    if (filters.searchTerm) {
      chips.push({
        key: 'search',
        label: `“${filters.searchTerm}”`,
        onRemove: () => updateFilters({ searchTerm: '' })
      });
    }
    (Object.entries(filters.dietary) as Array<[keyof FilterState['dietary'], boolean]>).forEach(([k, v]) => {
      if (v) {
        const label = k === 'glutenFree' ? 'Gluten Free' : (k.charAt(0).toUpperCase() + k.slice(1));
        chips.push({
          key: `diet-${k}`,
          label,
          onRemove: () => handleDietaryChange(k)
        });
      }
    });
    if (filters.priceRange.min > priceRange.min || filters.priceRange.max < priceRange.max) {
      chips.push({
        key: 'price',
        label: `£${filters.priceRange.min}–£${filters.priceRange.max}`,
        onRemove: () => updateFilters({ priceRange: { min: priceRange.min, max: priceRange.max } })
      });
    }
    return chips;
  }, [filters, priceRange, updateFilters, handleDietaryChange]);

  return (
    <div className={`bg-white border border-neutral-200 rounded-lg shadow-sm ${className}`}>
      {/* Search Bar */}
      <div className="p-4 border-b border-neutral-200">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-neutral-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <input
            ref={searchInputRef}
            type="text"
            value={filters.searchTerm}
            onChange={handleSearchChange}
            className="block w-full pl-10 pr-12 py-3 border border-neutral-300 rounded-lg text-sm placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
            placeholder="Search menu items..."
            aria-label="Search menu items by name or description"
          />
          {filters.searchTerm && (
            <button
              type="button"
              onClick={() => updateFilters({ searchTerm: '' })}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600"
              aria-label="Clear search"
            >
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Active filter chips + results status */}
        {(activeChips.length > 0 || resultsCount !== null) && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {activeChips.map((chip) => (
              <button
                key={chip.key}
                type="button"
                onClick={chip.onRemove}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-accent-200 bg-accent-50 text-accent-800 text-xs hover:bg-accent-100 focus:outline-none focus:ring-2 focus:ring-accent-500"
                aria-label={`Remove filter ${chip.label}`}
              >
                <span>{chip.label}</span>
                <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            ))}
            {resultsCount !== null && (
              <span className="ml-auto text-xs text-brand-600">{resultsCount} item{resultsCount === 1 ? '' : 's'} match</span>
            )}
            {/* Screen reader live region */}
            <span className="sr-only" aria-live="polite">
              {resultsCount !== null ? `${resultsCount} items match` : ''}
            </span>
          </div>
        )}
      </div>

      {/* Filter Controls */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-sm font-medium text-brand-700 hover:text-brand-800 focus:outline-none focus:ring-2 focus:ring-accent-500 rounded"
            aria-expanded={isExpanded}
            aria-controls="filter-options"
          >
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="bg-accent-500 text-white text-xs px-2 py-1 rounded-full">
                {activeFilterCount}
              </span>
            )}
            <svg
              className={`h-4 w-4 ${isExpanded ? 'rotate-180' : ''}`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm text-accent-700 hover:text-accent-800 font-medium focus:outline-none focus:ring-2 focus:ring-accent-500 rounded"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Expanded Filter Options */}
        {isExpanded && (
          <div id="filter-options" className="mt-4 space-y-4">
            {/* Dietary Filters */}
            <div>
              <h3 className="text-sm font-medium text-brand-700 mb-2">Dietary Options</h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(filters.dietary).map(([key, value]) => (
                  <label key={key} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={() => handleDietaryChange(key as keyof FilterState['dietary'])}
                      className="rounded border-neutral-300 text-accent-600 focus:ring-accent-500"
                    />
                    <span className="text-sm text-brand-600 capitalize">
                      {key === 'glutenFree' ? 'Gluten Free' : key}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h3 className="text-sm font-medium text-brand-700 mb-2">Price Range</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="min-price" className="sr-only">Minimum price</label>
                  <input
                    id="min-price"
                    type="number"
                    step={0.5}
                    min={priceRange.min}
                    max={filters.priceRange.max}
                    value={filters.priceRange.min}
                    onChange={(e) => {
                      const raw = parseNumber(e.target.value, priceRange.min);
                      // Clamp between absolute min and current max
                      const nextMin = Math.min(Math.max(raw, priceRange.min), filters.priceRange.max);
                      updateFilters({
                        priceRange: {
                          ...filters.priceRange,
                          min: nextMin,
                        }
                      });
                    }}
                    className="w-full px-3 py-2 border border-neutral-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-accent-500"
                    placeholder="Min £"
                  />
                </div>
                <div>
                  <label htmlFor="max-price" className="sr-only">Maximum price</label>
                  <input
                    id="max-price"
                    type="number"
                    step={0.5}
                    min={filters.priceRange.min}
                    max={priceRange.max}
                    value={filters.priceRange.max}
                    onChange={(e) => {
                      const raw = parseNumber(e.target.value, priceRange.max);
                      // Clamp between current min and absolute max
                      const nextMax = Math.max(Math.min(raw, priceRange.max), filters.priceRange.min);
                      updateFilters({
                        priceRange: {
                          ...filters.priceRange,
                          max: nextMax,
                        }
                      });
                    }}
                    className="w-full px-3 py-2 border border-neutral-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-accent-500"
                    placeholder="Max £"
                  />
                </div>
              </div>

              {/* Dual-range slider for price */}
              <div className="mt-3">
                <div className="relative h-6">
                  {/* Track background */}
                  <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 rounded bg-neutral-200" />
                  {/* Selected range highlight */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 h-1 rounded bg-accent-500"
                    style={{
                      left: `${((filters.priceRange.min - priceRange.min) / (priceRange.max - priceRange.min)) * 100}%`,
                      right: `${(1 - (filters.priceRange.max - priceRange.min) / (priceRange.max - priceRange.min)) * 100}%`,
                    }}
                  />
                  {/* Min thumb */}
                  <input
                    aria-label="Minimum price slider"
                    type="range"
                    min={priceRange.min}
                    max={priceRange.max}
                    step={0.5}
                    value={filters.priceRange.min}
                    onChange={(e) => {
                      const v = parseNumber(e.target.value, filters.priceRange.min);
                      const next = Math.min(v, filters.priceRange.max);
                      updateFilters({ priceRange: { ...filters.priceRange, min: next } });
                    }}
                    className="absolute inset-0 w-full h-6 bg-transparent cursor-pointer appearance-none"
                  />
                  {/* Max thumb overlay to capture separate pointer */}
                  <input
                    aria-label="Maximum price slider"
                    type="range"
                    min={priceRange.min}
                    max={priceRange.max}
                    step={0.5}
                    value={filters.priceRange.max}
                    onChange={(e) => {
                      const v = parseNumber(e.target.value, filters.priceRange.max);
                      const next = Math.max(v, filters.priceRange.min);
                      updateFilters({ priceRange: { ...filters.priceRange, max: next } });
                    }}
                    className="absolute inset-0 w-full h-6 bg-transparent cursor-pointer appearance-none"
                    style={{ WebkitAppearance: 'none' as any }}
                  />
                </div>
                <div className="flex justify-between text-xs text-brand-600 mt-1">
                  <span>£{priceRange.min}</span>
                  <span>£{priceRange.max}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
