'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Search, UtensilsCrossed, Wheat, Leaf, Fish, Milk, Clock, MapPin, Star } from 'lucide-react';
import menuData from '../../menu-new.json';

// Type definitions for better TypeScript support

interface BadgeProps {
  text: string;
  type?: string;
}

interface MenuItemProps {
  name: string;
  description?: string;
  price: string;
  badges?: string[];
  isPopular?: boolean;
}

interface SectionTitleProps {
  title: string;
  className?: string;
}

const OldCrownMenu: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeSection, setActiveSection] = useState<string>('starters');

  // Menu categories for navigation
  const menuCategories = useMemo(() => [
    { id: 'starters', label: 'Starters', icon: UtensilsCrossed },
    { id: 'grills', label: 'Mixed Grills', icon: Fish },
    { id: 'specialties', label: 'Specialties', icon: Star },
    { id: 'curries', label: 'Curries', icon: Wheat },
    { id: 'biryani', label: 'Biryani', icon: Leaf },
    { id: 'sides', label: 'Sides & Fries', icon: Milk },
    { id: 'classics', label: 'Pub Classics', icon: UtensilsCrossed },
    { id: 'desserts', label: 'Desserts', icon: Star }
  ], []);

  // Scroll to section function
  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 120; // Account for sticky headers
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  };

  // Intersection Observer to update active section based on scroll position
  useEffect(() => {
    const observerOptions = {
      root: null as Element | null,
      rootMargin: '-120px 0px -80% 0px',
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all section elements
    menuCategories.forEach((category) => {
      const element = document.getElementById(category.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [menuCategories]);

  // Badge Component with proper styling
  const Badge: React.FC<BadgeProps> = ({ text }) => {
    const badgeStyles: Record<string, string> = {
      'GF': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      'V': 'bg-green-50 text-green-700 border border-green-200',
      'default': 'bg-gray-100 text-gray-700 border border-gray-200'
    };
    
    const style = badgeStyles[text] || badgeStyles.default;
    
    return (
      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${style}`}>
        {(text === 'GF' || text === 'V') && <Leaf className="w-2.5 h-2.5 mr-0.5" />}
        {text}
      </span>
    );
  };

  // Menu Item Component with search functionality
  const MenuItem: React.FC<MenuItemProps> = ({ 
    name, 
    description, 
    price, 
    badges = [], 
    isPopular = false 
  }) => {
    const shouldShow = useMemo(() => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        name.toLowerCase().includes(searchLower) || 
        (description && description.toLowerCase().includes(searchLower))
      );
    }, [name, description]);
    
    if (!shouldShow) return null;

    return (
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors duration-200 group">
        <div className="flex-1 mb-2 sm:mb-0 sm:pr-4">
          <div className="flex flex-col xs:flex-row xs:items-start gap-2 mb-1">
            <div className="flex items-center gap-2 flex-wrap">
              {isPopular && (
                <Star className="w-4 h-4 text-amber-500 fill-current flex-shrink-0" />
              )}
              <span className="font-semibold text-gray-900 text-sm sm:text-base leading-tight group-hover:text-amber-700 transition-colors">
                {name}
              </span>
            </div>
            {badges.length > 0 && (
              <div className="flex gap-1 flex-wrap">
                {badges.map((badge, idx) => (
                  <Badge key={idx} text={badge} />
                ))}
              </div>
            )}
          </div>
          {description && (
            <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed pr-2">
              {description}
            </p>
          )}
        </div>
        <div className="flex justify-between items-center sm:block">
          <span className="font-bold text-amber-700 text-lg sm:text-base whitespace-nowrap group-hover:text-amber-800 transition-colors">
            {price}
          </span>
        </div>
      </div>
    );
  };

  // Section Title Component
  const SectionTitle: React.FC<SectionTitleProps> = ({ title, className = "" }) => (
    <div className="relative mb-4 sm:mb-6">
      <h2 className={`text-lg sm:text-xl font-bold text-center mb-3 sm:mb-4 pb-2 sm:pb-3 text-gray-900 ${className}`}>
        {title}
      </h2>
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 sm:w-24 h-0.5 bg-gradient-to-r from-amber-500 to-orange-500"></div>
    </div>
  );

  // Sub Section Title Component
  const SubSectionTitle: React.FC<{ title: string }> = ({ title }) => (
    <h3 className="text-sm sm:text-base font-bold text-gray-800 mb-2 sm:mb-3 mt-4 sm:mt-6 first:mt-0 border-l-4 border-amber-500 pl-2 sm:pl-3">
      {title}
    </h3>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-amber-50">
      {/* Enhanced Header */}
      <div className="relative bg-white shadow-lg border-b-4 border-amber-500">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-50 to-orange-50 opacity-50"></div>
        <div className="relative z-10 text-center py-6 sm:py-8 px-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 tracking-wide">
            {menuData.restaurant.toUpperCase()}
          </h1>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm text-gray-700">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 bg-white/70 backdrop-blur-sm rounded-lg p-3 shadow-sm">
                <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <div className="text-center sm:text-left">
                  <div className="font-semibold">KITCHEN</div>
                  <div className="text-xs leading-relaxed">
                    MON-FRI: {menuData.hours.kitchen.monday_friday}<br className="hidden sm:inline" />
                    SAT: {menuData.hours.kitchen.saturday} / SUN: {menuData.hours.kitchen.sunday}
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 bg-white/70 backdrop-blur-sm rounded-lg p-3 shadow-sm">
                <MapPin className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <div className="text-center sm:text-left">
                  <div className="font-semibold">BAR</div>
                  <div className="text-xs leading-relaxed">
                    Mon-Thurs: {menuData.hours.bar.monday_thursday}<br className="hidden sm:inline" />
                    Fri & Sat: {menuData.hours.bar.friday_saturday}, Sun: {menuData.hours.bar.sunday}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Search Bar */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-3 sm:py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all shadow-sm text-sm sm:text-base"
            />
          </div>
        </div>
      </div>

      {/* Sticky Category Navigation */}
      <div className="sticky top-16 z-30 bg-white/90 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <nav className="flex gap-1 sm:gap-2 overflow-x-auto scrollbar-hide py-2 sm:py-3">
            {menuCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => scrollToSection(category.id)}
                  className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                    activeSection === category.id
                      ? 'bg-amber-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-amber-100 hover:text-amber-700'
                  }`}
                  aria-label={`Go to ${category.label} section`}
                  aria-current={activeSection === category.id ? 'page' : undefined}
                >
                  <IconComponent className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>{category.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12">
              
              {/* Left Column */}
              <div className="space-y-6 sm:space-y-8">
                
                {/* Starters */}
                <div id="starters">
                  <SectionTitle title="STARTERS" />
                  <div className="space-y-1 sm:space-y-2">
                    {menuData.menu.starters.map((item, index) => (
                      <MenuItem
                        key={`starter-${index}`}
                        name={item.name.toUpperCase()}
                        description={item.description}
                        price={item.price}
                        badges={[
                          ...(item.gluten_free ? ['GF'] : []),
                          ...(item.name.toLowerCase().includes('veg') || item.name.toLowerCase().includes('momo (veg)') ? ['V'] : [])
                        ]}
                        isPopular={['Onion Bhaji', 'Momo (Veg)', 'Momo (Chicken)', 'Chicken Tikka'].includes(item.name)}
                      />
                    ))}
                  </div>
                </div>

                {/* Mixed Grills */}
                <div id="grills">
                  <SectionTitle title="OUR MIXED GRILLS (SHARING PLATTER)" />
                  <div className="space-y-1 sm:space-y-2">
                    {menuData.menu.mixed_grills.map((item, index) => (
                      <MenuItem
                        key={`grill-${index}`}
                        name={item.name.toUpperCase()}
                        description={item.description}
                        price={item.price}
                        badges={item.name.toLowerCase().includes('veg') ? ['V'] : []}
                        isPopular={['Small Mixed Grill', 'Large Mixed Grill'].includes(item.name)}
                      />
                    ))}
                    <p className="text-xs text-gray-600 mt-3 italic px-2">Swap your chicken wings to crispy wings</p>
                  </div>
                </div>

                {/* Rice & Naans */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                  <div>
                    <SectionTitle title="RICE" />
                    <div className="space-y-1 sm:space-y-2">
                      {menuData.menu.rice.map((item, index) => (
                        <MenuItem
                          key={`rice-${index}`}
                          name={item.name.toUpperCase()}
                          price={item.price}
                          isPopular={item.name === 'Pilau Rice'}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <SectionTitle title="NAANS" />
                    <div className="space-y-1 sm:space-y-2">
                      {menuData.menu.naans.map((item, index) => (
                        <MenuItem
                          key={`naan-${index}`}
                          name={item.name.toUpperCase()}
                          price={item.price}
                          isPopular={item.name === 'Garlic'}
                        />
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column */}
              <div className="space-y-6 sm:space-y-8">
                
                {/* Speciality Dishes */}
                <div id="specialties">
                  <SectionTitle title="OLD CROWN SPECIALITY DISHES" />
                  <div className="space-y-1 sm:space-y-2">
                    {menuData.menu.old_crown_speciality_dishes.map((item, index) => (
                      <MenuItem
                        key={`specialty-${index}`}
                        name={item.name.toUpperCase()}
                        description={item.description}
                        price={item.price}
                        badges={[
                          ...(item.gluten_free ? ['GF'] : []),
                          ...(item.name.toLowerCase().includes('paneer') ? ['V'] : [])
                        ]}
                        isPopular={[
                          'Kathmandu Tikka (Served in Grill)',
                          'Himali Lamb',
                          'Chicken Rum Rum',
                          'Special Butter Chicken'
                        ].includes(item.name)}
                      />
                    ))}
                  </div>
                </div>

                {/* Home Made Authentic Dishes */}
                <div id="curries">
                  <SectionTitle title="OLD CROWN HOME MADE AUTHENTIC DISHES" />
                  
                  <SubSectionTitle title="CURRY" />
                  <div className="grid grid-cols-2 gap-x-4 sm:gap-x-6 space-y-1">
                    <MenuItem name="VEG" price={menuData.menu.home_made_authentic_dishes.prices.veg.curry} badges={['GF', 'V']} />
                    <MenuItem name="CHICKEN" price={menuData.menu.home_made_authentic_dishes.prices.chicken.curry} badges={['GF']} />
                    <MenuItem name="LAMB" price={menuData.menu.home_made_authentic_dishes.prices.lamb.curry} badges={['GF']} />
                    <MenuItem name="KING PRAWN" price={menuData.menu.home_made_authentic_dishes.prices.king_prawn.curry} badges={['GF']} />
                  </div>

                  <SubSectionTitle title="KORMA / MASALA" />
                  <div className="grid grid-cols-2 gap-x-4 sm:gap-x-6 space-y-1">
                    <MenuItem name="VEG" price={menuData.menu.home_made_authentic_dishes.prices.veg.other_curries} badges={['GF', 'V']} />
                    <MenuItem name="CHICKEN" price={menuData.menu.home_made_authentic_dishes.prices.chicken.other_curries} badges={['GF']} />
                    <MenuItem name="LAMB" price={menuData.menu.home_made_authentic_dishes.prices.lamb.other_curries} badges={['GF']} />
                    <MenuItem name="KING PRAWN" price={menuData.menu.home_made_authentic_dishes.prices.king_prawn.other_curries} badges={['GF']} />
                  </div>

                  <SubSectionTitle title="BALTI/KARAHI/BHUNA/SAAG/DHANSAK/JALFREZI/MADRAS/VINDALOO/PHAAL" />
                  <div className="grid grid-cols-2 gap-x-4 sm:gap-x-6 space-y-1">
                    <MenuItem name="VEG" price={menuData.menu.home_made_authentic_dishes.prices.veg.other_curries} badges={['GF', 'V']} />
                    <MenuItem name="CHICKEN" price={menuData.menu.home_made_authentic_dishes.prices.chicken.other_curries} badges={['GF']} />
                    <MenuItem name="LAMB" price={menuData.menu.home_made_authentic_dishes.prices.lamb.other_curries} badges={['GF']} />
                    <MenuItem name="KING PRAWN" price={menuData.menu.home_made_authentic_dishes.prices.king_prawn.other_curries} badges={['GF']} />
                  </div>

                  <SubSectionTitle title="DUM BIRYANI" />
                  <p className="text-xs text-gray-600 mb-3 italic px-2" id="biryani">well seasoned one pot dish, made by layering fragrant basmati rice</p>
                  <div className="grid grid-cols-2 gap-x-4 sm:gap-x-6 space-y-1">
                    {menuData.menu.dum_biryani.map((item, index) => (
                      <MenuItem
                        key={`biryani-${index}`}
                        name={item.name.replace(' Biryani', '').toUpperCase()}
                        price={item.price}
                        badges={item.name.includes('Veggie') ? ['V'] : []}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Section - Full Width */}
            <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t-2 border-amber-100">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                
                {/* Sides & Fries */}
                <div id="sides">
                  <SectionTitle title="SIDES & FRIES" />
                  <div className="space-y-1 sm:space-y-2">
                    {menuData.menu.fries.map((item, index) => (
                      <MenuItem
                        key={`fries-${index}`}
                        name={item.name.toUpperCase()}
                        price={item.price}
                      />
                    ))}
                  </div>

                  <SubSectionTitle title="VEGETARIAN SIDES" />
                  <div className="space-y-1 sm:space-y-2">
                    {menuData.menu.sides.map((item, index) => (
                      <MenuItem
                        key={`sides-${index}`}
                        name={item.name.toUpperCase()}
                        description={item.description}
                        price={item.price}
                        badges={[
                          ...(item.vegetarian !== false ? ['V'] : []),
                          ...(item.gluten_free ? ['GF'] : [])
                        ]}
                      />
                    ))}
                  </div>
                </div>

                {/* Pub Classics */}
                <div id="classics">
                  <SectionTitle title="PUB CLASSICS" />
                  
                  <SubSectionTitle title="PUB GRUB" />
                  <div className="space-y-1 sm:space-y-2">
                    <MenuItem name="NUGGETS" price="£6.00" />
                    <MenuItem name="SCAMPI" price="£6.00" />
                    <MenuItem name="CHICKEN PAKORA" price="£6.00" />
                    <MenuItem name="POPCORN CHICKEN" price="£5.75" />
                    <MenuItem name="CTM/KORMA" price="£7.50" />
                  </div>

                  <SubSectionTitle title="FISH & CHIPS" />
                  {menuData.menu.pub_classics.map((item, index) => {
                    if (item.name === 'Fish & Chips') {
                      return (
                        <MenuItem
                          key={`fish-chips-${index}`}
                          name="MEDIUM BATTERED COD FISH"
                          description="SERVED WITH TARTAR SAUCE"
                          price={item.price}
                          isPopular={true}
                        />
                      );
                    }
                    return null;
                  })}

                  <SubSectionTitle title="BURGERS & CHIPS" />
                  <div className="space-y-1 sm:space-y-2">
                    {menuData.menu.burgers.map((item, index) => (
                      <MenuItem
                        key={`burger-${index}`}
                        name={item.name.replace(' Burger', '').toUpperCase()}
                        price={item.price}
                        badges={item.name.includes('Veg') ? ['V'] : []}
                      />
                    ))}
                  </div>

                  <div className="mt-3 sm:mt-4 space-y-1 sm:space-y-2">
                    {menuData.menu.pub_classics.slice(1).map((item, index) => (
                      <MenuItem
                        key={`pub-classic-${index}`}
                        name={item.name.toUpperCase()}
                        price={item.price}
                      />
                    ))}
                  </div>

                  <SubSectionTitle title="SALADS" />
                  <div className="space-y-1 sm:space-y-2">
                    {menuData.menu.salads.map((item, index) => (
                      <MenuItem
                        key={`salad-${index}`}
                        name={item.name.toUpperCase()}
                        price={item.price}
                        badges={item.name.includes('Avocado') ? ['V'] : []}
                      />
                    ))}
                  </div>
                </div>

                {/* Wraps, Kids & Desserts */}
                <div id="desserts">
                  <SectionTitle title="WRAPS & DESSERTS" />
                  
                  <SubSectionTitle title="WRAPS" />
                  <p className="text-xs text-gray-600 mb-3 italic px-2">Our wraps are served with chips, salad, mayo and sweet chilli sauce</p>
                  <div className="space-y-1 sm:space-y-2">
                    {menuData.menu.wraps.map((item, index) => (
                      <MenuItem
                        key={`wrap-${index}`}
                        name={item.name.toUpperCase()}
                        price={item.price}
                        badges={item.name.includes('Cheesy') ? ['V'] : []}
                      />
                    ))}
                  </div>

                  <SubSectionTitle title="KIDS MENU" />
                  <p className="text-xs text-gray-600 mb-3 italic px-2">Choose either chips or rice</p>
                  <div className="space-y-1 sm:space-y-2">
                    {menuData.menu.kids_menu.map((item, index) => (
                      <MenuItem
                        key={`kids-${index}`}
                        name={item.name.toUpperCase()}
                        price={item.price}
                      />
                    ))}
                  </div>

                  <SubSectionTitle title="DESSERTS" />
                  <div className="space-y-1 sm:space-y-2">
                    {menuData.menu.desserts.map((item, index) => (
                      <MenuItem
                        key={`dessert-${index}`}
                        name={item.name.toUpperCase()}
                        description={item.description}
                        price={item.price}
                        isPopular={item.name === 'Gulab Jamun'}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Footer */}
        <div className="mt-6 sm:mt-8 bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-200">
          <div className="text-center space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 text-xs sm:text-sm">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-emerald-100 border border-emerald-200 rounded flex items-center justify-center flex-shrink-0">
                  <Leaf className="w-2 h-2 text-emerald-600" />
                </span>
                <span className="font-medium text-emerald-700">GF</span> = Gluten Free
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-green-100 border border-green-200 rounded flex items-center justify-center flex-shrink-0">
                  <Leaf className="w-2 h-2 text-green-600" />
                </span>
                <span className="font-medium text-green-700">V</span> = Vegetarian
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3 text-amber-500 fill-current flex-shrink-0" />
                <span className="font-medium text-amber-700">Popular Items</span>
              </span>
            </div>
            <div className="border-t border-gray-200 pt-3 sm:pt-4">
              <p className="text-sm text-red-600 font-medium mb-2">
                {menuData.notes.allergen_warning}
              </p>
              <p className="text-sm text-amber-700 font-medium mt-2">
                {menuData.notes.bespoke_orders}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OldCrownMenu;
