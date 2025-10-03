import { getRestaurantIdentity, getContactInfo, getSEO, getTestimonials, getFeatures } from '@/lib/restaurantData';

interface RestaurantSchema {
  "@context": string;
  "@type": string;
  name: string;
  description: string;
  url: string;
  telephone: string;
  email: string;
  address: {
    "@type": string;
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  geo: {
    "@type": string;
    latitude: number;
    longitude: number;
  };
  openingHours: string[];
  servesCuisine: string[];
  priceRange: string;
  aggregateRating: {
    "@type": string;
    ratingValue: string;
    reviewCount: string;
  };
  image: string[];
  menu: string;
  reservationsPolicy: string;
  paymentAccepted: string[];
  currenciesAccepted: string;
}

export function generateRestaurantSchema(): RestaurantSchema {
  const identity = getRestaurantIdentity();
  const contact = getContactInfo();
  const seo = getSEO();
  const testimonials = getTestimonials();
  const features = getFeatures();

  // Calculate average rating from testimonials
  const avgRating = testimonials.length > 0 
    ? (testimonials.reduce((sum: number, t: any) => sum + t.rating, 0) / testimonials.length).toFixed(1)
    : "4.8";

  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: identity.name,
    description: seo.description || identity.description,
    url: (seo as any)?.og?.url || "https://oldcrowngirton.com/",
    telephone: contact?.phone.primary || "+441223 277217",
    email: contact?.email.primary || "oldcrown@lapeninns.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: contact?.address.street || "High Street",
      addressLocality: contact?.address.area || "Girton",
      addressRegion: contact?.address.city || "Cambridge",
      postalCode: contact?.address.postcode || "CB3 0QQ",
      addressCountry: "GB"
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: contact?.address.coordinates?.lat || 52.2385,
      longitude: contact?.address.coordinates?.lng || 0.0926
    },
    openingHours: [
      "Mo-Th 12:00-22:00",
      "Fr-Sa 12:00-22:30", 
      "Su 12:00-21:30"
    ],
    servesCuisine: (identity as any).cuisine_types || [
      "Indian",
      "Nepalese", 
      "Asian",
      "Vegetarian"
    ],
    priceRange: "££",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: avgRating,
      reviewCount: testimonials.length.toString()
    },
    image: [
      "https://oldcrowngirton.com/images/restaurant-exterior.jpg",
      "https://oldcrowngirton.com/images/restaurant-interior.jpg",
      "https://oldcrowngirton.com/images/food-display.jpg"
    ],
    menu: "https://oldcrowngirton.com/menu",
    reservationsPolicy: "ReservationsRequired",
    paymentAccepted: features.payment_methods || [
      "Cash",
      "Credit Card", 
      "Debit Card",
      "Contactless Payment"
    ],
    currenciesAccepted: "GBP"
  };
}

export function generateLocalBusinessSchema() {
  const restaurantData = generateRestaurantSchema();
  
  return {
    ...restaurantData,
    "@type": ["Restaurant", "LocalBusiness"]
  };
}
