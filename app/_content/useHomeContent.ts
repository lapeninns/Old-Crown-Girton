import { useState, useEffect } from 'react';
import { useContent } from '@/hooks/useContent';

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
  const { data: content, loading, error } = useContent();
  const [homeContent, setHomeContent] = useState<HomeContent | null>(null);

  useEffect(() => {
    async function loadHomeContent() {
      // First try to get home content from main content API
      if (content?.pages?.home) {
        // Map the main content structure to our expected format
        const mainHomeContent = content.pages.home;
        
        // Create the expected structure from main content
        const mappedContent: HomeContent = {
          meta: {
            title: mainHomeContent.hero?.title || 'The Old Crown Girton - Nepalese & British Cuisine',
            description: mainHomeContent.hero?.description || 'Historic thatched pub serving authentic cuisine'
          },
          aboutSection: {
            title: 'Welcome to Old Crown',
            titleAccent: 'Old Crown',
            description: [
              mainHomeContent.hero?.subtitle || 'Historic thatched pub in Girton combining authentic Nepalese cuisine with British pub classics',
              mainHomeContent.hero?.description || 'A welcoming spot for locals, families, students, and visitors.'
            ],
            features: {
              title: mainHomeContent.sections?.features?.title || 'Why Guests Visit',
              items: mainHomeContent.sections?.features?.items?.map((item: any) => item.title) || [
                'Authentic Nepalese cuisine', 'Historic thatched setting', 'Welcoming atmosphere'
              ]
            },
            images: {
              main: '/restaurant-interior.jpg',
              alt: 'Old Crown restaurant interior'
            }
          },
          menuHighlights: {
            title: 'Our Signature Dishes',
            titleAccent: 'Signature',
            subtitle: 'A taste of what we offer',
            ctaLabel: 'View Full Menu',
            ctaLink: '/menu',
            featuredDishes: []
          }
        };
        
        setHomeContent(mappedContent);
      } else if (!loading && !content) {
        // Fallback content if main content API fails
        console.warn('Main content API failed, using hardcoded fallback');
        
        // Use hardcoded fallback content directly
        setHomeContent({
          meta: {
            title: 'The Old Crown Girton - Nepalese & British Cuisine',
            description: 'Historic thatched pub serving authentic cuisine'
          },
          aboutSection: {
            title: 'Welcome to Old Crown',
            titleAccent: 'Old Crown',
            description: ['Historic thatched pub in Girton combining authentic Nepalese cuisine with British pub classics'],
            features: {
              title: 'Why Guests Visit',
              items: ['Authentic Nepalese cuisine', 'Historic thatched setting', 'Welcoming atmosphere']
            },
            images: {
              main: '/restaurant-interior.jpg',
              alt: 'Old Crown restaurant interior'
            }
          },
          menuHighlights: {
            title: 'Our Signature Dishes',
            titleAccent: 'Signature',
            subtitle: 'A taste of what we offer',
            ctaLabel: 'View Full Menu',
            ctaLink: '/menu',
            featuredDishes: []
          }
        });
      }
    }

    loadHomeContent();
  }, [content, loading]);

  return homeContent;
}