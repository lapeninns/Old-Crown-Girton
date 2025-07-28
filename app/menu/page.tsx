import React from 'react';
import type { Metadata } from 'next';
import CompactMenu from './menu-content-compact';

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
      <CompactMenu />
    </>
  );
}