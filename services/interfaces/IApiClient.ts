/**
 * API Client Interface
 * 
 * Abstracts the HTTP client to allow swapping implementations (e.g. axios, fetch).
 * 
 * @module services/interfaces/IApiClient
 */

export interface HelperOptions {
    headers?: Record<string, string>;
    params?: Record<string, string | number | boolean>;
}

export interface IApiClient {
    get<T>(url: string, options?: HelperOptions): Promise<T>;
    post<T>(url: string, data?: unknown, options?: HelperOptions): Promise<T>;
    put<T>(url: string, data?: unknown, options?: HelperOptions): Promise<T>;
    delete<T>(url: string, options?: HelperOptions): Promise<T>;
    patch<T>(url: string, data?: unknown, options?: HelperOptions): Promise<T>;
}
