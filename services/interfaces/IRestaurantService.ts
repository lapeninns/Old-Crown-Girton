/**
 * Restaurant Service Interface
 * 
 * Following Dependency Inversion Principle (DIP):
 * High-level modules (hooks, components) depend on this abstraction,
 * not on concrete implementations.
 * 
 * @module services/interfaces/IRestaurantService
 */

import type { Restaurant } from '@/src/lib/data/schemas';

/**
 * Restaurant status computed values.
 * Following Interface Segregation Principle (ISP):
 * Consumers can depend on just the status without full restaurant data.
 */
export interface RestaurantStatus {
    isOpen: boolean;
    currentHours: string | null;
    nextOpenTime: string | null;
}

/**
 * Restaurant address structure.
 */
export interface RestaurantAddress {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
}

/**
 * Restaurant contact information subset.
 * Following ISP: Focused interface for contact-only consumers.
 */
export interface RestaurantContact {
    phone?: string;
    email?: string;
    address?: RestaurantAddress;
}

/**
 * Fetch options for restaurant data.
 */
export interface FetchRestaurantOptions {
    /** Skip cache and fetch fresh data */
    bypassCache?: boolean;
    /** Signal for request cancellation */
    signal?: AbortSignal;
}

/**
 * Result of fetching restaurant data.
 */
export interface FetchRestaurantResult {
    data: Restaurant;
    cached: boolean;
    timestamp: number;
}

/**
 * Restaurant service interface.
 * 
 * Implementations can be:
 * - RestaurantApiService: Fetches from /api/restaurant
 * - MockRestaurantService: Returns mock data for testing
 * - CachedRestaurantService: Wraps another service with caching
 */
export interface IRestaurantService {
    /**
     * Fetches the restaurant data.
     * 
     * @param options - Fetch options
     * @returns Restaurant data with metadata
     * @throws Error if fetch fails
     */
    fetch(options?: FetchRestaurantOptions): Promise<FetchRestaurantResult>;

    /**
     * Gets the current status of the restaurant.
     * Can use cached data if available.
     * 
     * @param restaurant - Restaurant data (optional, will fetch if not provided)
     * @returns Restaurant status (open/closed, hours, next open time)
     */
    getStatus(restaurant?: Restaurant): Promise<RestaurantStatus>;

    /**
     * Gets just the contact information.
     * Following ISP: Consumers needing only contact info can use this.
     * 
     * @param restaurant - Restaurant data (optional, will fetch if not provided)
     * @returns Contact information subset
     */
    getContact(restaurant?: Restaurant): Promise<RestaurantContact>;

    /**
     * Invalidates any cached data.
     * Call this when you know the data has changed.
     */
    invalidateCache(): void;
}

/**
 * Factory type for creating restaurant service instances.
 * Useful for dependency injection in tests.
 */
export type RestaurantServiceFactory = () => IRestaurantService;
