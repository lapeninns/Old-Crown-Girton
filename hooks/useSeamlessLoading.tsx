"use client";

import React, { useState, useEffect, createContext, useContext, useRef } from 'react';

/**
 * Seamless Progressive Loading System
 * Ultra-precise timing and resource management for zero loading delays
 */

interface LoadingStage {
  critical: boolean;    // Navbar, hero immediately visible
  aboveFold: boolean;   // About, testimonials, menu highlights
  belowFold: boolean;   // All other sections loaded on demand
}

interface LoadingManagerState {
  stage: LoadingStage;
  componentsLoaded: {
    navbar: boolean;
    hero: boolean;
    about: boolean;
    menuHighlights: boolean;
    testimonials: boolean;
    [key: string]: boolean;
  };
  resourcesPreloaded: {
    criticalImages: boolean;
    fonts: boolean;
    [key: string]: boolean;
  };
}

interface LoadingManagerContextType {
  state: LoadingManagerState;
  markComponentLoaded: (component: string) => void;
  markResourcePreloaded: (resource: string) => void;
  isComponentLoaded: (component: string) => boolean;
  isResourcePreloaded: (resource: string) => boolean;
}

const LoadingManagerContext = createContext<LoadingManagerContextType | null>(null);

export const useLoadingManager = () => {
  const context = useContext(LoadingManagerContext);
  if (!context) {
    throw new Error('useLoadingManager must be used within LoadingManagerProvider');
  }
  return context;
};

export const LoadingManagerProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [state, setState] = useState<LoadingManagerState>({
    stage: {
      critical: false,
      aboveFold: false,
      belowFold: false
    },
    componentsLoaded: {
      navbar: false,
      hero: false,
      about: false,
      menuHighlights: false,
      testimonials: false
    },
    resourcesPreloaded: {
      criticalImages: false,
      fonts: false
    }
  });

  const mountedRef = useRef(true);
  const observersRef = useRef<IntersectionObserver[]>([]);

  // Stage 1: Immediate critical loading
  useEffect(() => {
    let isMounted = true;

    const loadCritical = async () => {
      try {
        // Pre-load critical resources in parallel
        const criticalTasks = [
          preloadFonts(),
          preloadCriticalImages(),
          // Immediate navbar rendering (no delay for critical navigation)
          Promise.resolve().then(() => {
            if (!isMounted) return;
            setState(prev => ({
              ...prev,
              componentsLoaded: {
                ...prev.componentsLoaded,
                navbar: true
              },
              resourcesPreloaded: {
                ...prev.resourcesPreloaded,
                fonts: true
              }
            }));
          }),
          // Hero loads after minimal delay for smooth transition
          new Promise(resolve => setTimeout(resolve, 50)).then(() => {
            if (!isMounted) return;
            setState(prev => ({
              ...prev,
              componentsLoaded: {
                ...prev.componentsLoaded,
                hero: true
              },
              stage: { ...prev.stage, critical: true }
            }));
          })
        ];

        await Promise.allSettled(criticalTasks);
        
        if (isMounted) {
          // Mark critical resources as loaded
          setState(prev => ({
            ...prev,
            resourcesPreloaded: {
              ...prev.resourcesPreloaded,
              criticalImages: true
            }
          }));

          // Stage 2: Staggered above-fold content loading
          loadAboveFoldContent();
        }
      } catch (error) {
        console.warn('Critical resource loading failed:', error);
        // Continue with degraded experience
        if (isMounted) {
          setState(prev => ({
            ...prev,
            componentsLoaded: {
              ...prev.componentsLoaded,
              navbar: true,
              hero: true
            },
            stage: { ...prev.stage, critical: true }
          }));
          loadAboveFoldContent();
        }
      }
    };

    const loadAboveFoldContent = () => {
      if (!isMounted) return;
      
      // Staggered loading sequence for optimal perceived performance
      const loadingSequence = [
        { component: 'testimonials', delay: 100 },  // Load first for social proof
        { component: 'about', delay: 200 },          // Core content second
        { component: 'menuHighlights', delay: 300 }  // Interactive content last
      ];

      loadingSequence.forEach(({ component, delay }) => {
        setTimeout(() => {
          if (isMounted) {
            setState(prev => ({
              ...prev,
              componentsLoaded: {
                ...prev.componentsLoaded,
                [component]: true
              }
            }));
          }
        }, delay);
      });

      // Mark above-fold stage complete after all components are scheduled
      setTimeout(() => {
        if (isMounted) {
          setState(prev => ({
            ...prev,
            stage: { ...prev.stage, aboveFold: true }
          }));
          // Stage 3: Setup below-fold loading
          setupBelowFoldLoading();
        }
      }, 400); // Complete after all above-fold components
    };

    loadCritical();

    return () => {
      isMounted = false;
      mountedRef.current = false;
      observersRef.current.forEach(observer => observer.disconnect());
    };
  }, []);

  const setupBelowFoldLoading = () => {
    // Intersection observer for below-fold sections
    const belowFoldObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && mountedRef.current) {
            const sectionId = entry.target.getAttribute('data-section');
            if (sectionId) {
              setState(prev => ({
                ...prev,
                componentsLoaded: {
                  ...prev.componentsLoaded,
                  [sectionId]: true
                }
              }));
            }
          }
        });
      },
      { 
        threshold: 0.1, // Load when 10% visible
        rootMargin: '100px 0px' // Start loading 100px before entering viewport
      }
    );

    observersRef.current.push(belowFoldObserver);

    // Observe below-fold sections after DOM is ready
    setTimeout(() => {
      const belowFoldSections = document.querySelectorAll('[data-below-fold]');
      belowFoldSections.forEach(section => belowFoldObserver.observe(section));
      
      if (belowFoldSections.length > 0 && mountedRef.current) {
        setState(prev => ({
          ...prev,
          stage: { ...prev.stage, belowFold: true }
        }));
      }
    }, 100);
  };

  const markComponentLoaded = (component: string) => {
    if (!mountedRef.current) return;
    setState(prev => ({
      ...prev,
      componentsLoaded: {
        ...prev.componentsLoaded,
        [component]: true
      }
    }));
  };

  const markResourcePreloaded = (resource: string) => {
    if (!mountedRef.current) return;
    setState(prev => ({
      ...prev,
      resourcesPreloaded: {
        ...prev.resourcesPreloaded,
        [resource]: true
      }
    }));
  };

  const isComponentLoaded = (component: string) => {
    return state.componentsLoaded[component] ?? false;
  };

  const isResourcePreloaded = (resource: string) => {
    return state.resourcesPreloaded[resource] ?? false;
  };

  return (
    <LoadingManagerContext.Provider value={{
      state,
      markComponentLoaded,
      markResourcePreloaded,
      isComponentLoaded,
      isResourcePreloaded
    }}>
      {children}
    </LoadingManagerContext.Provider>
  );
};

// Helper functions for resource preloading
const preloadFonts = (): Promise<void> => {
  return new Promise((resolve) => {
    // Check if fonts are already loaded
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => resolve());
    } else {
      // Fallback for older browsers
      setTimeout(resolve, 50);
    }
  });
};

const preloadCriticalImages = (): Promise<void[]> => {
  const criticalImageUrls = [
    // Hero/slideshow images - first slide is critical
    '/images/slideshow/OldCrownGirtonBuilding.png',
    '/images/slideshow/interior/the-old-crown-pub-restaurant-interior-dining.jpg',
    '/images/slideshow/garden/family-friendly-pub-garden-with-picnic-tables.jpeg',
    '/images/slideshow/cars/electric-vehicle-charging-bays.png'
    // Add other critical above-fold images
  ];

  const preloadPromises = criticalImageUrls.map(url => {
    return new Promise<void>((resolve) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => resolve(); // Don't fail the whole loading process
      img.decoding = 'async';
      img.fetchPriority = 'high';
      img.src = url;
    });
  });

  return Promise.all(preloadPromises);
};

/**
 * Hook for components to register their loading state
 */
export const useComponentLoader = (componentName: string) => {
  const { markComponentLoaded, isComponentLoaded } = useLoadingManager();
  
  useEffect(() => {
    // Mark as loaded when component mounts
    const timer = setTimeout(() => {
      markComponentLoaded(componentName);
    }, 0);
    
    return () => clearTimeout(timer);
  }, [componentName, markComponentLoaded]);
  
  return {
    isLoaded: isComponentLoaded(componentName),
    markLoaded: () => markComponentLoaded(componentName)
  };
};

/**
 * Performance monitoring hook
 */
export const useLoadingPerformance = () => {
  useEffect(() => {
    // Measure loading performance
    const measureLoadingPerformance = () => {
      if (typeof window !== 'undefined' && 'performance' in window) {
        // Measure First Contentful Paint
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.name === 'first-contentful-paint') {
              console.log('FCP:', entry.startTime);
            }
            if (entry.name === 'largest-contentful-paint') {
              console.log('LCP:', entry.startTime);
            }
          });
        });
        
        try {
          observer.observe({ entryTypes: ['paint', 'largest-contentful-paint'] });
        } catch (e) {
          // Ignore if not supported
        }
      }
    };

    measureLoadingPerformance();
  }, []);
};
