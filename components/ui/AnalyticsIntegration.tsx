// Analytics Integration Component - Brings together all Sprint 3 Day 3 analytics
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import WebVitalsAnalytics from './WebVitalsAnalytics';
import RestaurantAnalytics from './RestaurantAnalytics';
import PerformanceOptimizationDashboard from './PerformanceOptimizationDashboard';
import SEOAnalysisDashboard from './SEOAnalysisDashboard';

interface AnalyticsConfig {
  webVitals: boolean;
  restaurantAnalytics: boolean;
  performanceOptimization: boolean;
  seoAnalysis: boolean;
}

interface AnalyticsIntegrationProps {
  enabled?: AnalyticsConfig;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  showToggle?: boolean;
}

export const AnalyticsIntegration = ({
  enabled = {
    webVitals: true,
    restaurantAnalytics: true,
    performanceOptimization: true,
    seoAnalysis: true
  },
  position = 'bottom-right',
  showToggle = true
}: AnalyticsIntegrationProps) => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [activeComponents, setActiveComponents] = useState(enabled);

  const positionClasses = {
    'bottom-right': '',
    'bottom-left': 'left-4 right-auto',
    'top-right': 'top-4 bottom-auto',
    'top-left': 'top-4 left-4 right-auto bottom-auto'
  };

  const toggleComponent = (component: keyof AnalyticsConfig) => {
    setActiveComponents(prev => ({
      ...prev,
      [component]: !prev[component]
    }));
  };

  if (!isEnabled && showToggle) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`fixed bottom-4 right-16 z-50 ${positionClasses[position]}`}
      >
        <button
          onClick={() => setIsEnabled(true)}
          className="bg-crown-gold text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all"
          title="Enable Analytics Dashboard"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </button>
      </motion.div>
    );
  }

  return (
    <div className={`fixed ${positionClasses[position]} z-40`}>
      {/* Analytics Components */}
      {activeComponents.webVitals && <WebVitalsAnalytics />}
      {activeComponents.restaurantAnalytics && <RestaurantAnalytics />}
      {activeComponents.performanceOptimization && <PerformanceOptimizationDashboard />}
      {activeComponents.seoAnalysis && <SEOAnalysisDashboard />}

      {/* Analytics Control Panel */}
      {showToggle && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          className="fixed bottom-4 right-104 bg-white rounded-xl shadow-lg border border-gray-200 p-4 w-80"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Analytics Control</h3>
            <button
              onClick={() => setIsEnabled(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700">Web Vitals</label>
              <button
                onClick={() => toggleComponent('webVitals')}
                className={`w-10 h-6 rounded-full relative transition-colors ${
                  activeComponents.webVitals ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                    activeComponents.webVitals ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700">Restaurant Analytics</label>
              <button
                onClick={() => toggleComponent('restaurantAnalytics')}
                className={`w-10 h-6 rounded-full relative transition-colors ${
                  activeComponents.restaurantAnalytics ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                    activeComponents.restaurantAnalytics ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700">Performance Optimization</label>
              <button
                onClick={() => toggleComponent('performanceOptimization')}
                className={`w-10 h-6 rounded-full relative transition-colors ${
                  activeComponents.performanceOptimization ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                    activeComponents.performanceOptimization ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700">SEO Analysis</label>
              <button
                onClick={() => toggleComponent('seoAnalysis')}
                className={`w-10 h-6 rounded-full relative transition-colors ${
                  activeComponents.seoAnalysis ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                    activeComponents.seoAnalysis ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="text-xs text-blue-800">
              <div className="font-semibold mb-1">Sprint 3 Day 3: Performance Analytics</div>
              <div>Real-time monitoring and optimization tools for exceptional restaurant website performance.</div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

// Provider component for analytics configuration
export const AnalyticsProvider = ({ children, config }: { 
  children: React.ReactNode; 
  config?: Partial<AnalyticsConfig>;
}) => {
  return (
    <>
      {children}
      <AnalyticsIntegration 
        enabled={{
          webVitals: true,
          restaurantAnalytics: true,
          performanceOptimization: true,
          seoAnalysis: true,
          ...config
        }}
      />
    </>
  );
};

export default AnalyticsIntegration;
