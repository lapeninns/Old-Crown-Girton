"use client";

/**
 * CLS Fix Implementation for Restaurant Website
 * Systematic approach to eliminate layout shifts
 */

import React from 'react';
import { CLSImage, CLSContainer, CLSDebugger, useFontOptimization, CLSOptimizedLayouts } from './CLSOptimization';

/**
 * CLS-Optimized Hero Component
 * Replaces dynamic hero with space-reserved version
 */
export function CLSOptimizedHero() {
  useFontOptimization();

  return (
    <CLSOptimizedLayouts.Hero className="relative bg-gradient-to-r from-amber-50 to-orange-50">
      {/* Background image with reserved space */}
      <CLSImage
        src="/images/restaurant-hero.jpg"
        alt="Old Crown Girton Restaurant"
        width={1920}
        height={600}
        priority={true}
        className="absolute inset-0 z-0"
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
      />
      
      {/* Content with reserved space */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <CLSContainer
          dimensions={{ width: '800px', height: 'auto' }}
          className="text-center text-white px-6 max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 font-display">
            Welcome to Old Crown Girton
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Authentic flavors in Cambridge's most historic setting
          </p>
          <div className="space-x-4">
            <button className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              View Menu
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-amber-600 px-8 py-3 rounded-lg font-semibold transition-colors">
              Book Table
            </button>
          </div>
        </CLSContainer>
      </div>
    </CLSOptimizedLayouts.Hero>
  );
}

/**
 * CLS-Optimized Menu Section
 * Prevents shifts during menu item loading
 */
export function CLSOptimizedMenuSection() {
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    // Simulate menu loading
    const timer = setTimeout(() => setIsLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        {/* Section header with reserved space */}
        <CLSContainer
          dimensions={{ height: '120px', width: '100%' }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Featured Menu
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover authentic Nepalese and British cuisine crafted with locally sourced ingredients
          </p>
        </CLSContainer>

        {/* Menu grid with reserved space */}
        <CLSOptimizedLayouts.MenuGrid>
          {isLoaded ? (
            <MenuItems />
          ) : (
            <MenuItemPlaceholders />
          )}
        </CLSOptimizedLayouts.MenuGrid>
      </div>
    </section>
  );
}

/**
 * Menu items with consistent sizing
 */
function MenuItems() {
  const menuItems = [
    {
      name: "Traditional Momo",
      description: "Steamed dumplings filled with spiced vegetables or meat",
      price: "£8.95",
      image: "/images/menu/momo.jpg"
    },
    {
      name: "Sunday Roast",
      description: "Classic British roast with all the trimmings",
      price: "£14.95",
      image: "/images/menu/roast.jpg"
    },
    {
      name: "Dal Bhat",
      description: "Traditional Nepalese lentil curry with rice",
      price: "£12.50",
      image: "/images/menu/dal-bhat.jpg"
    }
  ];

  return (
    <>
      {menuItems.map((item, index) => (
        <CLSContainer
          key={item.name}
          dimensions={{ height: '320px', width: '100%' }}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        >
          <CLSImage
            src={item.image}
            alt={item.name}
            width={400}
            height={200}
            className="w-full"
            priority={index < 3}
          />
          <div className="p-6">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-semibold text-gray-900">{item.name}</h3>
              <span className="text-lg font-bold text-amber-600">{item.price}</span>
            </div>
            <p className="text-gray-600">{item.description}</p>
          </div>
        </CLSContainer>
      ))}
    </>
  );
}

/**
 * Menu item placeholders with exact dimensions
 */
function MenuItemPlaceholders() {
  return (
    <>
      {[...Array(6)].map((_, index) => (
        <CLSContainer
          key={index}
          dimensions={{ height: '320px', width: '100%' }}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div className="animate-pulse">
            <div className="bg-gray-200 h-48 w-full"></div>
            <div className="p-6 space-y-3">
              <div className="flex justify-between">
                <div className="bg-gray-200 h-6 w-32 rounded"></div>
                <div className="bg-gray-200 h-6 w-16 rounded"></div>
              </div>
              <div className="bg-gray-200 h-4 w-full rounded"></div>
              <div className="bg-gray-200 h-4 w-3/4 rounded"></div>
            </div>
          </div>
        </CLSContainer>
      ))}
    </>
  );
}

/**
 * CLS-Optimized Testimonials Section
 */
export function CLSOptimizedTestimonials() {
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const testimonials = [
    {
      text: "The most authentic Nepalese food in Cambridge. The momos are incredible!",
      author: "Sarah M.",
      rating: 5,
      avatar: "/images/avatars/sarah.jpg"
    },
    {
      text: "Perfect Sunday roast in a historic setting. Couldn't ask for more!",
      author: "James T.",
      rating: 5,
      avatar: "/images/avatars/james.jpg"
    },
    {
      text: "Friendly staff, great atmosphere, and delicious food. Highly recommended!",
      author: "Priya K.",
      rating: 5,
      avatar: "/images/avatars/priya.jpg"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <CLSContainer
          dimensions={{ height: '100px', width: '100%' }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-xl text-gray-600">
            Read reviews from our satisfied guests
          </p>
        </CLSContainer>

        <CLSOptimizedLayouts.Testimonials>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {isLoaded ? (
              testimonials.map((testimonial, index) => (
                <CLSContainer
                  key={index}
                  dimensions={{ height: '200px', width: '100%' }}
                  className="bg-white p-6 rounded-lg shadow-md"
                >
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400">★</span>
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                  <div className="flex items-center">
                    <CLSImage
                      src={testimonial.avatar}
                      alt={testimonial.author}
                      width={40}
                      height={40}
                      className="rounded-full mr-3"
                    />
                    <span className="font-semibold text-gray-900">{testimonial.author}</span>
                  </div>
                </CLSContainer>
              ))
            ) : (
              [...Array(3)].map((_, index) => (
                <CLSContainer
                  key={index}
                  dimensions={{ height: '200px', width: '100%' }}
                  className="bg-white p-6 rounded-lg shadow-md"
                >
                  <div className="animate-pulse space-y-3">
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-4 h-4 bg-gray-200 rounded"></div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <div className="bg-gray-200 h-4 w-full rounded"></div>
                      <div className="bg-gray-200 h-4 w-5/6 rounded"></div>
                      <div className="bg-gray-200 h-4 w-4/6 rounded"></div>
                    </div>
                    <div className="flex items-center space-x-3 pt-4">
                      <div className="bg-gray-200 h-10 w-10 rounded-full"></div>
                      <div className="bg-gray-200 h-4 w-24 rounded"></div>
                    </div>
                  </div>
                </CLSContainer>
              ))
            )}
          </div>
        </CLSOptimizedLayouts.Testimonials>
      </div>
    </section>
  );
}

/**
 * CLS-Optimized Header Component
 */
export function CLSOptimizedHeader() {
  return (
    <CLSContainer
      dimensions={{ height: '80px', width: '100%' }}
      className="bg-white shadow-sm sticky top-0 z-50"
    >
      <div className="container mx-auto px-6 h-full flex items-center justify-between">
        <CLSContainer
          dimensions={{ height: '40px', width: '200px' }}
          className="flex items-center"
        >
          <CLSImage
            src="/images/logo.png"
            alt="Old Crown Girton"
            width={40}
            height={40}
            priority={true}
            className="mr-3"
          />
          <span className="text-xl font-bold text-gray-900">Old Crown Girton</span>
        </CLSContainer>

        <nav className="hidden md:flex space-x-8">
          <a href="#home" className="text-gray-700 hover:text-amber-600 transition-colors">Home</a>
          <a href="#menu" className="text-gray-700 hover:text-amber-600 transition-colors">Menu</a>
          <a href="#about" className="text-gray-700 hover:text-amber-600 transition-colors">About</a>
          <a href="#contact" className="text-gray-700 hover:text-amber-600 transition-colors">Contact</a>
        </nav>

        <CLSContainer
          dimensions={{ height: '40px', width: '120px' }}
          className="flex items-center"
        >
          <button className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors">
            Book Now
          </button>
        </CLSContainer>
      </div>
    </CLSContainer>
  );
}

/**
 * Complete CLS-Optimized Page Example
 */
export function CLSOptimizedPage() {
  return (
    <div className="min-h-screen">
      {/* CLS Debug Tool for Development */}
      <CLSDebugger />
      
      {/* Fixed header with reserved space */}
      <CLSOptimizedHeader />
      
      {/* Hero section with reserved space */}
      <CLSOptimizedHero />
      
      {/* Menu section with loading states */}
      <CLSOptimizedMenuSection />
      
      {/* Testimonials section */}
      <CLSOptimizedTestimonials />
      
      {/* Footer with reserved space */}
      <CLSContainer
        dimensions={{ height: '200px', width: '100%' }}
        className="bg-gray-900 text-white"
      >
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
      </CLSContainer>
    </div>
  );
}

export default CLSOptimizedPage;
