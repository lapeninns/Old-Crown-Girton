'use client';

import React, { useEffect } from 'react';
import { ServiceWorkerUpdateNotification } from './ServiceWorkerUpdateNotification';

/**
 * Service Worker Provider Component
 * Handles service worker initialization and update notifications
 */
export default function ServiceWorkerProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Service worker is already handled by PWAUtils
    console.log('Service worker provider initialized');
  }, []);

  return (
    <>
      {children}
      <ServiceWorkerUpdateNotification />
    </>
  );
}