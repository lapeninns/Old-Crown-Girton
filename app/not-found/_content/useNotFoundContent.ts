import { useState, useEffect } from 'react';

interface NotFoundContent {
  meta: {
    title: string;
    description: string;
  };
  ui: {
    title: string;
    subtitle: string;
    description: string;
    suggestionsTitle: string;
    suggestions: string[];
    buttons: {
      home: string;
      menu: string;
      support: string;
    };
  };
  messaging: {
    errorCode: string;
    technicalDescription: string;
  };
}

export function useNotFoundContent(): NotFoundContent | null {
  const [content, setContent] = useState<NotFoundContent | null>(null);

  useEffect(() => {
    async function loadContent() {
      try {
        // Load content directly from local file since API endpoint was removed
        const { default: fallbackContent } = await import('./not-found-content.json');
        setContent(fallbackContent);
      } catch (error) {
        // Use inline fallback as last resort
        setContent({
          meta: {
            title: "Page Not Found - 404",
            description: "404 error page"
          },
          ui: {
            title: "Page Not Found",
            subtitle: "Oops! This page seems to have wandered off",
            description: "The page you're looking for doesn't exist.",
            suggestionsTitle: "What you can try:",
            suggestions: [
              "Check the URL for typos",
              "Use the navigation menu",
              "Visit our homepage",
              "Contact us for help"
            ],
            buttons: {
              home: "Go Home",
              menu: "View Menu",
              support: "Get Help"
            }
          },
          messaging: {
            errorCode: "404",
            technicalDescription: "The requested resource could not be found."
          }
        });
      }
    }

    loadContent();
  }, []);

  return content;
}