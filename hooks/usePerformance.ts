import { useState, useEffect, useMemo, useCallback } from 'react';

/**
 * Custom hook for debounced search functionality
 * Optimizes search performance by delaying API calls/filtering
 * until user stops typing for specified delay
 */
export const useDebounceSearch = (initialValue = '', delay = 300) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [debouncedTerm, setDebouncedTerm] = useState(initialValue);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    // Set searching state when search term changes
    if (searchTerm !== debouncedTerm) {
      setIsSearching(true);
    }

    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
      setIsSearching(false);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm, delay, debouncedTerm]);

  // Memoized clear function to prevent unnecessary re-renders
  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setDebouncedTerm('');
    setIsSearching(false);
  }, []);

  // Memoized setter with performance tracking
  const setSearch = useCallback((value: string | ((prev: string) => string)) => {
    const newValue = typeof value === 'function' ? value(searchTerm) : value;
    setSearchTerm(newValue);
  }, [searchTerm]);

  // Return object with performance tracking
  return useMemo(() => ({
    searchTerm,
    debouncedTerm,
    isSearching,
    setSearchTerm: setSearch,
    clearSearch,
    hasSearchTerm: debouncedTerm.length > 0,
    searchLength: debouncedTerm.length
  }), [searchTerm, debouncedTerm, isSearching, setSearch, clearSearch]);
};

/**
 * Hook for optimized filtering with memoization
 * Prevents expensive filtering operations on every render
 */
export const useOptimizedFilter = <T>(
  items: T[],
  filterFn: (item: T, searchTerm: string, filters: any) => boolean,
  searchTerm: string,
  filters: any
) => {
  return useMemo(() => {
    if (!searchTerm && !Object.values(filters || {}).some(Boolean)) {
      return items;
    }

    return items.filter(item => filterFn(item, searchTerm, filters));
  }, [items, filterFn, searchTerm, filters]);
};

/**
 * Performance-optimized event handlers
 * Prevents unnecessary re-renders by memoizing callbacks
 */
export const useOptimizedCallbacks = <T>() => {
  const createCallback = useCallback((fn: (item: T) => void) => {
    return useCallback((item: T) => fn(item), [fn]);
  }, []);

  return { createCallback };
};
