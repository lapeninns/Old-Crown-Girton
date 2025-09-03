// Main hooks barrel export
// Organized by category for better discoverability

// Data fetching hooks
export * from './data';

// Performance and monitoring hooks  
export * from './monitoring';

// Utility hooks
export * from './utils';

// Legacy hooks (to be deprecated)
// These will be removed in future versions
export { useData, useSmartData } from './useData';
export { useParsedData } from './useParsedData';

// Note: The following hooks have been moved and reorganized:
// - useContent -> hooks/data/useContent
// - usePerformance -> hooks/monitoring/usePerformance  
// - usePerformanceMonitoring -> hooks/monitoring/usePerformanceMonitoring
// - useStableId -> hooks/utils/useStableId