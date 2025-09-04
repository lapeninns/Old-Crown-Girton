'use client';

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import type { Menu } from '@/src/lib/data/schemas';

// Dynamic imports for sub-components with loading fallbacks
const MenuSearchInput = dynamic(() => import('./MenuSearchInput'), {
  loading: () => (
    <div className="relative">
      <div className="h-12 bg-neutral-100 rounded-lg animate-pulse"></div>
    </div>
  )
});

const MenuFilterChips = dynamic(() => import('./MenuFilterChips'), {
  loading: () => <div className="h-6 bg-neutral-100 rounded animate-pulse"></div>
});

const MenuDietaryFilters = dynamic(() => import('./MenuDietaryFilters'), {
  loading: () => (
    <div>
      <div className="h-4 bg-neutral-200 rounded w-24 mb-2"></div>
      <div className="grid grid-cols-2 gap-2">
        {[1,2,3,4].map(i => (
          <div key={i} className="h-6 bg-neutral-100 rounded animate-pulse"></div>
        ))}
      </div>
    </div>
  )
});

const MenuPriceFilter = dynamic(() => import('./MenuPriceFilter'), {
  loading: () => (
    <div>
      <div className="h-4 bg-neutral-200 rounded w-20 mb-2"></div>
      <div className="h-20 bg-neutral-100 rounded animate-pulse"></div>
    </div>
  )
});

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
 * Optimized menu search and filter component
 * Split into smaller components for better code splitting and performance
 */
export default function OptimizedMenuSearchFilter({ 
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
  const debounceTimeoutRef = useRef<NodeJS.Timeout>();

  // Calculate price range from menu data (memoized for performance)
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

  // Build filter summary (memoized)
  const buildSummary = useCallback((f: FilterState, base: { min: number; max: number }) => {
    const parts: string[] = [];
    if (f.searchTerm) parts.push(`"${f.searchTerm}"`);
    
    const dietary: string[] = [];
    if (f.dietary.vegetarian) dietary.push('Vegetarian');
    if (f.dietary.vegan) dietary.push('Vegan');
    if (f.dietary.glutenFree) dietary.push('Gluten Free');
    if (f.dietary.spicy) dietary.push('Spicy');
    if (dietary.length) parts.push(dietary.join(', '));
    
    if (f.priceRange.min > base.min || f.priceRange.max < base.max) {
      parts.push(`£${f.priceRange.min}–£${f.priceRange.max}`);
    }
    
    return parts.join(' • ');
  }, []);

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

      const total = filteredSections.reduce((sum, s) => sum + s.items.length, 0);
      setResultsCount(total);

      onFilterChange(
        filteredSections,
        newFilters.searchTerm,
        { filters: newFilters, summary: buildSummary(newFilters, priceRange) }
      );
    }, 300);
  }, [sections, onFilterChange, buildSummary, priceRange]);

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<FilterState>) => {
    setFilters(prev => {
      const updated = { ...prev, ...newFilters };
      applyFilters(updated);
      return updated;
    });
  }, [applyFilters]);

  // Handlers
  const handleSearchChange = useCallback((searchTerm: string) => {
    updateFilters({ searchTerm });
  }, [updateFilters]);

  const handleSearchClear = useCallback(() => {
    updateFilters({ searchTerm: '' });
  }, [updateFilters]);

  const handleDietaryChange = useCallback((dietary: keyof FilterState['dietary']) => {
    updateFilters({
      dietary: {
        ...filters.dietary,
        [dietary]: !filters.dietary[dietary]
      }
    });
  }, [filters.dietary, updateFilters]);

  const handlePriceRangeChange = useCallback((priceRange: FilterState['priceRange']) => {
    updateFilters({ priceRange });
  }, [updateFilters]);

  const clearFilters = useCallback(() => {
    const clearedFilters: FilterState = {
      searchTerm: '',
      dietary: {
        vegetarian: false,
        vegan: false,
        glutenFree: false,
        spicy: false
      },
      priceRange: priceRange
    };
    setFilters(clearedFilters);
    applyFilters(clearedFilters);
  }, [priceRange, applyFilters]);

  // Initialize price range when available
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      priceRange: priceRange
    }));
  }, [priceRange]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.searchTerm) count++;
    if (Object.values(filters.dietary).some(Boolean)) count++;
    if (filters.priceRange.min > priceRange.min || filters.priceRange.max < priceRange.max) count++;
    return count;
  }, [filters, priceRange]);

  // Build active filter chips
  const activeChips = useMemo(() => {
    const chips: Array<{ key: string; label: string; onRemove: () => void }> = [];
    
    if (filters.searchTerm) {
      chips.push({
        key: 'search',
        label: `"${filters.searchTerm}"`,
        onRemove: () => updateFilters({ searchTerm: '' })
      });
    }
    
    Object.entries(filters.dietary).forEach(([k, v]) => {
      if (v) {
        const label = k === 'glutenFree' ? 'Gluten Free' : (k.charAt(0).toUpperCase() + k.slice(1));
        chips.push({
          key: `diet-${k}`,
          label,
          onRemove: () => handleDietaryChange(k as keyof FilterState['dietary'])
        });
      }
    });
    
    if (filters.priceRange.min > priceRange.min || filters.priceRange.max < priceRange.max) {
      chips.push({
        key: 'price',
        label: `£${filters.priceRange.min}–£${filters.priceRange.max}`,
        onRemove: () => updateFilters({ priceRange: priceRange })
      });
    }
    
    return chips;
  }, [filters, priceRange, updateFilters, handleDietaryChange]);

  return (
    <div className={`bg-white border border-neutral-200 rounded-lg shadow-sm ${className}`}>
      {/* Search Bar */}
      <div className="p-4 border-b border-neutral-200">
        <MenuSearchInput
          value={filters.searchTerm}
          onChange={handleSearchChange}
          onClear={handleSearchClear}
        />

        <MenuFilterChips 
          chips={activeChips}
          resultsCount={resultsCount}
        />
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
              className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
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
            <MenuDietaryFilters
              options={filters.dietary}
              onChange={handleDietaryChange}
            />

            <MenuPriceFilter
              value={filters.priceRange}
              range={priceRange}
              onChange={handlePriceRangeChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}