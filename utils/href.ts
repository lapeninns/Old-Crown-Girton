/**
 * Safe href processing utility to prevent [object Object] URLs
 * 
 * This utility handles the common Next.js Link href patterns and ensures
 * that UrlObjects are passed through correctly while preventing string
 * coercion that results in "[object Object]" URLs.
 */

import { UrlObject } from 'url';

export type HrefType = string | UrlObject;

/**
 * Safely processes an href value for use with Next.js Link component
 * 
 * @param href - The href value to process (string, UrlObject, or unknown)
 * @param fallback - Fallback URL to use if href is invalid (default: '/')
 * @returns A safe href value that can be used with Next.js Link
 */
export function sanitizeHref(href: unknown, fallback: string = '/'): HrefType {
  // Handle string hrefs
  if (typeof href === 'string') {
    // Handle empty strings
    if (href === '') {
      return fallback;
    }
    // Check for corrupted [object Object] strings
    if (href.includes('[object Object]')) {
      console.warn('🚨 Detected corrupted href string:', href);
      return fallback;
    }
    return href;
  }
  
  // Handle valid Next.js UrlObject
  if (href && typeof href === 'object' && 'pathname' in href) {
    return href as UrlObject;
  }
  
  // Handle legacy href objects with .href property
  if (href && typeof href === 'object' && 'href' in href && typeof (href as any).href === 'string') {
    const hrefValue = (href as any).href;
    if (hrefValue.includes('[object Object]')) {
      console.warn('🚨 Detected corrupted href.href property:', href);
      return fallback;
    }
    return hrefValue;
  }
  
  // Handle null/undefined
  if (!href) {
    return fallback;
  }
  
  // Handle invalid/unexpected types
  console.warn('🚨 Invalid href type detected:', typeof href, href);
  return fallback;
}

/**
 * Creates a safe key for React components using href values
 * Avoids the String(href) pattern that causes [object Object] issues
 * 
 * @param href - The href value to create a key from
 * @param index - Optional index to use as fallback
 * @returns A safe string key for React components
 */
export function createHrefKey(href: unknown, index?: number): string {
  if (typeof href === 'string') {
    if (href.includes('[object Object]')) {
      return `corrupted-href-${index || Date.now()}`;
    }
    return href;
  }
  
  if (href && typeof href === 'object' && 'pathname' in href) {
    const urlObj = href as UrlObject;
    const query = urlObj.query ? JSON.stringify(urlObj.query) : '';
    const hash = urlObj.hash || '';
    return `${urlObj.pathname}${query}${hash}`;
  }
  
  if (href && typeof href === 'object' && 'href' in href) {
    const hrefValue = (href as any).href;
    if (typeof hrefValue === 'string' && !hrefValue.includes('[object Object]')) {
      return hrefValue;
    }
  }
  
  return `unknown-href-${index || Date.now()}`;
}

/**
 * Validates if an href value is safe to use
 * 
 * @param href - The href value to validate
 * @returns true if href is safe to use, false otherwise
 */
export function isValidHref(href: unknown): boolean {
  if (typeof href === 'string') {
    return !href.includes('[object Object]');
  }
  
  if (href && typeof href === 'object' && 'pathname' in href) {
    return typeof (href as any).pathname === 'string';
  }
  
  if (href && typeof href === 'object' && 'href' in href) {
    const hrefValue = (href as any).href;
    return typeof hrefValue === 'string' && !hrefValue.includes('[object Object]');
  }
  
  return false;
}

/**
 * Development-only function to log href processing issues
 * Only runs in development mode to avoid production console spam
 */
export function logHrefIssue(message: string, href: unknown, context?: string): void {
  if (process.env.NODE_ENV === 'development') {
    console.warn(`🔗 Href Issue ${context ? `[${context}]` : ''}: ${message}`, href);
  }
}
