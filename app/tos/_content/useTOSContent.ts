import { useState, useEffect } from 'react';

interface TOSContent {
  meta: {
    effectiveDate: string;
    title: string;
    contactEmail: string;
    businessName: string;
  };
  introduction: string;
  policies: {
    cancellation: string;
    deposit: string;
  };
  sections: {
    [key: string]: {
      title: string;
      content?: string;
      items?: string[];
    };
  };
}

export function useTOSContent(): TOSContent | null {
  const [content, setContent] = useState<TOSContent | null>(null);

  useEffect(() => {
    async function loadContent() {
      try {
        // Load content directly from local file since API endpoint was removed
        const { default: fallbackContent } = await import('./tos-content.json');
        setContent(processContent(fallbackContent));
      } catch (error) {
        // Use inline fallback as last resort
        setContent({
          meta: {
            effectiveDate: "10 August 2025",
            title: "Terms of Service",
            contactEmail: "oldcrown@lapeninns.com",
            businessName: "The Old Crown Girton"
          },
          introduction: "These Terms govern your use of this website.",
          policies: {
            cancellation: "24 hours notice required for groups of 6 or more.",
            deposit: "Deposits may apply for private events."
          },
          sections: {}
        });
      }
    }

    loadContent();
  }, []);

  return content;
}

// Process content by substituting template variables
function processContent(rawContent: any): TOSContent {
  const processed = JSON.parse(JSON.stringify(rawContent));
  
  // Template substitutions
  const substitutions = {
    '{{cancellation_policy}}': processed.policies.cancellation,
    '{{deposit_policy}}': processed.policies.deposit,
    '{{contact_email}}': processed.meta.contactEmail,
    '{{business_name}}': processed.meta.businessName
  };
  
  // Apply substitutions to all section content
  Object.keys(processed.sections).forEach(sectionKey => {
    const section = processed.sections[sectionKey];
    if (section.content) {
      Object.entries(substitutions).forEach(([template, value]) => {
        section.content = section.content.replace(new RegExp(template, 'g'), value);
      });
    }
  });
  
  return processed;
}