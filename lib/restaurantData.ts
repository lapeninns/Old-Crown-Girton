// Restaurant Data Utility - Unified Template Integration
// This file provides utilities to work with the unified restaurant template data


// Import the restaurant data statically (works in Next.js)
import restaurantTemplate from '../config/restaurant.json';
// Import the validated menu data


// Types for the unified restaurant template
export interface RestaurantTemplate {
  restaurant: {
    identity: {
      name: string;
      tagline: string;
      description: string;
      established: string;
      type: string;
      cuisine_types: string[];
      logo: {
        main: string;
        favicon: string;
        alt: string;
      };
    };
    contact: {
      phone: {
        primary: string;
        display: string;
        whatsapp: string;
      };
      email: {
        primary: string;
        bookings: string;
        events: string;
      };
      address: {
        street: string;
        area: string;
        city: string;
        postcode: string;
        country: string;
        coordinates: {
          lat: number;
          lng: number;
        };
        google_maps_url: string;
      };
    };
    hours: {
      kitchen: Record<string, string>;
      bar: Record<string, string>;
      display: {
        kitchen: Record<string, string>;
        bar: Record<string, string>;
      };
    };
    social: {
      facebook: { url: string; handle: string };
      instagram: { url: string; handle: string };
      twitter: { url: string; handle: string };
      website: string;
    };
  };
  menu: {
    metadata: {
      last_updated: string;
      version: string;
      currency: string;
      currency_symbol: string;
      allergen_info: string;
      disclaimer: string;
      notes: string[];
      dietary_legend: Record<string, string>;
    };
    categories: MenuCategory[];
  };
  gallery: {
    hero: {
      main: { src: string; alt: string; caption: string };
      secondary: Array<{ src: string; alt: string; caption: string }>;
    };
    categories: {
      dishes: Array<{ src: string; alt: string; caption: string; category?: string }>;
      restaurant: Array<{ src: string; alt: string; caption: string }>;
      events: Array<{ src: string; alt: string; caption: string }>;
    };
  };
  testimonials: Array<{
    id: string;
    text: string;
    author: string;
    rating: number;
    date: string;
    verified: boolean;
    platform: string;
    location: string;
  }>;
  events: Array<{
    id: string;
    title: string;
    description: string;
    date: { start: string; end: string };
    image: string;
    special_menu: boolean;
    booking_required: boolean;
    discount?: { type: string; value: number; description: string };
    offer?: string;
  }>;
  seo: {
    title: string;
    description: string;
    keywords: string[];
    og: {
      title: string;
      description: string;
      image: string;
      url: string;
    };
    schema: Record<string, any>;
  };
  features: {
    services: Record<string, boolean>;
    dining: Record<string, boolean>;
    accessibility: Record<string, boolean>;
    amenities: Record<string, boolean>;
    payment_methods: string[];
  };
  delivery: {
    available: boolean;
    radius_miles: number;
    minimum_order: { amount: number; display: string };
    delivery_fee: { amount: number; display: string };
    free_delivery_threshold: { amount: number; display: string };
    estimated_time: string;
    partners: Array<{ name: string; url: string }>;
    coverage_areas: string[];
  };
  booking: {
    phone: string;
    email: string;
    online_booking: boolean;
    advance_booking_days: number;
    party_size_limit: number;
    deposit_required: boolean;
    cancellation_policy: string;
  };
  nutrition: {
    allergen_policy: string;
    common_allergens: string[];
    dietary_accommodations: string[];
  };
  template_info: {
    version: string;
    created: string;
    description: string;
    structure: string;
    usage: string;
  };
}

export interface MenuCategory {
  id: string;
  name: string;
  description: string;
  order: number;
  subcategories: MenuSubcategory[];
}

export interface MenuSubcategory {
  id: string;
  name: string;
  order: number;
  items: MenuItem[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: {
    amount: number;
    display: string;
  };
  dietary: string[];
  spice_level: number;
  image: string;
  available: boolean;
  popular: boolean;
  prep_time: string;
}

// Utility functions

// Utility functions for accessing restaurant data with fallbacks for simplified structure
export const getRestaurantIdentity = () => ({
  name: (restaurantTemplate as any)?.name || "Old Crown Girton",
  tagline: "Historic Thatched Pub & Nepalese Restaurant",
  description: "Authentic Nepalese cuisine and traditional British pub classics",
  established: "1850",
  type: "restaurant",
  cuisine_types: ["Nepalese", "British", "Pub Food"]
});

export const getContactInfo = () => ({
  phone: {
    primary: (restaurantTemplate as any)?.phone || "+44 1223 277217",
    display: "01223277217",
    whatsapp: (restaurantTemplate as any)?.phone || "+44 1223 277217"
  },
  email: {
    primary: (restaurantTemplate as any)?.email || "oldcrown@lapeninns.com",
    bookings: (restaurantTemplate as any)?.email || "oldcrown@lapeninns.com",
    events: (restaurantTemplate as any)?.email || "oldcrown@lapeninns.com"
  },
  address: {
    street: (restaurantTemplate as any)?.address?.street || "89 High Street",
    area: "Girton",
    city: (restaurantTemplate as any)?.address?.city || "Girton",
    postcode: (restaurantTemplate as any)?.address?.zip || "CB3 0QQ",
    country: "GB",
    coordinates: { lat: 52.2385, lng: 0.0926 },
    google_maps_url: "https://maps.google.com/?q=52.2385,0.0926"
  }
});

export const getHours = () => {
  // Try to read from the actual restaurant data if available, otherwise use fallback
  const hours = (restaurantTemplate as any)?.hours;
  
  if (hours && hours.kitchen && hours.bar) {
    // Use the actual restaurant.json data
    return {
      kitchen: hours.kitchen,
      bar: hours.bar,
      display: {
        kitchen: {
          "weekdays": generateDisplayHours(hours.kitchen, ['monday', 'tuesday', 'wednesday', 'thursday']),
          "friday": generateDisplayHours(hours.kitchen, ['friday']),
          "saturday": generateDisplayHours(hours.kitchen, ['saturday']),
          "sunday": generateDisplayHours(hours.kitchen, ['sunday'])
        },
        bar: {
          "mon_thu": generateDisplayHours(hours.bar, ['monday', 'tuesday', 'wednesday', 'thursday']),
          "fri_sat": generateDisplayHours(hours.bar, ['friday', 'saturday']),
          "sunday": generateDisplayHours(hours.bar, ['sunday'])
        }
      }
    };
  }
  
  // Fallback to hardcoded data if restaurant.json is not available
  return {
    kitchen: {
      "monday": "12:00-22:00",
      "tuesday": "12:00-22:00",
      "wednesday": "12:00-22:00", 
      "thursday": "12:00-22:00",
      "friday": "12:00-22:30",
      "saturday": "12:00-22:30",
      "sunday": "12:00-21:30"
    },
    bar: {
      "monday": "12:00-23:00",
      "tuesday": "12:00-23:00",
      "wednesday": "12:00-23:00",
      "thursday": "12:00-23:00",
      "friday": "12:00-00:00",
      "saturday": "12:00-00:00",
      "sunday": "12:00-22:30"
    },
    display: {
      kitchen: {
        "weekdays": "Mon-Thu: 12:00-22:00",
        "friday": "Fri: 12:00-22:30",
        "saturday": "Sat: 12:00-22:30",
        "sunday": "Sun: 12:00-21:30"
      },
      bar: {
        "mon_thu": "Mon-Thu: 12:00-23:00",
        "fri_sat": "Fri-Sat: 12:00-00:00",
        "sunday": "Sun: 12:00-22:30"
      }
    }
  };
};

// Helper function to generate display strings from hours data
function generateDisplayHours(hoursData: Record<string, string>, days: string[]): string {
  if (days.length === 0) return '';
  
  // Get hours for the specified days
  const dayHours = days.map(day => hoursData[day]).filter(Boolean);
  
  if (dayHours.length === 0) return 'Closed';
  
  // Check if all days have the same hours
  const firstHours = dayHours[0];
  const allSame = dayHours.every(hours => hours === firstHours);
  
  if (allSame) {
    const dayAbbrevs = {
      'monday': 'Mon', 'tuesday': 'Tue', 'wednesday': 'Wed', 'thursday': 'Thu',
      'friday': 'Fri', 'saturday': 'Sat', 'sunday': 'Sun'
    };
    
    const dayNames = days.map(day => dayAbbrevs[day as keyof typeof dayAbbrevs]);
    const rangeStr = dayNames.length > 1 ? `${dayNames[0]}-${dayNames[dayNames.length - 1]}` : dayNames[0];
    
    return `${rangeStr}: ${firstHours.replace(',', ', ')}`;
  }
  
  // If different hours, return the first day's hours
  return `${days[0]}: ${firstHours.replace(',', ', ')}`;
}

export const getMenu = () => ({
  metadata: {
    last_updated: new Date().toISOString(),
    version: "1.0.0",
    currency: "GBP",
    currency_symbol: "£",
    allergen_info: "Please inform us of any allergies before ordering.",
    disclaimer: "Cross-contamination is possible despite care.",
    notes: ["All dishes are prepared fresh to order"],
    dietary_legend: { "veg": "Vegetarian", "GF": "Gluten Free" }
  },
  categories: [] as MenuCategory[]
});

export const getMenuCategories = (): MenuCategory[] => [];
export const getTestimonials = (): any[] => [];
export const getEvents = (): any[] => [];
export const getGallery = (): any => ({ hero: { main: { src: "", alt: "", caption: "" }, secondary: [] }, categories: { dishes: [], restaurant: [], events: [] } });
export const getSEO = (): any => ({ title: "Old Crown Girton", description: "Historic thatched pub and Nepalese restaurant", keywords: [], og: { title: "", description: "", image: "", url: "" }, schema: {} });
export const getSocialMedia = (): any => ({ facebook: { url: "", handle: "" }, instagram: { url: "", handle: "" }, twitter: { url: "", handle: "" }, website: "https://oldcrowngirton.com/" });
export const getDeliveryInfo = (): any => ({ available: true, radius_miles: 5, minimum_order: { amount: 15, display: "£15.00" }, delivery_fee: { amount: 2.50, display: "£2.50" }, free_delivery_threshold: { amount: 25, display: "£25.00" }, estimated_time: "30-45 minutes", partners: [], coverage_areas: [] });
export const getFeatures = (): any => ({ services: {}, dining: {}, accessibility: {}, amenities: {}, payment_methods: ["Cash", "Card"] });


