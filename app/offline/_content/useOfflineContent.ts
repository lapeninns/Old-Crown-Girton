import { useState, useEffect } from 'react';

interface OfflineContent {
  meta: {
    title: string;
    description: string;
  };
  ui: {
    title: string;
    description: string;
    connectionStatus: {
      offline: string;
      connecting: string;
      online: string;
    };
    buttons: {
      home: string;
      tryAgain: string;
      goBack: string;
    };
  };
  features: {
    title: string;
    availableFeatures: string[];
  };
  messaging: {
    statusMessages: {
      offline: string;
      reconnecting: string;
      online: string;
    };
  };
}

export function useOfflineContent(): OfflineContent | null {
  const [content, setContent] = useState<OfflineContent | null>(null);

  useEffect(() => {
    async function loadContent() {
      try {
        // Load content directly from local file since API endpoint was removed
        const { default: fallbackContent } = await import('./offline-content.json');
        setContent(fallbackContent);
      } catch (error) {
        // Use inline fallback as last resort
        setContent({
          meta: {
            title: "You're Offline",
            description: "Offline functionality page"
          },
          ui: {
            title: "You're Offline",
            description: "It looks like you've lost your internet connection.",
            connectionStatus: {
              offline: "Offline",
              connecting: "Reconnecting...",
              online: "Connected"
            },
            buttons: {
              home: "Go Home",
              tryAgain: "Try Again",
              goBack: "Go Back"
            }
          },
          features: {
            title: "Available Offline:",
            availableFeatures: [
              "Previously viewed menu items",
              "Restaurant information",
              "Contact details"
            ]
          },
          messaging: {
            statusMessages: {
              offline: "You are currently offline",
              reconnecting: "Attempting to reconnect...",
              online: "Connection restored"
            }
          }
        });
      }
    }

    loadContent();
  }, []);

  return content;
}