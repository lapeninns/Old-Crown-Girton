// Restaurant Schema Markup - Comprehensive structured data implementation
'use client';

import React, { useEffect } from 'react';

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

// Restaurant data configuration
const RESTAURANT_DATA = {
  name: "Old Crown",
  alternateName: "Old Crown Girton",
  description: "Authentic Nepalese cuisine and traditional pub classics in Girton, Cambridge. Award-winning restaurant with beautiful terrace garden and cozy interior.",
  url: "https://www.oldcrowngirton.co.uk",
  telephone: "+44 1223 276071",
  email: "info@oldcrowngirton.co.uk",
  address: {
    streetAddress: "1 High Street",
    addressLocality: "Girton",
    addressRegion: "Cambridgeshire",
    postalCode: "CB3 0QG",
    addressCountry: "GB"
  },
  coordinates: {
    latitude: 52.2434,
    longitude: 0.0835
  },
  openingHours: [
    {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday"],
      opens: "12:00",
      closes: "23:00"
    },
    {
      days: ["Friday", "Saturday"],
      opens: "12:00",
      closes: "00:00"
    },
    {
      days: ["Sunday"],
      opens: "12:00",
      closes: "22:30"
    }
  ],
  cuisine: ["Nepalese", "Indian", "British", "Pub Food", "Asian"],
  priceRange: "££",
  paymentMethods: ["Cash", "Credit Card", "Debit Card", "Contactless Payment"],
  currency: "GBP",
  menuUrl: "https://www.oldcrowngirton.co.uk/menu",
  rating: {
    value: "4.5",
    count: "127",
    bestRating: "5",
    worstRating: "1"
  },
  socialMedia: [
    "https://www.facebook.com/oldcrowngirton",
    "https://www.instagram.com/oldcrowngirton",
    "https://www.tripadvisor.co.uk/oldcrowngirton"
  ],
  amenities: [
    { name: "Wheelchair Accessible", value: true },
    { name: "Outdoor Seating", value: true },
    { name: "Parking Available", value: true },
    { name: "Free WiFi", value: true },
    { name: "Dog Friendly", value: true },
    { name: "Family Friendly", value: true },
    { name: "Takeaway Available", value: true },
    { name: "Reservations Accepted", value: true }
  ],
  awards: [
    "TripAdvisor Certificate of Excellence 2024",
    "Local Restaurant of the Year 2023"
  ]
};

// Sample menu data for schema
const MENU_ITEMS = {
  starters: [
    {
      name: "Chicken Chilli",
      description: "Tender chicken pieces in a spicy tomato-based sauce with peppers and onions",
      price: "8.95",
      image: "/dishes/chicken-chilli.jpg"
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
  // Generate main restaurant schema
  const generateRestaurantSchema = (): RestaurantSchema => {
    return {
      '@context': 'https://schema.org',
      '@type': 'Restaurant',
      name: RESTAURANT_DATA.name,
      alternateName: RESTAURANT_DATA.alternateName,
      description: RESTAURANT_DATA.description,
      url: RESTAURANT_DATA.url,
      telephone: RESTAURANT_DATA.telephone,
      email: RESTAURANT_DATA.email,
      address: {
        '@type': 'PostalAddress',
        streetAddress: RESTAURANT_DATA.address.streetAddress,
        addressLocality: RESTAURANT_DATA.address.addressLocality,
        addressRegion: RESTAURANT_DATA.address.addressRegion,
        postalCode: RESTAURANT_DATA.address.postalCode,
        addressCountry: RESTAURANT_DATA.address.addressCountry
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: RESTAURANT_DATA.coordinates.latitude,
        longitude: RESTAURANT_DATA.coordinates.longitude
      },
      openingHoursSpecification: RESTAURANT_DATA.openingHours.map(hours => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: hours.days.map(day => `https://schema.org/${day}`),
        opens: hours.opens,
        closes: hours.closes
      })),
      servesCuisine: RESTAURANT_DATA.cuisine,
      priceRange: RESTAURANT_DATA.priceRange,
      paymentAccepted: RESTAURANT_DATA.paymentMethods,
      currenciesAccepted: RESTAURANT_DATA.currency,
      hasMenu: RESTAURANT_DATA.menuUrl,
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: RESTAURANT_DATA.rating.value,
        bestRating: RESTAURANT_DATA.rating.bestRating,
        worstRating: RESTAURANT_DATA.rating.worstRating,
        ratingCount: RESTAURANT_DATA.rating.count
      },
      image: [
        '/hero-restaurant.jpg',
        '/restaurant-interior.jpg',
        '/restaurant/exterior.jpg',
        '/restaurant/terrace.jpg'
      ],
      logo: '/logos/old-crown-logo.png',
      sameAs: RESTAURANT_DATA.socialMedia,
      amenityFeature: RESTAURANT_DATA.amenities.map(amenity => ({
        '@type': 'PropertyValue',
        name: amenity.name,
        value: amenity.value
      })),
      smokingAllowed: false,
      acceptsReservations: true,
      foundingDate: '1995',
      award: RESTAURANT_DATA.awards
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
    return {
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: eventData.name,
      description: eventData.description,
      startDate: eventData.startDate,
      endDate: eventData.endDate,
      location: {
        '@type': 'Place',
        name: RESTAURANT_DATA.name,
        address: {
          '@type': 'PostalAddress',
          streetAddress: RESTAURANT_DATA.address.streetAddress,
          addressLocality: RESTAURANT_DATA.address.addressLocality,
          addressRegion: RESTAURANT_DATA.address.addressRegion,
          postalCode: RESTAURANT_DATA.address.postalCode,
          addressCountry: RESTAURANT_DATA.address.addressCountry
        }
      },
      organizer: {
        '@type': 'Organization',
        name: RESTAURANT_DATA.name,
        url: RESTAURANT_DATA.url
      },
      offers: eventData.offers ? {
        '@type': 'Offer',
        price: eventData.offers.price,
        priceCurrency: 'GBP',
        url: eventData.offers.url
      } : undefined
    };
  };

  return {
    generateRestaurantSchema,
    generateMenuSchema,
    generateBreadcrumbSchema,
    generateEventSchema
  };
};

// Schema injection component
interface SchemaInjectorProps {
  type: 'restaurant' | 'menu' | 'breadcrumb' | 'event';
  data?: any;
  page?: string;
}

export const SchemaInjector = ({ type, data, page = 'home' }: SchemaInjectorProps): null => {
  const { generateRestaurantSchema, generateMenuSchema, generateBreadcrumbSchema, generateEventSchema } = useRestaurantSchema();

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
  }, [type, data, page, generateRestaurantSchema, generateMenuSchema, generateBreadcrumbSchema, generateEventSchema]);

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
