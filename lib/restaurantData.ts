// Restaurant Data Utility - Unified Template Integration
// This file provides utilities to work with the unified restaurant template data


// Import the unified restaurant template statically (works in Next.js)
import restaurantTemplate from '../data/templates/restaurant-template.json';
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

// Utility functions for accessing restaurant data
export const getRestaurantIdentity = () => restaurantTemplate.restaurant.identity;
export const getContactInfo = () => restaurantTemplate.restaurant.contact;
export const getHours = () => restaurantTemplate.restaurant.hours;
export const getMenu = () => restaurantTemplate.menu;
export const getMenuCategories = (): MenuCategory[] => restaurantTemplate.menu.categories;
export const getTestimonials = () => restaurantTemplate.testimonials;
export const getEvents = () => restaurantTemplate.events;
export const getGallery = () => restaurantTemplate.gallery;
export const getSEO = () => restaurantTemplate.seo;
export const getSocialMedia = () => restaurantTemplate.restaurant.social;
export const getDeliveryInfo = () => restaurantTemplate.delivery;
export const getFeatures = () => restaurantTemplate.features;


