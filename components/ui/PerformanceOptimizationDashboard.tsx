// Performance Optimization Tools - Bundle analysis & recommendations
'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Bundle analysis interfaces
interface BundleAnalysis {
  totalSize: number;
  compressedSize: number;
  compressionRatio: number;
  chunkSizes: Array<{
    name: string;
    size: number;
    type: 'js' | 'css' | 'image' | 'font' | 'other';
    loadTime: number;
    cached: boolean;
  }>;
  largestChunks: Array<{ name: string; size: number; impact: 'high' | 'medium' | 'low' }>;
  duplicateModules: Array<{ name: string; instances: number; wastedSize: number }>;
}

interface OptimizationRecommendation {
  id: string;
  type: 'bundle' | 'image' | 'css' | 'js' | 'critical-path' | 'caching';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: string;
  currentValue: number;
  targetValue: number;
  potentialSaving: number;
  actions: string[];
  implemented: boolean;
}

interface CriticalPathAnalysis {
  criticalResources: Array<{
    url: string;
    type: string;
    loadTime: number;
    blocking: boolean;
    priority: 'high' | 'medium' | 'low';
  }>;
  renderBlockingResources: number;
  criticalPathLength: number;
  timeToInteractive: number;
}

interface ImageOptimizationData {
  totalImages: number;
  unoptimizedImages: number;
  totalImageSize: number;
  potentialSavings: number;
  formatRecommendations: Array<{
    src: string;
    currentFormat: string;
    recommendedFormat: string;
    currentSize: number;
    optimizedSize: number;
    savings: number;
  }>;
}

interface PerformanceOptimization {
  bundleAnalysis: BundleAnalysis;
  recommendations: OptimizationRecommendation[];
  criticalPath: CriticalPathAnalysis;
  imageOptimization: ImageOptimizationData;
  overallScore: number;
  implementedOptimizations: number;
  potentialSpeedGain: number;
}

export const usePerformanceOptimization = () => {
  const [optimization, setOptimization] = useState<PerformanceOptimization>({
    bundleAnalysis: {
      totalSize: 0,
      compressedSize: 0,
      compressionRatio: 0,
      chunkSizes: [],
      largestChunks: [],
      duplicateModules: []
    },
    recommendations: [],
    criticalPath: {
      criticalResources: [],
      renderBlockingResources: 0,
      criticalPathLength: 0,
      timeToInteractive: 0
    },
    imageOptimization: {
      totalImages: 0,
      unoptimizedImages: 0,
      totalImageSize: 0,
      potentialSavings: 0,
      formatRecommendations: []
    },
    overallScore: 0,
    implementedOptimizations: 0,
    potentialSpeedGain: 0
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Initialize performance optimization analysis
  const initializeAnalysis = useCallback(async () => {
    if (typeof window === 'undefined' || isAnalyzing) return;
    
    setIsAnalyzing(true);
    
    try {
      // Analyze bundle sizes
      await analyzeBundleSizes();
      
      // Analyze critical path
      await analyzeCriticalPath();
      
      // Analyze images
      await analyzeImages();
      
      // Generate recommendations
      generateRecommendations();
      
      console.log('Performance optimization analysis completed');
    } catch (error) {
      console.error('Error during performance analysis:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [isAnalyzing]);

  // Analyze bundle sizes using Resource Timing API
  const analyzeBundleSizes = async () => {
    if (!window.performance?.getEntriesByType) return;

    const resources = window.performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    let totalSize = 0;
    let compressedSize = 0;
    const chunkSizes: BundleAnalysis['chunkSizes'] = [];
    const chunkSizeMap = new Map<string, number>();

    resources.forEach((resource) => {
      const size = resource.transferSize || resource.encodedBodySize || 0;
      const uncompressedSize = resource.decodedBodySize || size;
      
      if (size > 0) {
        totalSize += uncompressedSize;
        compressedSize += size;

        let type: 'js' | 'css' | 'image' | 'font' | 'other' = 'other';
        if (resource.name.includes('.js')) type = 'js';
        else if (resource.name.includes('.css')) type = 'css';
        else if (/\.(jpg|jpeg|png|gif|webp|avif|svg)/.test(resource.name)) type = 'image';
        else if (/\.(woff|woff2|ttf|otf)/.test(resource.name)) type = 'font';

        const chunk = {
          name: resource.name.split('/').pop() || resource.name,
          size: uncompressedSize,
          type,
          loadTime: resource.duration,
          cached: resource.transferSize === 0
        };

        chunkSizes.push(chunk);
        chunkSizeMap.set(chunk.name, (chunkSizeMap.get(chunk.name) || 0) + chunk.size);
      }
    });

    // Find largest chunks
    const largestChunks = Array.from(chunkSizeMap.entries())
      .map(([name, size]) => ({
        name,
        size,
        impact: size > 100000 ? 'high' as const : size > 50000 ? 'medium' as const : 'low' as const
      }))
      .sort((a, b) => b.size - a.size)
      .slice(0, 10);

    // Detect potential duplicate modules (simplified heuristic)
    const duplicateModules: BundleAnalysis['duplicateModules'] = [];
    const moduleNames = new Map<string, number>();
    
    chunkSizes.forEach(chunk => {
      const baseName = chunk.name.replace(/\.[a-f0-9]{8,}\./, '.').replace(/\?.*$/, '');
      moduleNames.set(baseName, (moduleNames.get(baseName) || 0) + 1);
    });

    moduleNames.forEach((count, name) => {
      if (count > 1) {
        const instances = chunkSizes.filter(chunk => 
          chunk.name.replace(/\.[a-f0-9]{8,}\./, '.').replace(/\?.*$/, '') === name
        );
        const wastedSize = instances.reduce((sum, instance) => sum + instance.size, 0) - 
                          Math.max(...instances.map(i => i.size));
        
        if (wastedSize > 10000) { // Only report significant duplicates
          duplicateModules.push({ name, instances: count, wastedSize });
        }
      }
    });

    setOptimization(prev => ({
      ...prev,
      bundleAnalysis: {
        totalSize,
        compressedSize,
        compressionRatio: totalSize > 0 ? (compressedSize / totalSize) * 100 : 0,
        chunkSizes: chunkSizes.sort((a, b) => b.size - a.size),
        largestChunks,
        duplicateModules: duplicateModules.sort((a, b) => b.wastedSize - a.wastedSize)
      }
    }));
  };

  // Analyze critical rendering path
  const analyzeCriticalPath = async () => {
    if (!window.performance?.getEntriesByType) return;

    const resources = window.performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    const criticalResources: CriticalPathAnalysis['criticalResources'] = [];
    let renderBlockingCount = 0;

    resources.forEach((resource) => {
      const isRenderBlocking = (resource.name.includes('.css') && !resource.name.includes('async')) ||
                               (resource.name.includes('.js') && !resource.name.includes('defer') && !resource.name.includes('async'));
      
      if (isRenderBlocking) renderBlockingCount++;

      // Consider resources that significantly impact loading
      if (resource.duration > 100 || resource.transferSize > 50000) {
        criticalResources.push({
          url: resource.name,
          type: resource.initiatorType,
          loadTime: resource.duration,
          blocking: isRenderBlocking,
          priority: resource.duration > 500 ? 'high' : resource.duration > 200 ? 'medium' : 'low'
        });
      }
    });

    // Estimate Time to Interactive (simplified)
    const navigationTiming = window.performance.timing;
    const timeToInteractive = navigationTiming.loadEventEnd - navigationTiming.navigationStart;

    setOptimization(prev => ({
      ...prev,
      criticalPath: {
        criticalResources: criticalResources.sort((a, b) => b.loadTime - a.loadTime),
        renderBlockingResources: renderBlockingCount,
        criticalPathLength: criticalResources.filter(r => r.blocking).length,
        timeToInteractive
      }
    }));
  };

  // Analyze image optimization opportunities
  const analyzeImages = async () => {
    const images = document.querySelectorAll('img');
    let totalImages = 0;
    let unoptimizedImages = 0;
    let totalImageSize = 0;
    let potentialSavings = 0;
    const formatRecommendations: ImageOptimizationData['formatRecommendations'] = [];

    // Get resource data for images
    const resources = window.performance?.getEntriesByType?.('resource') as PerformanceResourceTiming[] || [];
    const imageResources = resources.filter(r => /\.(jpg|jpeg|png|gif|webp|avif|svg)/.test(r.name));

    images.forEach((img, index) => {
      totalImages++;
      
      // Check if image has proper sizing attributes
      const hasIntrinsicDimensions = img.naturalWidth && img.naturalHeight;
      const hasExplicitDimensions = img.width && img.height;
      
      if (!hasExplicitDimensions) {
        unoptimizedImages++;
      }

      // Find corresponding resource timing
      const resourceData = imageResources.find(r => r.name.includes(img.src.split('/').pop() || ''));
      if (resourceData) {
        const size = resourceData.transferSize || resourceData.encodedBodySize || 0;
        totalImageSize += size;

        // Estimate potential savings for format optimization
        const currentFormat = img.src.split('.').pop()?.toLowerCase() || '';
        let recommendedFormat = '';
        let estimatedSavings = 0;

        if (['jpg', 'jpeg', 'png'].includes(currentFormat)) {
          // Check WebP support
          if (window.HTMLCanvasElement && 
              document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0) {
            recommendedFormat = 'webp';
            estimatedSavings = size * 0.25; // Estimate 25% savings with WebP
          }
        }

        if (recommendedFormat && estimatedSavings > 5000) { // Only recommend if significant savings
          formatRecommendations.push({
            src: img.src,
            currentFormat,
            recommendedFormat,
            currentSize: size,
            optimizedSize: size - estimatedSavings,
            savings: estimatedSavings
          });
          potentialSavings += estimatedSavings;
        }
      }
    });

    setOptimization(prev => ({
      ...prev,
      imageOptimization: {
        totalImages,
        unoptimizedImages,
        totalImageSize,
        potentialSavings,
        formatRecommendations: formatRecommendations.sort((a, b) => b.savings - a.savings)
      }
    }));
  };

  // Generate optimization recommendations
  const generateRecommendations = () => {
    const recommendations: OptimizationRecommendation[] = [];

    // Bundle size recommendations
    if (optimization.bundleAnalysis.totalSize > 500000) {
      recommendations.push({
        id: 'bundle-size',
        type: 'bundle',
        priority: 'high',
        title: 'Reduce Bundle Size',
        description: 'Your JavaScript bundle is quite large and may impact loading performance.',
        impact: 'Reduce initial loading time by up to 2 seconds',
        currentValue: optimization.bundleAnalysis.totalSize,
        targetValue: 300000,
        potentialSaving: optimization.bundleAnalysis.totalSize - 300000,
        actions: [
          'Implement code splitting with dynamic imports',
          'Remove unused dependencies',
          'Use tree shaking to eliminate dead code',
          'Consider lazy loading non-critical components'
        ],
        implemented: false
      });
    }

    // Image optimization recommendations
    if (optimization.imageOptimization.potentialSavings > 50000) {
      recommendations.push({
        id: 'image-optimization',
        type: 'image',
        priority: 'medium',
        title: 'Optimize Images',
        description: 'Convert images to modern formats for better compression.',
        impact: `Save ${(optimization.imageOptimization.potentialSavings / 1024).toFixed(0)}KB in image data`,
        currentValue: optimization.imageOptimization.totalImageSize,
        targetValue: optimization.imageOptimization.totalImageSize - optimization.imageOptimization.potentialSavings,
        potentialSaving: optimization.imageOptimization.potentialSavings,
        actions: [
          'Convert JPEG/PNG images to WebP format',
          'Implement responsive images with srcset',
          'Add loading="lazy" to below-the-fold images',
          'Compress images without quality loss'
        ],
        implemented: false
      });
    }

    // Critical path recommendations
    if (optimization.criticalPath.renderBlockingResources > 3) {
      recommendations.push({
        id: 'critical-path',
        type: 'critical-path',
        priority: 'high',
        title: 'Optimize Critical Rendering Path',
        description: 'Too many render-blocking resources are delaying page rendering.',
        impact: 'Improve First Contentful Paint by up to 1.5 seconds',
        currentValue: optimization.criticalPath.renderBlockingResources,
        targetValue: 2,
        potentialSaving: optimization.criticalPath.renderBlockingResources - 2,
        actions: [
          'Inline critical CSS',
          'Defer non-critical JavaScript',
          'Use async/defer attributes on script tags',
          'Preload key resources'
        ],
        implemented: false
      });
    }

    // Duplicate modules recommendation
    if (optimization.bundleAnalysis.duplicateModules.length > 0) {
      const totalWaste = optimization.bundleAnalysis.duplicateModules.reduce((sum, mod) => sum + mod.wastedSize, 0);
      recommendations.push({
        id: 'duplicate-modules',
        type: 'bundle',
        priority: 'medium',
        title: 'Remove Duplicate Modules',
        description: 'Multiple versions of the same modules are being loaded.',
        impact: `Eliminate ${(totalWaste / 1024).toFixed(0)}KB of duplicate code`,
        currentValue: totalWaste,
        targetValue: 0,
        potentialSaving: totalWaste,
        actions: [
          'Configure webpack to avoid duplicate dependencies',
          'Use dynamic imports for vendor chunks',
          'Review and consolidate similar dependencies',
          'Implement proper bundle splitting strategy'
        ],
        implemented: false
      });
    }

    // Caching recommendations
    const uncachedResources = optimization.bundleAnalysis.chunkSizes.filter(chunk => !chunk.cached).length;
    if (uncachedResources > optimization.bundleAnalysis.chunkSizes.length * 0.7) {
      recommendations.push({
        id: 'caching-strategy',
        type: 'caching',
        priority: 'medium',
        title: 'Improve Caching Strategy',
        description: 'Many resources are not being cached effectively.',
        impact: 'Reduce repeat visit loading time by up to 70%',
        currentValue: uncachedResources,
        targetValue: Math.floor(optimization.bundleAnalysis.chunkSizes.length * 0.3),
        potentialSaving: uncachedResources - Math.floor(optimization.bundleAnalysis.chunkSizes.length * 0.3),
        actions: [
          'Implement service worker for asset caching',
          'Configure proper cache headers',
          'Use versioned URLs for cache busting',
          'Cache API responses where appropriate'
        ],
        implemented: false
      });
    }

    setOptimization(prev => ({
      ...prev,
      recommendations: recommendations.sort((a, b) => {
        const priorityWeight = { high: 3, medium: 2, low: 1 };
        return priorityWeight[b.priority] - priorityWeight[a.priority];
      })
    }));
  };

  // Mark recommendation as implemented
  const markRecommendationImplemented = (id: string) => {
    setOptimization(prev => ({
      ...prev,
      recommendations: prev.recommendations.map(rec =>
        rec.id === id ? { ...rec, implemented: true } : rec
      ),
      implementedOptimizations: prev.implementedOptimizations + 1
    }));
  };

  // Calculate overall optimization score
  const calculateOptimizationScore = useCallback((): number => {
    let score = 100;
    
    // Deduct points for bundle size
    if (optimization.bundleAnalysis.totalSize > 500000) score -= 20;
    else if (optimization.bundleAnalysis.totalSize > 300000) score -= 10;
    
    // Deduct points for render-blocking resources
    if (optimization.criticalPath.renderBlockingResources > 5) score -= 15;
    else if (optimization.criticalPath.renderBlockingResources > 3) score -= 10;
    
    // Deduct points for unoptimized images
    const imageOptimizationRatio = optimization.imageOptimization.totalImages > 0 
      ? optimization.imageOptimization.unoptimizedImages / optimization.imageOptimization.totalImages 
      : 0;
    if (imageOptimizationRatio > 0.5) score -= 15;
    else if (imageOptimizationRatio > 0.3) score -= 10;
    
    // Deduct points for duplicate modules
    if (optimization.bundleAnalysis.duplicateModules.length > 3) score -= 10;
    else if (optimization.bundleAnalysis.duplicateModules.length > 1) score -= 5;
    
    // Add points for implemented optimizations
    score += optimization.implementedOptimizations * 5;
    
    return Math.max(0, Math.min(100, score));
  }, [optimization]);

  // Initialize analysis on mount
  useEffect(() => {
    const timer = setTimeout(initializeAnalysis, 2000); // Wait for page to load
    return () => clearTimeout(timer);
  }, [initializeAnalysis]);

  // Update optimization score
  useEffect(() => {
    const score = calculateOptimizationScore();
    setOptimization(prev => ({ ...prev, overallScore: score }));
  }, [calculateOptimizationScore]);

  return {
    optimization,
    isAnalyzing,
    markRecommendationImplemented,
    reinitializeAnalysis: initializeAnalysis
  };
};

// Performance Optimization Dashboard Component
export const PerformanceOptimizationDashboard = () => {
  const { optimization, isAnalyzing, markRecommendationImplemented } = usePerformanceOptimization();
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'bundle' | 'images' | 'recommendations'>('overview');

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  if (!isExpanded) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed bottom-36 right-4 z-40"
      >
        <button
          onClick={() => setIsExpanded(true)}
          className="bg-white rounded-full shadow-lg border-2 p-3 hover:shadow-xl transition-all relative"
        >
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${getScoreBgColor(optimization.overallScore)}`} />
            <span className={`text-sm font-medium ${getScoreColor(optimization.overallScore)}`}>
              {optimization.overallScore}
            </span>
          </div>
          {isAnalyzing && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
          )}
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className="fixed bottom-4 right-4 z-40 bg-white rounded-xl shadow-2xl border border-gray-200 w-96 max-h-96 overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-4 h-4 rounded-full ${getScoreBgColor(optimization.overallScore)}`} />
          <div>
            <h3 className="font-semibold text-gray-900">Performance Optimization</h3>
            <p className={`text-sm font-medium ${getScoreColor(optimization.overallScore)}`}>
              Score: {optimization.overallScore}/100
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {isAnalyzing && (
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          )}
          <button
            onClick={() => setIsExpanded(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-100">
        {[
          { key: 'overview', label: 'Overview' },
          { key: 'bundle', label: 'Bundle' },
          { key: 'images', label: 'Images' },
          { key: 'recommendations', label: 'Tips' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
              activeTab === tab.key
                ? 'text-crown-gold border-b-2 border-crown-gold'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-4 h-64 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-gray-50 rounded-lg p-2">
                  <div className="text-gray-600">Bundle Size</div>
                  <div className="font-semibold">{formatBytes(optimization.bundleAnalysis.totalSize)}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <div className="text-gray-600">Compression</div>
                  <div className="font-semibold">{optimization.bundleAnalysis.compressionRatio.toFixed(1)}%</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <div className="text-gray-600">Images</div>
                  <div className="font-semibold">{optimization.imageOptimization.totalImages}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <div className="text-gray-600">Optimizations</div>
                  <div className="font-semibold">{optimization.implementedOptimizations}</div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-gray-700 mb-2">Critical Resources</h4>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Render Blocking</span>
                    <span className="font-medium">{optimization.criticalPath.renderBlockingResources}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Critical Path Length</span>
                    <span className="font-medium">{optimization.criticalPath.criticalPathLength}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'bundle' && (
            <motion.div
              key="bundle"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              <h4 className="text-xs font-semibold text-gray-700">Largest Chunks</h4>
              <div className="space-y-2">
                {optimization.bundleAnalysis.largestChunks.slice(0, 5).map((chunk, index) => (
                  <div key={chunk.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        chunk.impact === 'high' ? 'bg-red-500' : 
                        chunk.impact === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`} />
                      <span className="truncate max-w-32">{chunk.name}</span>
                    </div>
                    <span className="font-medium">{formatBytes(chunk.size)}</span>
                  </div>
                ))}
              </div>

              {optimization.bundleAnalysis.duplicateModules.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-700 mb-2">Duplicate Modules</h4>
                  <div className="space-y-1">
                    {optimization.bundleAnalysis.duplicateModules.slice(0, 3).map((module) => (
                      <div key={module.name} className="flex justify-between text-xs">
                        <span className="truncate max-w-32">{module.name}</span>
                        <span className="text-red-600 font-medium">
                          -{formatBytes(module.wastedSize)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'images' && (
            <motion.div
              key="images"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-gray-50 rounded-lg p-2">
                  <div className="text-gray-600">Total Images</div>
                  <div className="font-semibold">{optimization.imageOptimization.totalImages}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <div className="text-gray-600">Unoptimized</div>
                  <div className="font-semibold text-red-600">{optimization.imageOptimization.unoptimizedImages}</div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-gray-700 mb-2">Format Recommendations</h4>
                <div className="space-y-2">
                  {optimization.imageOptimization.formatRecommendations.slice(0, 3).map((rec, index) => (
                    <div key={index} className="text-xs">
                      <div className="flex justify-between">
                        <span className="truncate max-w-32">{rec.src.split('/').pop()}</span>
                        <span className="text-green-600 font-medium">
                          -{formatBytes(rec.savings)}
                        </span>
                      </div>
                      <div className="text-gray-500">
                        {rec.currentFormat} → {rec.recommendedFormat}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {optimization.imageOptimization.potentialSavings > 0 && (
                <div className="bg-green-50 rounded-lg p-2">
                  <div className="text-xs text-green-800">
                    <div className="font-semibold">Potential Savings</div>
                    <div>{formatBytes(optimization.imageOptimization.potentialSavings)}</div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'recommendations' && (
            <motion.div
              key="recommendations"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              <div className="space-y-2">
                {optimization.recommendations.slice(0, 3).map((rec) => (
                  <div
                    key={rec.id}
                    className={`p-2 rounded text-xs ${
                      rec.implemented ? 'bg-green-50 text-green-800' :
                      rec.priority === 'high' ? 'bg-red-50 text-red-800' :
                      rec.priority === 'medium' ? 'bg-yellow-50 text-yellow-800' :
                      'bg-blue-50 text-blue-800'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div className="font-semibold">{rec.title}</div>
                      {!rec.implemented && (
                        <button
                          onClick={() => markRecommendationImplemented(rec.id)}
                          className="text-xs bg-white/50 px-2 py-1 rounded"
                        >
                          Done
                        </button>
                      )}
                    </div>
                    <div className="mb-1">{rec.description}</div>
                    <div className="text-xs opacity-80">
                      {rec.impact}
                    </div>
                  </div>
                ))}
              </div>

              {optimization.recommendations.length === 0 && (
                <div className="text-center text-gray-500 text-xs py-4">
                  Great! No major optimizations needed.
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default PerformanceOptimizationDashboard;
