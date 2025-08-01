// Client-side service worker registration
'use client';

import { useEffect } from 'react';
import { useServiceWorker } from './PWAUtils';

const ServiceWorkerManager = (): null => {
  const { isSupported, isRegistered, updateAvailable, updateServiceWorker } = useServiceWorker();

  useEffect(() => {
    if (updateAvailable) {
      // Dispatch custom event for update notification
      window.dispatchEvent(new CustomEvent('sw-update-available'));
    }
  }, [updateAvailable]);

  useEffect(() => {
    if (isRegistered) {
      console.log('[PWA] Service Worker is active');
      
      // Prefetch critical pages for offline access
      const criticalPages = ['/menu', '/about', '/contact', '/events'];
      
      criticalPages.forEach(page => {
        fetch(page).catch(() => {
          // Silently fail - this is just prefetching
        });
      });
    }
  }, [isRegistered]);

  // This component doesn't render anything
  return null;
};

export default ServiceWorkerManager;
