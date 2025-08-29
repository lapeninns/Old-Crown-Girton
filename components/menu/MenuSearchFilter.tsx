'use client';

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import type { Menu } from '@/src/lib/data/schemas';

interface MenuSearchFilterProps {
  sections: Menu['sections'];
  onFilterChange: (filteredSections: Menu['sections'], searchTerm: string) => void;
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

      onFilterChange(filteredSections, newFilters.searchTerm);
    }, 300); // 300ms debounce
  }, [sections, onFilterChange]);

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

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.searchTerm) count++;
    if (Object.values(filters.dietary).some(Boolean)) count++;
    if (filters.priceRange.min > priceRange.min || filters.priceRange.max < priceRange.max) count++;
    return count;
  }, [filters, priceRange]);

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
                    min={priceRange.min}
                    max={filters.priceRange.max}
                    value={filters.priceRange.min}
                    onChange={(e) => updateFilters({
                      priceRange: {
                        ...filters.priceRange,
                        min: parseFloat(e.target.value) || priceRange.min
                      }
                    })}
                    className="w-full px-3 py-2 border border-neutral-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-accent-500"
                    placeholder="Min £"
                  />
                </div>
                <div>
                  <label htmlFor="max-price" className="sr-only">Maximum price</label>
                  <input
                    id="max-price"
                    type="number"
                    min={filters.priceRange.min}
                    max={priceRange.max}
                    value={filters.priceRange.max}
                    onChange={(e) => updateFilters({
                      priceRange: {
                        ...filters.priceRange,
                        max: parseFloat(e.target.value) || priceRange.max
                      }
                    })}
                    className="w-full px-3 py-2 border border-neutral-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-accent-500"
                    placeholder="Max £"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
