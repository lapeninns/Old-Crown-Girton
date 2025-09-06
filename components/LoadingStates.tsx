"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Simplified loading state management
interface LoadingState {
  isHydrated: boolean;
  navbarLoaded: boolean;
  showcaseLoaded: boolean;
  contentReady: boolean;
}

interface LoadingContextType {
  loadingState: LoadingState;
  markNavbarLoaded: () => void;
  markShowcaseLoaded: () => void;
  markContentReady: () => void;
}

const LoadingContext = createContext<LoadingContextType | null>(null);

export function LoadingStateProvider({ children }: { children: ReactNode }) {
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isHydrated: false,
    navbarLoaded: false,
    showcaseLoaded: false,
    contentReady: false,
  });

  useEffect(() => {
    // Mark as hydrated and start navbar loading
    setLoadingState(prev => ({ ...prev, isHydrated: true }));
    
    // Auto-mark navbar as loaded after small delay
    const navbarTimer = setTimeout(() => {
      setLoadingState(prev => ({ ...prev, navbarLoaded: true }));
    }, 100);

    return () => clearTimeout(navbarTimer);
  }, []);

  const markNavbarLoaded = () => setLoadingState(prev => ({ ...prev, navbarLoaded: true }));
  const markShowcaseLoaded = () => setLoadingState(prev => ({ ...prev, showcaseLoaded: true }));
  const markContentReady = () => setLoadingState(prev => ({ ...prev, contentReady: true }));

  return (
    <LoadingContext.Provider 
      value={{
        loadingState,
        markNavbarLoaded,
        markShowcaseLoaded,
        markContentReady,
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoadingState() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoadingState must be used within LoadingStateProvider');
  }
  return context;
}

// Simplified sequential wrapper
export function SequentialContent({ 
  children, 
  waitFor, 
  delay = 0, 
  className = "",
  placeholder 
}: { 
  children: ReactNode;
  waitFor: 'hydration' | 'navbar' | 'showcase' | 'content';
  delay?: number;
  className?: string;
  placeholder?: ReactNode;
}) {
  const { loadingState } = useLoadingState();
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const canRender = (() => {
      switch (waitFor) {
        case 'hydration':
          return loadingState.isHydrated;
        case 'navbar':
          return loadingState.isHydrated && loadingState.navbarLoaded;
        case 'showcase':
          return loadingState.isHydrated && loadingState.navbarLoaded && loadingState.showcaseLoaded;
        case 'content':
          return loadingState.isHydrated && loadingState.navbarLoaded && loadingState.showcaseLoaded;
        default:
          return true;
      }
    })();

    if (canRender) {
      const timer = setTimeout(() => setShouldRender(true), delay);
      return () => clearTimeout(timer);
    }
  }, [loadingState, waitFor, delay]);

  if (!shouldRender) {
    return placeholder || (
      <div className={`bg-neutral-50 animate-pulse rounded ${className}`} style={{ minHeight: '100px' }} />
    );
  }

  return <div className={className}>{children}</div>;
}

// Simple completion marker
export function LoadingMarker({ phase }: { phase: 'navbar' | 'showcase' | 'content' }): null {
  const { markNavbarLoaded, markShowcaseLoaded, markContentReady } = useLoadingState();

  useEffect(() => {
    const timer = setTimeout(() => {
      switch (phase) {
        case 'navbar':
          markNavbarLoaded();
          break;
        case 'showcase':
          markShowcaseLoaded();
          break;
        case 'content':
          markContentReady();
          break;
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [phase, markNavbarLoaded, markShowcaseLoaded, markContentReady]);

  return null;
}