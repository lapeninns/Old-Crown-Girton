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
          placeholder={<HeaderSkeleton />}
        />
        
        <CriticalComponent 
          componentId="hero"
          priority="high"
          placeholder={<HeroSkeleton />}
        />

        {/* Adaptive image with device-optimized loading */}
        <AdaptiveImage
          src="/images/restaurant-hero.jpg"
          alt="Old Crown Girton Restaurant Interior"
          width={1920}
          height={1080}
          priority="high"
          className="w-full h-96 object-cover"
          placeholder={<ImageSkeleton />}
        />

        {/* Important content - loads based on device capabilities */}
        <LazyComponent 
          componentId="menu-interactive"
          priority="normal"
          placeholder={<MenuSkeleton />}
        />

        {/* Secondary content - deferred on low-end devices */}
        <AdaptiveComponent 
          componentId="testimonials"
          priority="normal"
          defer={false}
          placeholder={<TestimonialsSkeleton />}
        />

        {/* Marketing content - loads in background on capable devices */}
        <LazyComponent 
          componentId="features"
          priority="low"
          placeholder={<FeaturesSkeleton />}
        />

        {/* Non-essential content - heavily optimized for device tier */}
        <AdaptiveComponent 
          componentId="slideshow"
          priority="low"
          defer={true}
          placeholder={<SlideshowSkeleton />}
        />

        {/* Footer - critical for navigation but can load later */}
        <LazyComponent 
          componentId="footer"
          priority="normal"
          placeholder={<FooterSkeleton />}
        />
      </div>
    </ProgressiveLoadingProvider>
  );
}

/**
 * Skeleton Components for Loading States
 * These provide immediate visual feedback while content loads
 */

function HeaderSkeleton() {
  return (
    <div className="animate-pulse bg-gray-200 h-16 w-full flex items-center justify-between px-4">
      <div className="bg-gray-300 h-8 w-32 rounded"></div>
      <div className="flex space-x-4">
        <div className="bg-gray-300 h-6 w-16 rounded"></div>
        <div className="bg-gray-300 h-6 w-16 rounded"></div>
        <div className="bg-gray-300 h-6 w-16 rounded"></div>
      </div>
    </div>
  );
}

function HeroSkeleton() {
  return (
    <div className="animate-pulse bg-gray-200 h-96 w-full flex flex-col items-center justify-center space-y-4">
      <div className="bg-gray-300 h-12 w-64 rounded"></div>
      <div className="bg-gray-300 h-6 w-96 rounded"></div>
      <div className="bg-gray-300 h-10 w-32 rounded"></div>
    </div>
  );
}

function ImageSkeleton() {
  return (
    <div className="animate-pulse bg-gray-200 w-full h-96 flex items-center justify-center">
      <div className="text-gray-400">
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  );
}

function MenuSkeleton() {
  return (
    <div className="animate-pulse space-y-4 p-6">
      <div className="bg-gray-300 h-8 w-48 rounded mb-6"></div>
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex justify-between items-center p-4 border rounded">
          <div className="flex-1 space-y-2">
            <div className="bg-gray-300 h-6 w-32 rounded"></div>
            <div className="bg-gray-300 h-4 w-48 rounded"></div>
          </div>
          <div className="bg-gray-300 h-6 w-16 rounded"></div>
        </div>
      ))}
    </div>
  );
}

function TestimonialsSkeleton() {
  return (
    <div className="animate-pulse grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="space-y-3">
          <div className="bg-gray-300 h-4 w-full rounded"></div>
          <div className="bg-gray-300 h-4 w-5/6 rounded"></div>
          <div className="bg-gray-300 h-4 w-4/6 rounded"></div>
          <div className="flex items-center space-x-3 mt-4">
            <div className="bg-gray-300 h-10 w-10 rounded-full"></div>
            <div className="bg-gray-300 h-4 w-24 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

function FeaturesSkeleton() {
  return (
    <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="space-y-3">
          <div className="bg-gray-300 h-12 w-12 rounded"></div>
          <div className="bg-gray-300 h-6 w-32 rounded"></div>
          <div className="bg-gray-300 h-4 w-full rounded"></div>
          <div className="bg-gray-300 h-4 w-5/6 rounded"></div>
        </div>
      ))}
    </div>
  );
}

function SlideshowSkeleton() {
  return (
    <div className="animate-pulse bg-gray-200 h-64 w-full flex items-center justify-center">
      <div className="text-gray-400">Slideshow loading...</div>
    </div>
  );
}

function FooterSkeleton() {
  return (
    <div className="animate-pulse bg-gray-200 h-32 w-full flex items-center justify-center">
      <div className="text-gray-400">Footer loading...</div>
    </div>
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
          priority={index < 3 ? 'high' : 'normal'}
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
