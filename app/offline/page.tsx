// Offline page for PWA
import { Metadata } from 'next';
import OfflineActions from './OfflineActions';

export const metadata: Metadata = {
  title: 'Offline - Old Crown Restaurant',
  description: 'You are currently offline. Some features may not be available.',
  robots: 'noindex',
};

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Offline icon */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto bg-accent/10 rounded-full flex items-center justify-center">
            <svg 
              className="w-12 h-12 text-accent" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" 
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-stout-700 mb-4 font-display">
          You&apos;re Offline
        </h1>

        {/* Description */}
        <p className="text-brand-600 mb-8 leading-relaxed">
          It looks like you&apos;ve lost your internet connection. Don&apos;t worry - the Old Crown Restaurant app works offline for pages you&apos;ve already visited.
        </p>

        {/* Features available offline */}
        <div className="bg-neutral-50 rounded-xl p-6 shadow-sm border border-neutral-200 mb-8">
          <h2 className="text-lg font-semibold text-stout-700 mb-4">
            Available Offline:
          </h2>
          
          <div className="space-y-3 text-left">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-cardamom-500 rounded-full"></div>
              <span className="text-sm text-brand-600">Previously viewed menu items</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-cardamom-500 rounded-full"></div>
              <span className="text-sm text-brand-600">Restaurant information</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-cardamom-500 rounded-full"></div>
              <span className="text-sm text-brand-600">Contact details</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-accent-500 rounded-full"></div>
              <span className="text-sm text-brand-600">Form submissions (will sync when online)</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <OfflineActions />

        {/* Tips */}
        <div className="mt-8 p-4 bg-secondary-50 rounded-lg border border-secondary-200">
          <h3 className="text-sm font-semibold text-secondary-800 mb-2">Tips:</h3>
          <ul className="text-xs text-secondary-700 space-y-1 text-left">
            <li>• Check your internet connection</li>
            <li>• Try connecting to Wi-Fi</li>
            <li>• Visit our menu page when online for offline access</li>
            <li>• Form submissions will be sent automatically when reconnected</li>
          </ul>
        </div>

        {/* Connection status indicator */}
        <div className="mt-6">
          <div id="connection-status" className="text-sm text-neutral-500">
            <span className="inline-block w-2 h-2 bg-crimson-500 rounded-full mr-2"></span>
            Offline
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
  <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-accent/5 rounded-full"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-stout-700/5 rounded-full"></div>
      </div>

      {/* Auto-reconnect script */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            // Auto-reload when connection is restored
            function updateConnectionStatus() {
              const statusEl = document.getElementById('connection-status');
              if (navigator.onLine) {
                statusEl.innerHTML = '<span class="inline-block w-2 h-2 bg-cardamom-500 rounded-full mr-2"></span>Online - Reloading...';
                setTimeout(() => window.location.reload(), 1000);
              } else {
                statusEl.innerHTML = '<span class="inline-block w-2 h-2 bg-crimson-500 rounded-full mr-2"></span>Offline';
              }
            }

            window.addEventListener('online', updateConnectionStatus);
            window.addEventListener('offline', updateConnectionStatus);
            
            // Check every 5 seconds
            setInterval(() => {
              if (navigator.onLine) {
                updateConnectionStatus();
              }
            }, 5000);
          `
        }}
      />
    </div>
  );
}
