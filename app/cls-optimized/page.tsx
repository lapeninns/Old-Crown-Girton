"use client";

/**
 * CLS-Optimized Homepage Example
 * Shows how to apply CLS fixes to your existing homepage
 */

import React from 'react';
import { CLSSafeImage, CLSMetricsProvider, withCLSOptimization } from '../../components/optimization/CLSIntegration';

// Example of fixing existing homepage
function OriginalHomepage() {
  return (
    <div>
      {/* BEFORE: This causes layout shifts */}
      <div className="hero">
        <img src="/images/hero.jpg" alt="Restaurant" />
        <h1>Welcome to Old Crown Girton</h1>
      </div>
      
      {/* BEFORE: Dynamic content causes shifts */}
      <div className="menu-section">
        <h2>Our Menu</h2>
        <div className="menu-items">
          {/* Menu items load dynamically */}
        </div>
      </div>
    </div>
  );
}

// AFTER: CLS-optimized version
function CLSOptimizedHomepage() {
  const [menuItems, setMenuItems] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulate loading menu items
    setTimeout(() => {
      setMenuItems([
        { id: 1, name: 'Traditional Momo', price: '£8.95' },
        { id: 2, name: 'Sunday Roast', price: '£14.95' },
        { id: 3, name: 'Dal Bhat', price: '£12.50' }
      ]);
      setIsLoading(false);
    }, 1500);
  }, []);

  return (
    <div className="min-h-screen">
      {/* AFTER: Hero with reserved space */}
      <section className="hero relative bg-gradient-to-r from-amber-50 to-orange-50">
        {/* Fixed dimensions prevent layout shift */}
        <div style={{ height: '600px', position: 'relative' }}>
          <CLSSafeImage
            src="/images/hero.jpg"
            alt="Old Crown Girton Restaurant"
            width={1920}
            height={600}
            priority={true}
            className="absolute inset-0"
          />
          
          {/* Content overlay with reserved space */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div 
              className="text-center text-white px-6"
              style={{ width: '100%', maxWidth: '800px' }}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-4 font-display">
                Welcome to Old Crown Girton
              </h1>
              <p className="text-xl md:text-2xl mb-8">
                Authentic flavors in Cambridge's most historic setting
              </p>
              
              {/* Fixed button container */}
              <div className="space-x-4" style={{ height: '48px' }}>
                <button className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                  View Menu
                </button>
                <button className="border-2 border-white text-white hover:bg-white hover:text-amber-600 px-8 py-3 rounded-lg font-semibold transition-colors">
                  Book Table
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AFTER: Menu section with reserved space */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          {/* Header with fixed height */}
          <div className="text-center mb-12" style={{ height: '120px' }}>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Featured Menu
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover authentic Nepalese and British cuisine
            </p>
          </div>

          {/* Menu grid with reserved space */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {isLoading ? (
              // Loading placeholders with exact dimensions
              [...Array(3)].map((_, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                  style={{ height: '320px' }}
                >
                  <div className="animate-pulse">
                    <div className="bg-gray-200 h-48 w-full"></div>
                    <div className="p-6 space-y-3">
                      <div className="flex justify-between">
                        <div className="bg-gray-200 h-6 w-32 rounded"></div>
                        <div className="bg-gray-200 h-6 w-16 rounded"></div>
                      </div>
                      <div className="bg-gray-200 h-4 w-full rounded"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // Actual menu items with same dimensions
              menuItems.map((item) => (
                <div 
                  key={item.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  style={{ height: '320px' }}
                >
                  <CLSSafeImage
                    src={`/images/menu/${item.name.toLowerCase().replace(/\s+/g, '-')}.jpg`}
                    alt={item.name}
                    width={400}
                    height={200}
                    className="w-full"
                  />
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{item.name}</h3>
                      <span className="text-lg font-bold text-amber-600">{item.price}</span>
                    </div>
                    <p className="text-gray-600">Delicious traditional dish</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* AFTER: Footer with reserved space */}
      <footer className="bg-gray-900 text-white" style={{ height: '200px' }}>
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
              <p>High Street, Girton</p>
              <p>Cambridge CB3 0PU</p>
              <p>+44 1223 277217</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Opening Hours</h3>
              <p>Mon-Thu: 12pm-11pm</p>
              <p>Fri-Sat: 12pm-12am</p>
              <p>Sun: 12pm-10:30pm</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-amber-400 transition-colors">Facebook</a>
                <a href="#" className="hover:text-amber-400 transition-colors">Instagram</a>
                <a href="#" className="hover:text-amber-400 transition-colors">Twitter</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Apply CLS optimization wrapper
const OptimizedHomepage = withCLSOptimization(CLSOptimizedHomepage);

// Main export wrapped with metrics provider
export default function HomePage() {
  return (
    <CLSMetricsProvider>
      <OptimizedHomepage />
    </CLSMetricsProvider>
  );
}
