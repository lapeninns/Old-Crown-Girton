// Restaurant Schema Markup - Comprehensive structured data implementation
'use client';

import React, { useEffect } from 'react';
import imgExteriorGarden from '@cimages/Slideshow/exterior/the-old-crown-pub-exterior-and-beer-garden.jpeg';
import imgCarPark from '@cimages/Slideshow/exterior/large-gravel-car-park-at-the-old-crown-pub.jpeg';
import imgInteriorDining from '@cimages/Slideshow/interior/the-old-crown-pub-restaurant-interior-dining.jpg';
import imgGardenPicnic from '@cimages/Slideshow/garden/family-friendly-pub-garden-with-picnic-tables.jpeg';
import { getRestaurantIdentity, getContactInfo, getHours, getMenu, getTestimonials } from '@/lib/restaurantData';

// Schema.org types for restaurant
interface RestaurantSchema {
  '@context': string;
  '@type': string;
  name: string;
  alternateName?: string;
  description: string;
  url: string;
  telephone: string;
  email?: string;
  address: PostalAddress;
  geo: GeoCoordinates;
  openingHoursSpecification: OpeningHoursSpecification[];
  servesCuisine: string[];
  priceRange: string;
  paymentAccepted: string[];
  currenciesAccepted: string;
  hasMenu: string;
  menu?: MenuSchema;
  aggregateRating?: AggregateRating;
  review?: Review[];
  image: string[];
  logo: string;
  sameAs: string[];
  amenityFeature?: PropertyValue[];
  smokingAllowed: boolean;
  acceptsReservations: boolean;
  foundingDate?: string;
  award?: string[];
}

interface PostalAddress {
  '@type': string;
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  addressCountry: string;
}

interface GeoCoordinates {
  '@type': string;
  latitude: number;
  longitude: number;
}

interface OpeningHoursSpecification {
  '@type': string;
  dayOfWeek: string[];
  opens: string;
  closes: string;
  validFrom?: string;
  validThrough?: string;
}

interface MenuSchema {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  hasMenuSection: MenuSection[];
}

interface MenuSection {
  '@type': string;
  name: string;
  description?: string;
  hasMenuItem: MenuItem[];
}

interface MenuItem {
  '@type': string;
  name: string;
  description: string;
  image?: string;
  offers: Offer;
  nutrition?: NutritionInformation;
  suitableForDiet?: string[];
  menuAddOn?: MenuAddOn[];
}

interface Offer {
  '@type': string;
  price: string;
  priceCurrency: string;
  availability?: string;
  validFrom?: string;
  validThrough?: string;
}

interface NutritionInformation {
  '@type': string;
  calories?: string;
  fatContent?: string;
  saturatedFatContent?: string;
  carbohydrateContent?: string;
  sugarContent?: string;
  proteinContent?: string;
  sodiumContent?: string;
}

interface MenuAddOn {
  '@type': string;
  name: string;
  description?: string;
  offers: Offer;
}

interface AggregateRating {
  '@type': string;
  ratingValue: string;
  bestRating: string;
  worstRating: string;
  ratingCount: string;
}

interface Review {
  '@type': string;
  author: Person;
  datePublished: string;
  reviewBody: string;
  reviewRating: Rating;
}

interface Person {
  '@type': string;
  name: string;
}

interface Rating {
  '@type': string;
  ratingValue: string;
  bestRating: string;
  worstRating: string;
}

interface PropertyValue {
  '@type': string;
  name: string;
  value: boolean | string;
}

// Build dynamic data from central template to avoid drift
const buildBaseData = () => {
  const identity = getRestaurantIdentity();
  const contact = getContactInfo();
  const hours = getHours();
  const menu = getMenu();
  
  // Extract kitchen hours from actual restaurant data
  const kitchen = hours?.kitchen || {};
  const openingHours: { days: string[]; opens: string; closes: string }[] = [];
  
  // Handle different hour formats with proper type checking
  Object.entries(kitchen).forEach(([day, ranges]) => {
    // Type guard to ensure ranges is a string before calling split
    if (typeof ranges === 'string' && ranges.trim()) {
      try {
        const firstRange = ranges.split(',')[0]?.trim();
        if (firstRange && firstRange.includes('-')) {
          const [opens, closes] = firstRange.split('-').map(time => time.trim());
          if (opens && closes) {
            openingHours.push({ 
              days: [day.charAt(0).toUpperCase() + day.slice(1)], 
              opens, 
              closes 
            });
          }
        }
      } catch (error) {
        console.warn(`Failed to parse hours for ${day}:`, ranges, error);
      }
    } else {
      console.warn(`Invalid hours format for ${day}:`, ranges);
    }
  });
  
  const paymentMethods = ['Cash', 'Credit Card', 'Debit Card', 'Contactless'];
  return { identity, contact, menu, openingHours, paymentMethods };
};

// Sample menu data for schema
const MENU_ITEMS = {
  starters: [
    {
      name: "Chicken Chilli",
      description: "Tender chicken pieces in a spicy tomato-based sauce with peppers and onions",
      price: "8.95",
      image: "/images/food/CrispyHotWings.jpeg"
    },
    {
      name: "Vegetable Samosa",
      description: "Crispy pastry filled with spiced vegetables, served with mint chutney",
      price: "5.95",
      suitableForDiet: ["https://schema.org/VegetarianDiet"]
    }
  ],
  mains: [
    {
      name: "Chicken Tikka Masala",
      description: "Classic creamy tomato curry with tender chicken tikka pieces",
      price: "13.95",
      nutrition: {
        calories: "450",
        protein: "35g",
        carbohydrates: "25g"
      }
    },
    {
      name: "Dal Makhani",
      description: "Rich and creamy black lentil curry slow-cooked with butter and spices",
      price: "10.95",
      suitableForDiet: ["https://schema.org/VegetarianDiet", "https://schema.org/GlutenFreeDiet"]
    }
  ],
  desserts: [
    {
      name: "Gulab Jamun",
      description: "Traditional milk dumplings in rose-flavored syrup",
      price: "5.95"
    }
  ]
};

export const useRestaurantSchema = () => {
  const absoluteUrl = (p: string) => {
    try {
      const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://oldcrowngirton.com/';
      return new URL(p, base).toString();
    } catch {
      return p;
    }
  };

  // Generate main restaurant schema
  const generateRestaurantSchema = (): RestaurantSchema => {
    const data = buildBaseData();
    const testimonials = getTestimonials() || [];
    const ratingValue = testimonials.length
      ? (testimonials.reduce((s: number, t: any) => s + (t.rating || 0), 0) / testimonials.length).toFixed(1)
      : '4.8';
    const reviews: Review[] = testimonials.slice(0, 12).map((t: any) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: t.author },
      datePublished: t.date,
      reviewBody: t.text,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: String(t.rating),
        bestRating: '5',
        worstRating: '1'
      }
    }));
    return {
      '@context': 'https://schema.org',
      '@type': 'Restaurant',
      name: data.identity.name,
      alternateName: data.identity.tagline,
      description: data.identity.description,
      url: 'https://oldcrowngirton.com/',
      telephone: data.contact?.phone.primary,
      email: data.contact?.email.primary,
      address: {
        '@type': 'PostalAddress',
        streetAddress: data.contact?.address.street,
        addressLocality: data.contact?.address.area,
        addressRegion: data.contact?.address.city,
        postalCode: data.contact?.address.postcode,
        addressCountry: data.contact?.address.country
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: data.contact?.address.coordinates.lat,
        longitude: data.contact?.address.coordinates.lng
      },
      openingHoursSpecification: data.openingHours.map(h => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: h.days.map(day => `https://schema.org/${day}`),
        opens: h.opens,
        closes: h.closes
      })),
      servesCuisine: data.identity.cuisine_types,
      priceRange: '££',
      paymentAccepted: data.paymentMethods,
      currenciesAccepted: 'GBP',
      hasMenu: 'https://oldcrowngirton.com/menu',
      image: [
        absoluteUrl(typeof imgExteriorGarden === 'string' ? imgExteriorGarden : (imgExteriorGarden as any)),
        absoluteUrl(typeof imgInteriorDining === 'string' ? imgInteriorDining : (imgInteriorDining as any)),
        absoluteUrl(typeof imgGardenPicnic === 'string' ? imgGardenPicnic : (imgGardenPicnic as any)),
        absoluteUrl(typeof imgCarPark === 'string' ? imgCarPark : (imgCarPark as any)),
      ],
      logo: absoluteUrl('/images/brand/Oldcrowngirtonlogo.png'),
      sameAs: [
        'https://www.facebook.com/oldcrowngirton',
        'https://www.instagram.com/oldcrowngirton'
      ],
      smokingAllowed: false,
      acceptsReservations: true,
      foundingDate: data.identity.established,
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue,
        bestRating: '5',
        worstRating: '1',
        ratingCount: String(testimonials.length)
      },
      review: reviews
    };
  };

  // Generate menu schema
  const generateMenuSchema = (): MenuSchema => {
    return {
      '@context': 'https://schema.org',
      '@type': 'Menu',
      name: 'Old Crown Restaurant Menu',
      description: 'Authentic Nepalese cuisine and traditional pub classics',
      hasMenuSection: [
        {
          '@type': 'MenuSection',
          name: 'Starters',
          description: 'Appetizers and small plates to begin your meal',
          hasMenuItem: MENU_ITEMS.starters.map(item => ({
            '@type': 'MenuItem',
            name: item.name,
            description: item.description,
            image: item.image,
            offers: {
              '@type': 'Offer',
              price: item.price,
              priceCurrency: 'GBP',
              availability: 'https://schema.org/InStock'
            },
            suitableForDiet: item.suitableForDiet || []
          }))
        },
        {
          '@type': 'MenuSection',
          name: 'Main Courses',
          description: 'Hearty main dishes featuring authentic flavors',
          hasMenuItem: MENU_ITEMS.mains.map(item => ({
            '@type': 'MenuItem',
            name: item.name,
            description: item.description,
            offers: {
              '@type': 'Offer',
              price: item.price,
              priceCurrency: 'GBP',
              availability: 'https://schema.org/InStock'
            },
            nutrition: item.nutrition ? {
              '@type': 'NutritionInformation',
              calories: item.nutrition.calories,
              proteinContent: item.nutrition.protein,
              carbohydrateContent: item.nutrition.carbohydrates
            } : undefined,
            suitableForDiet: item.suitableForDiet || []
          }))
        },
        {
          '@type': 'MenuSection',
          name: 'Desserts',
          description: 'Sweet endings to your dining experience',
          hasMenuItem: MENU_ITEMS.desserts.map(item => ({
            '@type': 'MenuItem',
            name: item.name,
            description: item.description,
            offers: {
              '@type': 'Offer',
              price: item.price,
              priceCurrency: 'GBP',
              availability: 'https://schema.org/InStock'
            }
          }))
        }
      ]
    };
  };

  // Generate breadcrumb schema
  const generateBreadcrumbSchema = (items: Array<{name: string, url: string}>) => {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url
      }))
    };
  };

  // Generate event schema for special occasions
  const generateEventSchema = (eventData: {
    name: string;
    description: string;
    startDate: string;
    endDate?: string;
    location?: string;
    offers?: { price: string; url: string };
  }) => {
    const data = buildBaseData();
    return {
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: eventData.name,
      description: eventData.description,
      startDate: eventData.startDate,
      endDate: eventData.endDate,
      location: {
        '@type': 'Place',
        name: data.identity.name,
        address: {
          '@type': 'PostalAddress',
          streetAddress: data.contact?.address.street,
          addressLocality: data.contact?.address.area,
          addressRegion: data.contact?.address.city,
          postalCode: data.contact?.address.postcode,
          addressCountry: data.contact?.address.country
        }
      },
      organizer: {
        '@type': 'Organization',
        name: data.identity.name,
        url: 'https://oldcrowngirton.com/'
      },
      offers: eventData.offers ? {
        '@type': 'Offer',
        price: eventData.offers.price,
        priceCurrency: 'GBP',
        url: eventData.offers.url
      } : undefined
    };
  };

  const generateLocalBusinessSchema = () => {
    const data = buildBaseData();
    return {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: data.identity.name,
      description: data.identity.description,
      telephone: data.contact?.phone.primary,
      email: data.contact?.email.primary,
      address: {
        '@type': 'PostalAddress',
        streetAddress: data.contact?.address.street,
        addressLocality: data.contact?.address.area,
        addressRegion: data.contact?.address.city,
        postalCode: data.contact?.address.postcode,
        addressCountry: data.contact?.address.country
      },
      openingHoursSpecification: data.openingHours.map(h => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: h.days.map(day => `https://schema.org/${day}`),
        opens: h.opens,
        closes: h.closes
      }))
    };
  };

  const generateFAQSchema = (faqs: { question: string; answer: string }[]) => ({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer }
    }))
  });

  return {
    generateRestaurantSchema,
    generateMenuSchema,
    generateBreadcrumbSchema,
    generateEventSchema,
    generateLocalBusinessSchema,
    generateFAQSchema
  };
};

// Schema injection component
interface SchemaInjectorProps {
  type: 'restaurant' | 'menu' | 'breadcrumb' | 'event' | 'local' | 'faq';
  data?: any;
  page?: string;
}

export const SchemaInjector = ({ type, data, page = 'home' }: SchemaInjectorProps): null => {
  const { generateRestaurantSchema, generateMenuSchema, generateBreadcrumbSchema, generateEventSchema, generateLocalBusinessSchema, generateFAQSchema } = useRestaurantSchema();

  useEffect(() => {
    let schema: any = {};

    switch (type) {
      case 'restaurant':
        schema = generateRestaurantSchema();
        break;
      case 'menu':
        schema = generateMenuSchema();
        break;
      case 'breadcrumb':
        schema = generateBreadcrumbSchema(data || []);
        break;
      case 'event':
        schema = generateEventSchema(data);
        break;
      case 'local':
        schema = generateLocalBusinessSchema();
        break;
      case 'faq':
        schema = generateFAQSchema(data || []);
        break;
      default:
        return;
    }

    // Remove existing schema of the same type
    const existingScript = document.querySelector(`script[data-schema-type="${type}"]`);
    if (existingScript) {
      existingScript.remove();
    }

    // Inject new schema
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-schema-type', type);
    script.setAttribute('data-page', page);
    script.textContent = JSON.stringify(schema, null, 2);
    
    document.head.appendChild(script);

    // Cleanup on unmount
    return () => {
      const scriptToRemove = document.querySelector(`script[data-schema-type="${type}"][data-page="${page}"]`);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [type, data, page, generateRestaurantSchema, generateMenuSchema, generateBreadcrumbSchema, generateEventSchema, generateLocalBusinessSchema, generateFAQSchema]);

  return null; // This component doesn't render anything
};

// Restaurant Schema Provider - automatically injects restaurant schema on all pages
export const RestaurantSchemaProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <SchemaInjector type="restaurant" />
      {children}
    </>
  );
};

export default SchemaInjector;
