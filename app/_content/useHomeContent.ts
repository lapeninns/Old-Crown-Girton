import { useState, useEffect } from 'react';
import { useContent } from '@/hooks/useContent';
import { Images } from '@/src/lib/images';

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

// Synchronous default content to avoid initial nulls and layout jumps
const DEFAULT_HOME_CONTENT: HomeContent = {
  meta: {
    title: 'The Old Crown Girton - Nepalese & British Cuisine',
    description: 'Historic thatched pub serving authentic cuisine',
  },
  aboutSection: {
    title: 'Welcome to Old Crown',
    titleAccent: 'Old Crown',
    description: [
      "Experience Cambridge's most unique dining destination: England's largest thatched pub combining 16th-century heritage with authentic Himalayan flavours in the heart of Girton village.",
      "While we don't currently serve a traditional Sunday roast, our authentic Nepalese cuisine (including momo and slow-cooked favourites) and British pub classics make hearty Sunday roast alternatives for Cambridge families, students, and visitors.",
      "Our expansive beer garden, live sports coverage, dog-friendly atmosphere, and convenient free parking make us the perfect destination for family gatherings, business lunches, student socials, and memorable dining experiences just minutes from Cambridge city centre.",
    ],
    features: {
      title: 'Why Cambridge Chooses The Old Crown',
      items: [
        "England's largest thatched pub with 16th-century heritage",
        "Cambridge's most authentic Nepalese & Himalayan cuisine",
        'Expansive beer garden with free parking (rare in Cambridge)',
        'Live sports, dog-friendly, perfect for students & families',
        'Historic Girton village location, easy access from Cambridge',
        'Sunday roast alternatives: Himalayan-inspired comfort dishes (no traditional Sunday roast served)',
      ],
    },
    images: {
      main: '/restaurant-interior.jpg',
      alt: "Historic thatched interior of The Old Crown Girton featuring authentic Nepalese dining in Cambridge's most characterful pub",
    },
  },
  menuHighlights: {
    title: 'Our Signature Dishes',
    titleAccent: 'Signature',
    subtitle: 'A taste of what we offer',
    ctaLabel: 'View Full Menu',
    ctaLink: '/menu',
    featuredDishes: [
      {
        title: 'Crispy Hot Wings',
        description: 'Spiced grilled chicken wings with our signature marinade',
        price: '£7.25',
        image: Images.dishes.wings,
        spiceLevel: 'medium' as const,
      },
      {
        title: 'Himali Lamb',
        description:
          'Green curry seasoned with Himalayan salt and yoghurt blend with fresh mint, green chilli and Nepalese spice',
        price: '£14.00',
        image: Images.dishes.himaliLamb,
        spiceLevel: 'hot' as const,
      },
      {
        title: 'Khasi Ko Masu (Goat Curry)',
        description:
          'A rich and flavoursome slow cooked goat on the bone/off the bone with unique blend of Nepalese spices',
        price: '£14.00',
        image: Images.dishes.goatCurry,
        spiceLevel: 'hot' as const,
      },
      {
        title: 'Chicken Bhuna',
        description:
          'Traditional spiced curry with tender chicken pieces in a rich, thick sauce',
        price: '£11.00',
        image: Images.dishes.chickenBhuna,
        spiceLevel: 'medium' as const,
      },
      {
        title: 'Chicken Curry',
        description: 'Classic home-style curry with tender chicken in aromatic spices',
        price: '£11.00',
        image: Images.dishes.chickenCurry,
        spiceLevel: 'medium' as const,
      },
      {
        title: 'Vindaloo',
        description:
          'Fiery hot curry with potatoes in a tangy, spiced sauce - for the brave!',
        price: '£11.00',
        image: Images.dishes.vindaloo,
        spiceLevel: 'hot' as const,
      },
    ],
  },
};

export function useHomeContent(): HomeContent {
  const { data: content } = useContent();
  // Start with default content so sections can render immediately
  const [homeContent, setHomeContent] = useState<HomeContent>(DEFAULT_HOME_CONTENT);

  useEffect(() => {
    async function loadHomeContent() {
      // If API content is available, map it; otherwise keep default
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
              'Experience Cambridge\'s most unique dining destination: England\'s largest thatched pub combining 16th-century heritage with authentic Himalayan flavours in the heart of Girton village.',
              'While we don\'t currently serve a traditional Sunday roast, our authentic Nepalese cuisine (including momo and slow-cooked favourites) and British pub classics make hearty Sunday roast alternatives for Cambridge families, students, and visitors.',
              'Our expansive beer garden, live sports coverage, dog-friendly atmosphere, and convenient free parking make us the perfect destination for family gatherings, business lunches, student socials, and memorable dining experiences just minutes from Cambridge city centre.'
            ],
            features: {
              title: 'Why Cambridge Chooses The Old Crown',
              items: [
                'England\'s largest thatched pub with 16th-century heritage',
                'Cambridge\'s most authentic Nepalese & Himalayan cuisine',
                'Expansive beer garden with free parking (rare in Cambridge)',
                'Live sports, dog-friendly, perfect for students & families',
                'Historic Girton village location, easy access from Cambridge',
                'Sunday roast alternatives: Himalayan-inspired comfort dishes (no traditional Sunday roast served)'
              ]
            },
            images: {
              main: '/restaurant-interior.jpg',
              alt: 'Historic thatched interior of The Old Crown Girton featuring authentic Nepalese dining in Cambridge\'s most characterful pub'
            }
          },
          menuHighlights: {
            title: 'Our Signature Dishes',
            titleAccent: 'Signature',
            subtitle: 'A taste of what we offer',
            ctaLabel: 'View Full Menu',
            ctaLink: '/menu',
            featuredDishes: [
              {
                title: 'Crispy Hot Wings',
                description: 'Spiced grilled chicken wings with our signature marinade',
                price: '£7.25',
                image: Images.dishes.wings,
                spiceLevel: 'medium' as const,
              },
              {
                title: 'Himali Lamb',
                description: 'Green curry seasoned with Himalayan salt and yoghurt blend with fresh mint, green chilli and Nepalese spice',
                price: '£14.00',
                image: Images.dishes.himaliLamb,
                spiceLevel: 'hot' as const,
              },
              {
                title: 'Khasi Ko Masu (Goat Curry)',
                description: 'A rich and flavoursome slow cooked goat on the bone/off the bone with unique blend of Nepalese spices',
                price: '£14.00',
                image: Images.dishes.goatCurry,
                spiceLevel: 'hot' as const,
              },
              {
                title: 'Chicken Bhuna',
                description: 'Traditional spiced curry with tender chicken pieces in a rich, thick sauce',
                price: '£11.00',
                image: Images.dishes.chickenBhuna,
                spiceLevel: 'medium' as const,
              },
              {
                title: 'Chicken Curry',
                description: 'Classic home-style curry with tender chicken in aromatic spices',
                price: '£11.00',
                image: Images.dishes.chickenCurry,
                spiceLevel: 'medium' as const,
              },
              {
                title: 'Vindaloo',
                description: 'Fiery hot curry with potatoes in a tangy, spiced sauce - for the brave!',
                price: '£11.00',
                image: Images.dishes.vindaloo,
                spiceLevel: 'hot' as const,
              }
            ]
          }
        };
        
        setHomeContent(mappedContent);
      }
    }

    loadHomeContent();
  }, [content]);

  return homeContent;
}
