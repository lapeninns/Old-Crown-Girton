"use client";

/**
 * Restaurant Query Hook (Refactored)
 * 
 * Follows SOLID Principles:
 * - SRP: Only handles data fetching orchestration, business logic extracted
 * - DIP: Depends on IRestaurantService abstraction via useService hook
 * - ISP: Returns focused result interface, specialized hooks for specific needs
 * 
 * @module hooks/queries/useRestaurantQuery
 */

import useSWR, { type SWRConfiguration } from 'swr';
import { useMemo, useCallback } from 'react';
import type { Restaurant } from '@/src/lib/data/schemas';
import { useService } from '@/services/providers/ServiceProvider';
import type { RestaurantStatus, RestaurantContact, RestaurantAddress } from '@/services/interfaces/IRestaurantService';

// ============================================
// ISP: Segregated Result Interfaces
// ============================================

/**
 * Base result for all restaurant hooks.
 * Contains common loading/error state.
 */
export interface BaseQueryResult {
    isLoading: boolean;
    isValidating: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}

/**
 * Full restaurant data result.
 * For consumers that need complete restaurant information.
 */
export interface UseRestaurantDataResult extends BaseQueryResult {
    data: Restaurant | null;
    mutate: (data?: Restaurant | Promise<Restaurant>, shouldRevalidate?: boolean) => Promise<Restaurant | undefined>;
}

/**
 * Restaurant status result.
 * For consumers that only need open/closed status.
 * Following ISP: Focused interface without unnecessary data.
 */
export interface UseRestaurantStatusResult extends BaseQueryResult {
    isOpen: boolean;
    currentHours: string | null;
    nextOpenTime: string | null;
}

/**
 * Restaurant contact result.
 * For consumers that only need contact information.
 */
export interface UseRestaurantContactResult extends BaseQueryResult {
    phone: string | undefined;
    email: string | undefined;
    address: RestaurantAddress | undefined;
}

/**
 * Combined result for backward compatibility.
 * @deprecated Use specialized hooks instead for better ISP adherence.
 */
export interface UseRestaurantResult extends UseRestaurantDataResult, UseRestaurantStatusResult {
    // Combined interface for migration compatibility
}

// ============================================
// Hook Options
// ============================================

/**
 * Options for restaurant hooks.
 */
export interface UseRestaurantOptions extends SWRConfiguration<Restaurant, Error> {
    /** Whether to enable the query */
    enabled?: boolean;
    /** Refresh interval in ms (default: 30 minutes) */
    refreshInterval?: number;
    /** Cache timeout in ms (default: 1 hour) */
    cacheTimeout?: number;
}

const DEFAULT_OPTIONS: Required<Pick<UseRestaurantOptions, 'enabled' | 'refreshInterval' | 'cacheTimeout'>> = {
    enabled: true,
    refreshInterval: 1800000, // 30 minutes
    cacheTimeout: 3600000,   // 1 hour
};

// ============================================
// Core Hook: Data Fetching
// ============================================

/**
 * Internal fetcher key generator.
 * Using a stable key for SWR caching.
 */
const RESTAURANT_KEY = 'restaurant';

/**
 * Core hook for fetching restaurant data.
 * Uses the service abstraction for data fetching.
 * 
 * @param options - SWR configuration options
 * @returns Restaurant data with loading/error states
 */
export function useRestaurantData(
    options: UseRestaurantOptions = {}
): UseRestaurantDataResult {
    const {
        enabled = DEFAULT_OPTIONS.enabled,
        refreshInterval = DEFAULT_OPTIONS.refreshInterval,
        cacheTimeout = DEFAULT_OPTIONS.cacheTimeout,
        ...swrOptions
    } = options;

    // Get service from context (DIP)
    let restaurantService: ReturnType<typeof useService<'restaurant'>> | null = null;

    try {
        restaurantService = useService('restaurant');
    } catch {
        // Service not available - will use fallback fetcher
    }

    // Fetcher function using service
    const fetcher = useCallback(async (): Promise<Restaurant> => {
        if (restaurantService) {
            const result = await restaurantService.fetch();
            return result.data;
        }

        // Fallback for when service provider is not available
        const response = await fetch('/api/restaurant');
        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.status}`);
        }
        const json = await response.json();
        return json.status === 'success' ? json.data : json;
    }, [restaurantService]);

    const { data, error, isLoading, isValidating, mutate } = useSWR<Restaurant, Error>(
        enabled ? RESTAURANT_KEY : null,
        fetcher,
        {
            revalidateOnFocus: true,
            revalidateOnReconnect: true,
            refreshInterval,
            dedupingInterval: cacheTimeout / 2,
            shouldRetryOnError: (error) => {
                // Don't retry on client errors
                if (error.message.includes('4')) return false;
                return true;
            },
            errorRetryCount: 3,
            errorRetryInterval: 1000,
            keepPreviousData: true,
            ...swrOptions,
        }
    );

    const refetch = useCallback(async () => {
        await mutate();
    }, [mutate]);

    return {
        data: data ?? null,
        error: error ?? null,
        isLoading,
        isValidating,
        refetch,
        mutate,
    };
}

// ============================================
// Specialized Hooks (ISP)
// ============================================

/**
 * Hook for restaurant open/closed status.
 * Following ISP: Returns only status-related data.
 * 
 * @param options - Hook options
 * @returns Restaurant status (isOpen, hours, nextOpenTime)
 */
export function useRestaurantStatus(
    options: UseRestaurantOptions = {}
): UseRestaurantStatusResult {
    const { data, error, isLoading, isValidating, refetch } = useRestaurantData(options);

    // Get service for status computation
    let restaurantService: ReturnType<typeof useService<'restaurant'>> | null = null;

    try {
        restaurantService = useService('restaurant');
    } catch {
        // Service not available
    }

    // Compute status from data
    const status = useMemo((): Pick<UseRestaurantStatusResult, 'isOpen' | 'currentHours' | 'nextOpenTime'> => {
        if (!data) {
            return { isOpen: false, currentHours: null, nextOpenTime: null };
        }

        // Use synchronous status computation from utilities
        const { getRestaurantStatus } = require('@/lib/utils/restaurant/status');
        return getRestaurantStatus(data.hours);
    }, [data]);

    return {
        isOpen: status.isOpen,
        currentHours: status.currentHours,
        nextOpenTime: status.nextOpenTime,
        error: error ?? null,
        isLoading,
        isValidating,
        refetch,
    };
}

/**
 * Hook for restaurant contact information.
 * Following ISP: Returns only contact-related data.
 * 
 * @param options - Hook options
 * @returns Restaurant contact info (phone, email, address)
 */
export function useRestaurantContact(
    options: UseRestaurantOptions = {}
): UseRestaurantContactResult {
    const { data, error, isLoading, isValidating, refetch } = useRestaurantData(options);

    const contact = useMemo((): Pick<UseRestaurantContactResult, 'phone' | 'email' | 'address'> => {
        if (!data) {
            return { phone: undefined, email: undefined, address: undefined };
        }

        return {
            phone: data.phone,
            email: data.email,
            address: data.address,
        };
    }, [data]);

    return {
        phone: contact.phone,
        email: contact.email,
        address: contact.address,
        error: error ?? null,
        isLoading,
        isValidating,
        refetch,
    };
}

// ============================================
// Combined Hook (Backward Compatibility)
// ============================================

/**
 * Combined restaurant hook for backward compatibility.
 * 
 * @deprecated Prefer specialized hooks (useRestaurantData, useRestaurantStatus, 
 * useRestaurantContact) for better ISP adherence.
 * 
 * @param options - Hook options
 * @returns Combined restaurant data, status, and contact
 */
export function useRestaurant(
    options: UseRestaurantOptions = {}
): UseRestaurantResult {
    const dataResult = useRestaurantData(options);
    const statusResult = useRestaurantStatus(options);

    // Combine results
    return {
        ...dataResult,
        isOpen: statusResult.isOpen,
        currentHours: statusResult.currentHours,
        nextOpenTime: statusResult.nextOpenTime,
    };
}

// Default export for convenience
export default useRestaurant;
