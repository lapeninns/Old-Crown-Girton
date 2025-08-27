import { useState, useEffect } from 'react';

interface HomeContent {
  meta: {
    title: string;
    description: string;
  };
  aboutSection: {
    title: string;
    titleAccent: string;
    description: string[];
    features: {
      title: string;
      items: string[];
    };
    images: {
      main: string;
      alt: string;
    };
  };
  menuHighlights: {
    title: string;
    titleAccent: string;
    subtitle: string;
    ctaLabel: string;
    ctaLink: string;
    featuredDishes: Array<{
      title: string;
      description: string;
      price: string;
      image: string;
      spiceLevel: 'mild' | 'medium' | 'hot';
    }>;
  };
}

export function useHomeContent(): HomeContent | null {
  const [content, setContent] = useState<HomeContent | null>(null);

  useEffect(() => {
    async function loadContent() {
      try {
        const response = await fetch('/api/home-content');
        if (response.ok) {
          const data = await response.json();
          setContent(data);
        } else {
          // Fallback to local import
          const { default: fallbackContent } = await import('./home-content.json');
          setContent(fallbackContent as HomeContent);
        }
      } catch (error) {
        console.error('Failed to load home content:', error);
        // Use inline fallback as last resort
        setContent({
          meta: {
            title: "The Old Crown Girton",
            description: "Historic thatched pub with Nepalese & British cuisine"
          },
          aboutSection: {
            title: "Welcome to Old Crown",
            titleAccent: "Old Crown",
            description: [
              "Girton's historic thatched pub just outside Cambridge.",
              "A welcoming spot for locals, families, students, and visitors."
            ],
            features: {
              title: "Why Guests Visit",
              items: [
                "Distinctive thatched setting",
                "Authentic Nepalese flavour + pub classics",
                "Inclusive for mixed groups & families"
              ]
            },
            images: {
              main: "/restaurant-interior.jpg",
              alt: "Old Crown restaurant interior"
            }
          },
          menuHighlights: {
            title: "Our Signature Dishes",
            titleAccent: "Signature",
            subtitle: "A taste of what we offer",
            ctaLabel: "View Full Menu",
            ctaLink: "/menu",
            featuredDishes: []
          }
        });
      }
    }

    loadContent();
  }, []);

  return content;
}