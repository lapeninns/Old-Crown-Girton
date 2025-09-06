/**
 * Progressive Loading Integration Example
 * Demonstrates comprehensive progressive loading strategy implementation
 */

import React from 'react';
import ProgressiveLoadingProvider from '../hooks/optimized/useProgressiveLoadingCoordinator';
import { AdaptiveComponent, CriticalComponent, LazyComponent } from '../components/adaptive/AdaptiveComponent';
import { AdaptiveImage } from '../components/adaptive/AdaptiveImage';
import { useDeviceCapabilitiesDebug } from '../hooks/optimized/useDeviceCapabilities';

/**
 * Example Page Component with Progressive Loading
 * This demonstrates how to structure a page for optimal performance across device tiers
 */
export function ProgressiveHomePage() {
  // Enable debug logging in development
  useDeviceCapabilitiesDebug();

  return (
    <ProgressiveLoadingProvider 
      enableDebug={process.env.NODE_ENV === 'development'}
      strategyOverrides={{
        // Custom overrides for this page
        enablePreload: true,
        gracefulDegradation: true
      }}
    >
      <div className="progressive-home-page">
        {/* Critical above-the-fold content - loads immediately on all devices */}
        <CriticalComponent 
          componentId="header"
          priority="high"
          placeholder={<div className="h-16 bg-gray-200 animate-pulse" />}
        />
        
        <CriticalComponent 
          componentId="hero"
          priority="high"
          placeholder={<div className="h-96 bg-gray-200 animate-pulse" />}
        />

        {/* Adaptive image with device-optimized loading */}
        <AdaptiveImage
          src="/images/restaurant-hero.jpg"
          alt="Old Crown Girton Restaurant Interior"
          width={1920}
          height={1080}
          priority={true}
          className="w-full h-96 object-cover"
          placeholder={<div className="w-full h-96 bg-gray-200 animate-pulse" />}
        />

        {/* Important content - loads based on device capabilities */}
        <LazyComponent 
          componentId="menu-interactive"
          priority="normal"
          placeholder={<div className="h-64 bg-gray-200 animate-pulse" />}
        />

        {/* Secondary content - deferred on low-end devices */}
        <AdaptiveComponent 
          componentId="testimonials"
          priority="normal"
          defer={false}
          placeholder={<div className="h-48 bg-gray-200 animate-pulse" />}
        />

        {/* Marketing content - loads in background on capable devices */}
        <LazyComponent 
          componentId="features"
          priority="low"
          placeholder={<div className="h-40 bg-gray-200 animate-pulse" />}
        />

        {/* Non-essential content - heavily optimized for device tier */}
        <AdaptiveComponent 
          componentId="slideshow"
          priority="low"
          defer={true}
          placeholder={<div className="h-64 bg-gray-200 animate-pulse" />}
        />

        {/* Footer - critical for navigation but can load later */}
        <LazyComponent 
          componentId="footer"
          priority="normal"
          placeholder={<div className="h-32 bg-gray-200 animate-pulse" />}
        />
      </div>
    </ProgressiveLoadingProvider>
  );
}

/**
 * Performance Metrics Dashboard for Development
 * Shows real-time device capabilities and loading performance
 */
export function ProgressiveLoadingDashboard() {
  const [showDashboard, setShowDashboard] = React.useState(false);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setShowDashboard(!showDashboard)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded shadow-lg z-50"
      >
        📊 Performance
      </button>
      
      {showDashboard && (
        <div className="fixed bottom-16 right-4 bg-white border shadow-lg rounded p-4 z-50 max-w-sm">
          <h3 className="font-bold mb-2">Progressive Loading Stats</h3>
          <ProgressiveLoadingProvider>
            <DashboardContent />
          </ProgressiveLoadingProvider>
        </div>
      )}
    </>
  );
}

function DashboardContent() {
  const capabilities = useDeviceCapabilitiesDebug();
  
  return (
    <div className="space-y-2 text-sm">
      <div>
        <strong>Device Tier:</strong> {capabilities.deviceTier}
      </div>
      <div>
        <strong>Memory:</strong> {capabilities.memory}GB ({capabilities.memoryPressure})
      </div>
      <div>
        <strong>Network:</strong> {capabilities.networkSpeed} ({capabilities.downlink}Mbps)
      </div>
      <div>
        <strong>Load Capacity:</strong> {capabilities.estimatedLoadCapacity}/10
      </div>
      <div>
        <strong>Max Concurrent:</strong> {capabilities.maxConcurrentLoads}
      </div>
      <div>
        <strong>Image Quality:</strong> {Math.round(capabilities.recommendedImageQuality * 100)}%
      </div>
      <div className="pt-2 border-t">
        <strong>Features:</strong>
        <ul className="text-xs mt-1 space-y-1">
          <li>Preloading: {capabilities.enablePreloading ? '✅' : '❌'}</li>
          <li>WebP: {capabilities.shouldUseWebP ? '✅' : '❌'}</li>
          <li>Service Worker: {capabilities.supportsServiceWorker ? '✅' : '❌'}</li>
          <li>Component Splitting: {capabilities.enableComponentSplitting ? '✅' : '❌'}</li>
        </ul>
      </div>
    </div>
  );
}

/**
 * Usage Examples and Best Practices
 */

// Example 1: Critical above-the-fold content
export const CriticalContentExample = () => (
  <ProgressiveLoadingProvider>
    <CriticalComponent componentId="header" />
    <CriticalComponent componentId="hero" />
  </ProgressiveLoadingProvider>
);

// Example 2: Adaptive image gallery
export const AdaptiveImageGallery = ({ images }: { images: string[] }) => (
  <ProgressiveLoadingProvider>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {images.map((src, index) => (
        <AdaptiveImage
          key={src}
          src={src}
          alt={`Gallery image ${index + 1}`}
          priority={index < 3}
          className="w-full h-64 object-cover rounded"
        />
      ))}
    </div>
  </ProgressiveLoadingProvider>
);

// Example 3: Progressive menu loading
export const ProgressiveMenuExample = () => (
  <ProgressiveLoadingProvider>
    <CriticalComponent componentId="menu-interactive" priority="high" />
    <LazyComponent componentId="testimonials" priority="normal" />
    <LazyComponent componentId="slideshow" priority="low" />
  </ProgressiveLoadingProvider>
);

export default ProgressiveHomePage;
