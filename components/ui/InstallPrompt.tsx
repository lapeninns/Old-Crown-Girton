// PWA Install Prompt Component
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInstallPrompt, usePWAMetrics, useServiceWorker } from './PWAUtils';
import { AnimatedButton } from './MicroInteractions';

interface InstallPromptProps {
  onInstall?: () => void;
  onDismiss?: () => void;
}

const InstallPrompt = ({ onInstall, onDismiss }: InstallPromptProps) => {
  const { isInstallable, isInstalled, promptInstall } = useInstallPrompt();
  const { trackInstallSource } = usePWAMetrics();
  const [showPrompt, setShowPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if user has dismissed the prompt recently
    const dismissedTime = localStorage.getItem('pwa-install-dismissed');
    const daysSinceDismissed = dismissedTime 
      ? (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60 * 24)
      : 999;

    // Show prompt if installable and not recently dismissed
    if (isInstallable && !isInstalled && daysSinceDismissed > 7) {
      // Show after a short delay to avoid being intrusive
      const timer = setTimeout(() => setShowPrompt(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [isInstallable, isInstalled]);

  const handleInstall = async () => {
    trackInstallSource('banner-prompt');
    const success = await promptInstall();
    
    if (success) {
      setShowPrompt(false);
      onInstall?.();
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setDismissed(true);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
    onDismiss?.();
  };

  if (!showPrompt || dismissed || isInstalled) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 100, scale: 0.9 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md"
      >
        <div className="bg-neutral-50 rounded-2xl shadow-2xl border border-neutral-200 p-6 relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-brand-50/10" />
          
          {/* Content */}
          <div className="relative">
            <div className="flex items-start space-x-4">
              {/* App icon */}
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L13.09 8.26L22 9L17.5 13.74L22.18 17.02L12 15L1.82 17.02L6.5 13.74L2 9L10.91 8.26L12 2Z" />
                  </svg>
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-stout-700 mb-1">
                  Install Old Crown App
                </h3>
                <p className="text-sm text-brand-600 mb-4 leading-relaxed">
                  Get the full restaurant experience! Fast access to our menu, table booking, and offline browsing.
                </p>
                
                {/* Features */}
                <div className="space-y-1 mb-4">
                  <div className="flex items-center text-xs text-neutral-500">
                    <svg className="w-3 h-3 text-cardamom-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Works offline • Fast loading • Native experience
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-3">
                  <AnimatedButton
                    variant="primary"
                    size="sm"
                    onClick={handleInstall}
                    className="flex-1 text-center"
                  >
                    Install App
                  </AnimatedButton>
                  
                  <button
                    onClick={handleDismiss}
                    className="px-4 py-2 text-sm text-neutral-500 hover:text-brand-600 transition-colors"
                  >
                    Not now
                  </button>
                </div>
              </div>

              {/* Close button */}
              <button
                onClick={handleDismiss}
                className="flex-shrink-0 p-1 text-neutral-400 hover:text-brand-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// Compact install button for header/navigation
export const InstallButton = () => {
  const { isInstallable, isInstalled, promptInstall } = useInstallPrompt();
  const { trackInstallSource } = usePWAMetrics();

  if (!isInstallable || isInstalled) return null;

  const handleInstall = async () => {
    trackInstallSource('header-button');
    await promptInstall();
  };

  return (
    <motion.button
      onClick={handleInstall}
  className="flex items-center space-x-2 px-4 py-2 bg-accent hover:bg-accent-700 text-white rounded-full text-sm font-medium transition-colors shadow-lg"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
      </svg>
      <span>Install App</span>
    </motion.button>
  );
};

// Offline notification component
export const OfflineNotification = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleOffline = () => setIsVisible(true);
    const handleOnline = () => setIsVisible(false);

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    // Check initial state
    if (!navigator.onLine) setIsVisible(true);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          className="fixed top-0 left-0 right-0 z-50 bg-accent-500 text-white px-4 py-3 text-center text-sm font-medium"
        >
          <div className="flex items-center justify-center space-x-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>You&apos;re offline. Some features may not work.</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Update available notification
export const UpdateNotification = () => {
  const { updateAvailable, updateServiceWorker } = useServiceWorker();
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);

  useEffect(() => {
    if (updateAvailable) {
      setShowUpdatePrompt(true);
    }
  }, [updateAvailable]);

  const handleUpdate = async () => {
    await updateServiceWorker();
    setShowUpdatePrompt(false);
    // Refresh the page to apply updates
    window.location.reload();
  };

  if (!showUpdatePrompt) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed bottom-4 right-4 bg-secondary-600 text-white p-4 rounded-lg shadow-lg max-w-sm z-50"
    >
      <p className="text-sm mb-3">App update available! Update now for the latest features.</p>
      <div className="flex space-x-2">
        <button
          onClick={handleUpdate}
          className="bg-neutral-50 text-secondary-600 px-3 py-1 rounded text-sm font-medium"
        >
          Update
        </button>
        <button
          onClick={() => setShowUpdatePrompt(false)}
          className="border border-white/20 px-3 py-1 rounded text-sm"
        >
          Later
        </button>
      </div>
    </motion.div>
  );
};

export default InstallPrompt;
