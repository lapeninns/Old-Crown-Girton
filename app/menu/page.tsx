import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import RestaurantLayout from '@/components/restaurant/Layout';
import { SchemaInjector } from '@/components/seo/RestaurantSchema';
import { getMenu, getRestaurantIdentity } from '@/lib/restaurantData';
import AllergenNotice from '@/components/restaurant/AllergenNotice';

// Dynamic import for menu component to reduce initial bundle size
const CompleteMenu = dynamic(() => import('./menu-content-complete'), {
  loading: () => (
    <div className="animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="h-8 bg-gray-200 rounded mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  ),
  ssr: true, // Enable SSR for SEO
});

export const metadata: Metadata = {
  title: 'Menu | Old Crown, Girton - Authentic Nepalese & Indian Cuisine',
  description: 'Discover our full menu of authentic Nepalese and Indian dishes. From traditional momos to signature Old Crown specialities, fresh tandoor grills and more. Call 01223 276027 to order.',
  keywords: 'Old Crown menu, Nepalese food Girton, Indian restaurant Cambridge, tandoor grill, momos, curry takeaway',
  openGraph: {
    title: 'Full Menu - Old Crown Restaurant, Girton',
    description: 'Browse our complete menu of authentic Nepalese & Indian cuisine. Perfect for dine-in, takeaway or delivery in Cambridge area.',
    images: ['/opengraph-image.png'],
  },
  alternates: {
    canonical: 'https://oldcrowngirton.co.uk/menu'
  }
};

export default function MenuPage() {
  const identity = getRestaurantIdentity();
  const menu = getMenu();
  const allergenStatement = menu?.metadata?.allergen_info || 'Please inform us of any allergies before ordering.';
  const menuSchema = {
    "@context": "https://schema.org",
    "@type": "Menu",
    "name": "Old Crown Restaurant Menu",
    "description": "Authentic Nepalese and Indian cuisine menu featuring traditional specialities, tandoor grills, and signature dishes",
    "provider": {
      "@type": "Restaurant",
      "name": "Old Crown",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "High Street",
        "addressLocality": "Girton",
        "addressRegion": "Cambridge",
        "postalCode": "CB3 0QQ",
        "addressCountry": "GB"
      },
      "telephone": "+441223276027"
    },
    "hasMenuSection": [
      {
        "@type": "MenuSection",
        "name": "Starters",
        "description": "Traditional appetizers and small plates"
      },
      {
        "@type": "MenuSection", 
        "name": "Old Crown Speciality Dishes",
        "description": "Signature Nepalese specialities unique to Old Crown"
      },
      {
        "@type": "MenuSection",
        "name": "Tandoor Grills",
        "description": "Fresh grilled items from our traditional tandoor oven"
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(menuSchema),
        }}
      />
      <RestaurantLayout>
        <SchemaInjector type="breadcrumb" data={[
          { name: 'Home', url: 'https://oldcrowngirton.co.uk/' },
          { name: 'Menu', url: 'https://oldcrowngirton.co.uk/menu' }
        ]} page="menu" />
        <section className="bg-crown-cream py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-crown-slate mb-4">Menus: Nepalese Craft & Pub Comfort</h1>
            <p className="text-gray-700 text-lg leading-relaxed mb-6">A dual identity: authentic Himalayan-inspired dishes prepared with balanced aromatics alongside trusted British pub favourites, lighter lunch options and a traditional Sunday focus (subject to availability).</p>
            <div className="flex flex-wrap justify-center gap-3 text-xs md:text-sm">
              {["Authentic Nepalese","Pub Classics","Family Friendly","Balanced Spice","Vegetarian Options","Takeaway Available"].map(k => (
                <span key={k} className="px-3 py-1 bg-white rounded-full border border-gray-200">{k}</span>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-6">Menu items & availability may change. Please confirm in venue.</p>
            <AllergenNotice />
          </div>
        </section>
        <Suspense fallback={
          <div className="animate-pulse">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="h-8 bg-gray-200 rounded mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-24 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        }>
          <CompleteMenu />
        </Suspense>
      </RestaurantLayout>
    </>
  );
}