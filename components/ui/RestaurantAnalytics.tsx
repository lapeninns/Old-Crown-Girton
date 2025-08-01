// Restaurant Analytics Suite - Menu engagement & conversion tracking
'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Restaurant-specific analytics interfaces
interface MenuItemAnalytics {
  id: string;
  name: string;
  category: string;
  views: number;
  interactions: number;
  averageViewTime: number;
  conversionRate: number;
  popularityScore: number;
  lastViewed: number;
}

interface ReservationFunnelAnalytics {
  step: string;
  visitors: number;
  conversions: number;
  conversionRate: number;
  averageTime: number;
  dropOffRate: number;
}

interface PWAEngagementMetrics {
  installPromptShown: number;
  installsCompleted: number;
  installConversionRate: number;
  pushNotificationSubscriptions: number;
  offlineUsage: number;
  sessionDuration: number;
  returnVisitorRate: number;
  serviceWorkerCacheHits: number;
}

interface UserBehaviorMetrics {
  scrollDepth: number;
  timeOnPage: number;
  bounceRate: number;
  clickHeatmap: Array<{ x: number; y: number; count: number }>;
  mostViewedSections: Array<{ section: string; views: number; timeSpent: number }>;
  deviceBreakdown: { mobile: number; tablet: number; desktop: number };
}

interface RestaurantAnalytics {
  menuItems: MenuItemAnalytics[];
  reservationFunnel: ReservationFunnelAnalytics[];
  pwaEngagement: PWAEngagementMetrics;
  userBehavior: UserBehaviorMetrics;
  totalVisitors: number;
  uniqueVisitors: number;
  averageSessionDuration: number;
  peakTrafficHours: Array<{ hour: number; visitors: number }>;
}

export const useRestaurantAnalytics = () => {
  const [analytics, setAnalytics] = useState<RestaurantAnalytics>({
    menuItems: [],
    reservationFunnel: [
      { step: 'Landing Page', visitors: 0, conversions: 0, conversionRate: 0, averageTime: 0, dropOffRate: 0 },
      { step: 'Menu Browse', visitors: 0, conversions: 0, conversionRate: 0, averageTime: 0, dropOffRate: 0 },
      { step: 'Reservation Form', visitors: 0, conversions: 0, conversionRate: 0, averageTime: 0, dropOffRate: 0 },
      { step: 'Confirmation', visitors: 0, conversions: 0, conversionRate: 0, averageTime: 0, dropOffRate: 0 }
    ],
    pwaEngagement: {
      installPromptShown: 0,
      installsCompleted: 0,
      installConversionRate: 0,
      pushNotificationSubscriptions: 0,
      offlineUsage: 0,
      sessionDuration: 0,
      returnVisitorRate: 0,
      serviceWorkerCacheHits: 0
    },
    userBehavior: {
      scrollDepth: 0,
      timeOnPage: 0,
      bounceRate: 0,
      clickHeatmap: [],
      mostViewedSections: [],
      deviceBreakdown: { mobile: 0, tablet: 0, desktop: 0 }
    },
    totalVisitors: 0,
    uniqueVisitors: 0,
    averageSessionDuration: 0,
    peakTrafficHours: []
  });

  const [isTracking, setIsTracking] = useState(false);
  const [sessionStartTime] = useState(Date.now());

  // Initialize analytics tracking
  const initializeAnalytics = useCallback(() => {
    if (typeof window === 'undefined' || isTracking) return;
    
    setIsTracking(true);
    
    // Load existing analytics from localStorage
    loadStoredAnalytics();
    
    // Track device type
    trackDeviceType();
    
    // Track user behavior
    trackScrollDepth();
    trackClickHeatmap();
    trackSectionViews();
    
    // Track menu interactions
    trackMenuItemViews();
    
    // Track PWA engagement
    trackPWAEngagement();
    
    // Track session duration
    trackSessionDuration();
    
    console.log('Restaurant analytics initialized');
  }, [isTracking]);

  // Load analytics data from localStorage
  const loadStoredAnalytics = () => {
    try {
      const stored = localStorage.getItem('restaurant-analytics');
      if (stored) {
        const data = JSON.parse(stored);
        setAnalytics(prevAnalytics => ({
          ...prevAnalytics,
          ...data,
          // Merge arrays properly
          menuItems: data.menuItems || [],
          reservationFunnel: data.reservationFunnel || prevAnalytics.reservationFunnel
        }));
      }
    } catch (error) {
      console.error('Error loading stored analytics:', error);
    }
  };

  // Save analytics data to localStorage
  const saveAnalytics = useCallback((data: Partial<RestaurantAnalytics>) => {
    try {
      const updated = { ...analytics, ...data };
      localStorage.setItem('restaurant-analytics', JSON.stringify(updated));
      setAnalytics(updated);
    } catch (error) {
      console.error('Error saving analytics:', error);
    }
  }, [analytics]);

  // Track device type
  const trackDeviceType = () => {
    const userAgent = navigator.userAgent;
    let deviceType: keyof typeof analytics.userBehavior.deviceBreakdown = 'desktop';
    
    if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
      deviceType = 'tablet';
    } else if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) {
      deviceType = 'mobile';
    }

    setAnalytics(prev => ({
      ...prev,
      userBehavior: {
        ...prev.userBehavior,
        deviceBreakdown: {
          ...prev.userBehavior.deviceBreakdown,
          [deviceType]: prev.userBehavior.deviceBreakdown[deviceType] + 1
        }
      }
    }));
  };

  // Track scroll depth
  const trackScrollDepth = () => {
    let maxScrollDepth = 0;
    
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      
      if (scrollPercent > maxScrollDepth) {
        maxScrollDepth = scrollPercent;
        setAnalytics(prev => ({
          ...prev,
          userBehavior: {
            ...prev.userBehavior,
            scrollDepth: Math.max(prev.userBehavior.scrollDepth, scrollPercent)
          }
        }));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  };

  // Track click heatmap
  const trackClickHeatmap = () => {
    const handleClick = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth) * 100;
      const y = (event.clientY / window.innerHeight) * 100;
      
      setAnalytics(prev => {
        const existingPoint = prev.userBehavior.clickHeatmap.find(
          point => Math.abs(point.x - x) < 5 && Math.abs(point.y - y) < 5
        );
        
        if (existingPoint) {
          existingPoint.count++;
          return prev;
        } else {
          return {
            ...prev,
            userBehavior: {
              ...prev.userBehavior,
              clickHeatmap: [...prev.userBehavior.clickHeatmap, { x, y, count: 1 }]
            }
          };
        }
      });
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  };

  // Track section views using Intersection Observer
  const trackSectionViews = () => {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionName = entry.target.getAttribute('data-section') || 
                              entry.target.className.split(' ')[0] || 
                              'unknown';
            
            setAnalytics(prev => {
              const existing = prev.userBehavior.mostViewedSections.find(s => s.section === sectionName);
              if (existing) {
                existing.views++;
                return prev;
              } else {
                return {
                  ...prev,
                  userBehavior: {
                    ...prev.userBehavior,
                    mostViewedSections: [
                      ...prev.userBehavior.mostViewedSections,
                      { section: sectionName, views: 1, timeSpent: 0 }
                    ]
                  }
                };
              }
            });
          }
        });
      },
      { threshold: 0.5 }
    );

    // Observe major sections
    setTimeout(() => {
      const sections = document.querySelectorAll('section, .hero-section, .menu-section, .about-section, .contact-section');
      sections.forEach(section => sectionObserver.observe(section));
    }, 1000);

    return () => sectionObserver.disconnect();
  };

  // Track menu item views and interactions
  const trackMenuItemViews = () => {
    const menuObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const menuItem = entry.target as HTMLElement;
            const itemId = menuItem.getAttribute('data-menu-id') || 
                          menuItem.querySelector('[data-menu-id]')?.getAttribute('data-menu-id');
            const itemName = menuItem.querySelector('h3, .menu-item-name')?.textContent;
            const category = menuItem.getAttribute('data-category') || 'uncategorized';
            
            if (itemId && itemName) {
              setAnalytics(prev => {
                const existingItem = prev.menuItems.find(item => item.id === itemId);
                if (existingItem) {
                  existingItem.views++;
                  existingItem.lastViewed = Date.now();
                  return prev;
                } else {
                  return {
                    ...prev,
                    menuItems: [
                      ...prev.menuItems,
                      {
                        id: itemId,
                        name: itemName,
                        category,
                        views: 1,
                        interactions: 0,
                        averageViewTime: 0,
                        conversionRate: 0,
                        popularityScore: 1,
                        lastViewed: Date.now()
                      }
                    ]
                  };
                }
              });
            }
          }
        });
      },
      { threshold: 0.7 }
    );

    // Observe menu items
    setTimeout(() => {
      const menuItems = document.querySelectorAll('.menu-item, [data-menu-id]');
      menuItems.forEach(item => menuObserver.observe(item));
    }, 2000);

    return () => menuObserver.disconnect();
  };

  // Track PWA engagement metrics
  const trackPWAEngagement = () => {
    // Track install prompt events
    window.addEventListener('beforeinstallprompt', () => {
      setAnalytics(prev => ({
        ...prev,
        pwaEngagement: {
          ...prev.pwaEngagement,
          installPromptShown: prev.pwaEngagement.installPromptShown + 1
        }
      }));
    });

    // Track app installs
    window.addEventListener('appinstalled', () => {
      setAnalytics(prev => ({
        ...prev,
        pwaEngagement: {
          ...prev.pwaEngagement,
          installsCompleted: prev.pwaEngagement.installsCompleted + 1,
          installConversionRate: (prev.pwaEngagement.installsCompleted + 1) / 
                                Math.max(prev.pwaEngagement.installPromptShown, 1) * 100
        }
      }));
    });

    // Track offline usage
    const trackOfflineUsage = () => {
      if (!navigator.onLine) {
        setAnalytics(prev => ({
          ...prev,
          pwaEngagement: {
            ...prev.pwaEngagement,
            offlineUsage: prev.pwaEngagement.offlineUsage + 1
          }
        }));
      }
    };

    window.addEventListener('online', trackOfflineUsage);
    window.addEventListener('offline', trackOfflineUsage);
  };

  // Track session duration
  const trackSessionDuration = () => {
    const updateSessionDuration = () => {
      const duration = Date.now() - sessionStartTime;
      setAnalytics(prev => ({
        ...prev,
        averageSessionDuration: duration,
        pwaEngagement: {
          ...prev.pwaEngagement,
          sessionDuration: duration
        }
      }));
    };

    // Update every 30 seconds
    const interval = setInterval(updateSessionDuration, 30000);
    
    // Update on page unload
    window.addEventListener('beforeunload', updateSessionDuration);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', updateSessionDuration);
    };
  };

  // Get top performing menu items
  const getTopMenuItems = (limit: number = 5): MenuItemAnalytics[] => {
    return analytics.menuItems
      .sort((a, b) => b.popularityScore - a.popularityScore)
      .slice(0, limit);
  };

  // Get conversion funnel data
  const getConversionFunnel = (): ReservationFunnelAnalytics[] => {
    return analytics.reservationFunnel.map((step, index) => ({
      ...step,
      dropOffRate: index > 0 
        ? ((analytics.reservationFunnel[index - 1].conversions - step.visitors) / 
           analytics.reservationFunnel[index - 1].conversions) * 100
        : 0
    }));
  };

  // Export analytics data
  const exportAnalytics = useCallback(() => {
    const exportData = {
      ...analytics,
      exportedAt: new Date().toISOString(),
      sessionDuration: Date.now() - sessionStartTime
    };

    // In production, send to your analytics service
    console.log('Restaurant analytics exported:', exportData);
    
    // Create downloadable file
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `restaurant-analytics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    return exportData;
  }, [analytics, sessionStartTime]);

  // Initialize on mount
  useEffect(() => {
    initializeAnalytics();
  }, [initializeAnalytics]);

  // Save analytics periodically
  useEffect(() => {
    const interval = setInterval(() => {
      saveAnalytics(analytics);
    }, 60000); // Save every minute

    return () => clearInterval(interval);
  }, [analytics, saveAnalytics]);

  return {
    analytics,
    isTracking,
    getTopMenuItems,
    getConversionFunnel,
    exportAnalytics,
    saveAnalytics
  };
};

// Restaurant Analytics Dashboard Component
export const RestaurantAnalyticsDashboard = () => {
  const { analytics, getTopMenuItems, getConversionFunnel, exportAnalytics } = useRestaurantAnalytics();
  const [activeTab, setActiveTab] = useState<'overview' | 'menu' | 'funnel' | 'pwa'>('overview');
  const [isExpanded, setIsExpanded] = useState(false);

  const totalMenuViews = analytics.menuItems.reduce((sum, item) => sum + item.views, 0);
  const averageEngagement = analytics.pwaEngagement.sessionDuration / 1000 / 60; // minutes

  if (!isExpanded) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed bottom-20 right-4 z-40"
      >
        <button
          onClick={() => setIsExpanded(true)}
          className="bg-crown-gold text-white rounded-full shadow-lg p-3 hover:shadow-xl transition-all"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className="fixed bottom-4 right-4 z-40 bg-white rounded-xl shadow-2xl border border-gray-200 w-80 max-h-96 overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">Restaurant Analytics</h3>
          <p className="text-xs text-gray-500">
            {totalMenuViews} menu views • {averageEngagement.toFixed(1)}min avg session
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={exportAnalytics}
            className="text-gray-400 hover:text-crown-gold"
            title="Export Data"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
          </button>
          <button
            onClick={() => setIsExpanded(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-100">
        {[
          { key: 'overview', label: 'Overview' },
          { key: 'menu', label: 'Menu' },
          { key: 'funnel', label: 'Funnel' },
          { key: 'pwa', label: 'PWA' }
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
                  <div className="text-gray-600">Total Visitors</div>
                  <div className="font-semibold text-lg">{analytics.totalVisitors}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <div className="text-gray-600">Avg Session</div>
                  <div className="font-semibold text-lg">{averageEngagement.toFixed(1)}m</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <div className="text-gray-600">Menu Views</div>
                  <div className="font-semibold text-lg">{totalMenuViews}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <div className="text-gray-600">PWA Installs</div>
                  <div className="font-semibold text-lg">{analytics.pwaEngagement.installsCompleted}</div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-gray-700 mb-2">Device Breakdown</h4>
                <div className="space-y-1">
                  {Object.entries(analytics.userBehavior.deviceBreakdown).map(([device, count]) => (
                    <div key={device} className="flex justify-between text-xs">
                      <span className="capitalize">{device}</span>
                      <span className="font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'menu' && (
            <motion.div
              key="menu"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              <h4 className="text-xs font-semibold text-gray-700">Top Menu Items</h4>
              <div className="space-y-2">
                {getTopMenuItems(5).map((item, index) => (
                  <div key={item.id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="w-4 h-4 bg-crown-gold text-white rounded-full flex items-center justify-center text-[10px]">
                        {index + 1}
                      </span>
                      <span className="truncate max-w-32">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{item.views}</div>
                      <div className="text-gray-500">{item.category}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'funnel' && (
            <motion.div
              key="funnel"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              <h4 className="text-xs font-semibold text-gray-700">Conversion Funnel</h4>
              <div className="space-y-2">
                {getConversionFunnel().map((step, index) => (
                  <div key={step.step} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>{step.step}</span>
                      <span className="font-medium">{step.visitors} visitors</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-crown-gold h-2 rounded-full transition-all"
                        style={{ width: `${step.conversionRate}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-gray-500">
                      {step.conversionRate.toFixed(1)}% conversion
                      {step.dropOffRate > 0 && ` • ${step.dropOffRate.toFixed(1)}% drop-off`}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'pwa' && (
            <motion.div
              key="pwa"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-gray-50 rounded-lg p-2">
                  <div className="text-gray-600">Install Rate</div>
                  <div className="font-semibold">{analytics.pwaEngagement.installConversionRate.toFixed(1)}%</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <div className="text-gray-600">Offline Usage</div>
                  <div className="font-semibold">{analytics.pwaEngagement.offlineUsage}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <div className="text-gray-600">Push Subs</div>
                  <div className="font-semibold">{analytics.pwaEngagement.pushNotificationSubscriptions}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <div className="text-gray-600">Cache Hits</div>
                  <div className="font-semibold">{analytics.pwaEngagement.serviceWorkerCacheHits}</div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-gray-700 mb-2">PWA Performance</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Install Prompts Shown</span>
                    <span className="font-medium">{analytics.pwaEngagement.installPromptShown}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Successful Installs</span>
                    <span className="font-medium">{analytics.pwaEngagement.installsCompleted}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Return Visitors</span>
                    <span className="font-medium">{analytics.pwaEngagement.returnVisitorRate.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default RestaurantAnalyticsDashboard;
