"use client";
import { useData } from './useData';
import type { Content } from '@/src/lib/data/schemas';

// Hook for loading complete content data
export function useContent() {
  return useData<Content>('/api/content');
}

// Hook for loading specific page content
export function usePageContent(pageName: keyof Content['pages']) {
  const { data: content, error, loading, refetch } = useContent();
  
  const pageData = content?.pages?.[pageName];
  
  return {
    data: pageData,
    error,
    loading,
    refetch,
  };
}

// Hook for loading global content (navigation, UI, etc.)
export function useGlobalContent() {
  const { data: content, error, loading, refetch } = useContent();
  
  const globalData = content?.global;
  
  return {
    data: globalData,
    error,
    loading,
    refetch,
  };
}

// Hook for component-specific content
export function useComponentContent(componentName: keyof Content['components']) {
  const { data: content, error, loading, refetch } = useContent();
  
  const componentData = content?.components?.[componentName];
  
  return {
    data: componentData,
    error,
    loading,
    refetch,
  };
}

// Utility hook for getting content with fallbacks
export function useContentWithFallback<T>(
  path: string, 
  fallback: T
): { data: T; error: Error | null; loading: boolean; refetch: () => Promise<void> } {
  const { data: content, error, loading, refetch } = useContent();
  
  // Navigate to nested content using dot notation
  const getValue = (obj: any, path: string): T => {
    return path.split('.').reduce((current, key) => current?.[key], obj) ?? fallback;
  };
  
  const data = content ? getValue(content, path) : fallback;
  
  return {
    data,
    error,
    loading,
    refetch,
  };
}