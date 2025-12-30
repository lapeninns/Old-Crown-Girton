/**
 * Restaurant API Service Implementation
 * 
 * Implements IRestaurantService for fetching restaurant data from the API.
 * Following Single Responsibility Principle: Only handles data fetching.
 * 
 * @module services/implementations/RestaurantService
 */

import type { Restaurant } from '@/src/lib/data/schemas';
import { RestaurantSchema } from '@/src/lib/data/schemas';
import { getRestaurantStatus } from '@/lib/utils/restaurant/status';
import type {
    IRestaurantService,
    RestaurantStatus,
    RestaurantContact,
    FetchRestaurantOptions,
    FetchRestaurantResult,
} from '../interfaces/IRestaurantService';

/**
 * Configuration options for RestaurantApiService.
 */
export interface RestaurantServiceConfig {
    /** Base URL for API requests */
    baseUrl?: string;
    /** API endpoint path */
    endpoint?: string;
    /** Default cache duration in ms */
    cacheDuration?: number;
    /** Custom fetch function for testing */
    fetchFn?: typeof fetch;
}

const DEFAULT_CONFIG: Required<RestaurantServiceConfig> = {
    baseUrl: '',
    endpoint: '/api/restaurant',
    cacheDuration: 1800000, // 30 minutes
    fetchFn: fetch,
};

/**
 * Restaurant API Service
 * 
 * Fetches restaurant data from the /api/restaurant endpoint.
 * Includes caching and status computation.
 */
export class RestaurantApiService implements IRestaurantService {
    private config: Required<RestaurantServiceConfig>;
    private cache: {
        data: Restaurant | null;
        timestamp: number;
    } = {
            data: null,
            timestamp: 0,
        };

    constructor(config: RestaurantServiceConfig = {}) {
        this.config = { ...DEFAULT_CONFIG, ...config };
    }

    /**
     * Fetches restaurant data from the API.
     */
    async fetch(options: FetchRestaurantOptions = {}): Promise<FetchRestaurantResult> {
        const { bypassCache = false, signal } = options;
        const now = Date.now();

        // Check cache
        if (
            !bypassCache &&
            this.cache.data &&
            now - this.cache.timestamp < this.config.cacheDuration
        ) {
            return {
                data: this.cache.data,
                cached: true,
                timestamp: this.cache.timestamp,
            };
        }

        // Fetch from API
        const url = `${this.config.baseUrl}${this.config.endpoint}`;
        const response = await this.config.fetchFn(url, {
            headers: {
                Accept: 'application/json',
                'Cache-Control': bypassCache ? 'no-cache' : 'default',
            },
            signal,
        });

        if (!response.ok) {
            throw new Error(
                `Restaurant fetch failed: ${response.status} ${response.statusText}`
            );
        }

        const json = await response.json();

        // Handle both standardized API response and direct data
        const data = json.status === 'success' ? json.data : json;

        // Validate with schema
        const result = RestaurantSchema.safeParse(data);
        if (!result.success) {
            throw new Error(
                `Restaurant validation failed: ${JSON.stringify(result.error.flatten())}`
            );
        }

        // Update cache
        this.cache = {
            data: result.data,
            timestamp: now,
        };

        return {
            data: result.data,
            cached: false,
            timestamp: now,
        };
    }

    /**
     * Gets the current status of the restaurant.
     */
    async getStatus(restaurant?: Restaurant): Promise<RestaurantStatus> {
        const data = restaurant ?? (await this.fetch()).data;
        return getRestaurantStatus(data.hours);
    }

    /**
     * Gets just the contact information.
     */
    async getContact(restaurant?: Restaurant): Promise<RestaurantContact> {
        const data = restaurant ?? (await this.fetch()).data;
        return {
            phone: data.phone,
            email: data.email,
            address: data.address,
        };
    }

    /**
     * Invalidates the cache.
     */
    invalidateCache(): void {
        this.cache = {
            data: null,
            timestamp: 0,
        };
    }
}

/**
 * Creates a new RestaurantApiService instance.
 * Factory function for dependency injection.
 */
export function createRestaurantService(
    config?: RestaurantServiceConfig
): IRestaurantService {
    return new RestaurantApiService(config);
}
