'use client';

import React from 'react';
import { useServiceWorker } from './ui/PWAUtils';

/**
 * React component for service worker update notification
 */
export function ServiceWorkerUpdateNotification() {
  const { updateAvailable, updateServiceWorker } = useServiceWorker();

  if (!updateAvailable) return null;

  return (
    <div
      className="fixed bottom-4 right-4 bg-accent-500 text-white p-4 rounded-lg shadow-lg z-50"
      role="alert"
    >
      <p className="mb-2">A new version is available!</p>
      <button
        className="bg-white text-accent-500 px-3 py-1 rounded text-sm font-medium hover:bg-gray-50 transition-colors"
        onClick={updateServiceWorker}
      >
        Update Now
      </button>
    </div>
  );
}