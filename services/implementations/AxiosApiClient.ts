/**
 * Axios API Client Implementation
 * 
 * Implements IApiClient using Axios.
 * 
 * @module services/implementations/AxiosApiClient
 */

import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import type { IApiClient, HelperOptions } from '../interfaces/IApiClient';

export class AxiosApiClient implements IApiClient {
    private client: AxiosInstance;

    constructor(baseURL: string = '/api') {
        this.client = axios.create({ baseURL });

        this.client.interceptors.response.use(
            (response: AxiosResponse) => response.data,
            (error) => Promise.reject(error)
        );
    }

    // Allow registering external interceptors (e.g. for auth/error handling)
    public get axiosInstance(): AxiosInstance {
        return this.client;
    }

    async get<T>(url: string, options?: HelperOptions): Promise<T> {
        return this.client.get(url, { ...options });
    }

    async post<T>(url: string, data?: unknown, options?: HelperOptions): Promise<T> {
        return this.client.post(url, data, { ...options });
    }

    async put<T>(url: string, data?: unknown, options?: HelperOptions): Promise<T> {
        return this.client.put(url, data, { ...options });
    }

    async delete<T>(url: string, options?: HelperOptions): Promise<T> {
        return this.client.delete(url, { ...options });
    }

    async patch<T>(url: string, data?: unknown, options?: HelperOptions): Promise<T> {
        return this.client.patch(url, data, { ...options });
    }
}
