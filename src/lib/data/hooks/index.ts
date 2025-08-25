/**
 * Enhanced Smart Hooks - Barrel Export
 * 
 * Centralized export of all enhanced smart hooks for Restaurant_BP.
 * Provides both new enhanced interfaces and backward compatibility.
 */

// Enhanced individual hooks
// Note: useMenu is exported separately for backward compatibility
export { useRestaurantSmart } from './useSmartHooks';
export { useMarketingSmart } from './useSmartHooks';
export { useContentSmart } from './useSmartHooks';

// Generic smart hook for custom data
export { useParsedDataSmart } from './useSmartHooks';

// Combined hooks
export { useAllRestaurantData, useSystemHealth } from './useSmartHooks';

// Backward compatibility - re-export enhanced useMenu
export { useMenu } from './useMenu';

// Types
export type { 
  SmartHookOptions, 
  SmartHookResult 
} from './useSmartHooks';

// Enhanced hook result types
export type MenuHookResult = import('./useSmartHooks').SmartHookResult<import('../schemas').Menu>;
export type RestaurantHookResult = import('./useSmartHooks').SmartHookResult<import('../schemas').Restaurant>;
export type MarketingHookResult = import('./useSmartHooks').SmartHookResult<import('../schemas').Marketing>;
export type ContentHookResult = import('./useSmartHooks').SmartHookResult<import('../schemas').Content>;

// Configuration and utility functions
export { 
  createSmartFetcher, 
  createSmartHook 
} from './useSmartHooks';