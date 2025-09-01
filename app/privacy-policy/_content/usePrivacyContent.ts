import { useState, useEffect } from 'react';
import { fetchWithResilience } from '@/src/lib/data/fetchWithResilience';

interface PrivacyContent {
  meta: {
    effectiveDate: string;
    title: string;
    contactEmail: string;
  };
  introduction: string;
  sections: {
    [key: string]: {
      title: string;
      content?: string;
      items?: string[] | Array<{ term: string; description: string }>;
      intro?: string;
    };
  };
}

export function usePrivacyContent(): PrivacyContent | null {
  const [content, setContent] = useState<PrivacyContent | null>(null);

  useEffect(() => {
    async function loadContent() {
      try {
  const response = await fetchWithResilience('/api/privacy-content');
        if (response.ok) {
          const data = await response.json();
          setContent(data);
        } else {
          // Fallback to local import
          const { default: fallbackContent } = await import('./privacy-content.json');
          setContent(fallbackContent);
        }
      } catch (error) {
        // Use inline fallback as last resort
        setContent({
          meta: {
            effectiveDate: "10 August 2025",
            title: "Privacy Policy",
            contactEmail: "oldcrown@lapeninns.com"
          },
          introduction: "We respect your privacy and handle personal information responsibly.",
          sections: {}
        });
      }
    }

    loadContent();
  }, []);

  return content;
}