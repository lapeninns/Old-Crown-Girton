'use client';

import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  UtensilsCrossed, 
  Wheat, 
  Leaf, 
  Fish, 
  Milk, 
  Clock, 
  MapPin, 
  Star,
  Filter,
  X,
  ChefHat,
  Sparkles,
  Phone,
  Info,
  Menu as MenuIcon
} from 'lucide-react';
import menuData from '../../menu-new.json';

// Simplified Types - only using JSON data

interface BadgeProps {
  text: string;
  className?: string;
}

interface MenuItemProps {
  name: string;
  description?: string;
  price: string;
  badges?: string[];
}

interface FilterState {
  dietary: string[];
  showGlutenFree: boolean;
  showVegetarian: boolean;
}

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
  icon?: React.ReactNode;
}

const DIETARY_FILTERS = [
  { id: 'gluten_free', label: 'Gluten Free', icon: <Wheat className="w-4 h-4" />, color: 'blue' },
  { id: 'vegetarian', label: 'Vegetarian', icon: <Leaf className="w-4 h-4" />, color: 'green' },
];

const MENU_CATEGORIES = [
  { id: 'starters', label: 'Starters', icon: UtensilsCrossed, color: 'amber' },
  { id: 'grills', label: 'Mixed Grills', icon: Fish, color: 'orange' },
  { id: 'specialties', label: 'Specialties', icon: Star, color: 'purple' },
  { id: 'curries', label: 'Curries', icon: ChefHat, color: 'red' },
  { id: 'biryani', label: 'Biryani', icon: Leaf, color: 'green' },
  { id: 'rice', label: 'Rice & Naans', icon: Wheat, color: 'yellow' },
  { id: 'sides', label: 'Sides', icon: Milk, color: 'blue' },
  { id: 'classics', label: 'Pub Classics', icon: UtensilsCrossed, color: 'indigo' },
  { id: 'desserts', label: 'Desserts', icon: Sparkles, color: 'pink' }
];

const CompactMenu: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeSection, setActiveSection] = useState<string>('starters');
  const [filters, setFilters] = useState<FilterState>({
    dietary: [],
    showGlutenFree: false,
    showVegetarian: false
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  // Scroll to section
  const scrollToSection = useCallback((sectionId: string) => {
    setActiveSection(sectionId);
    setShowMobileMenu(false);
    const element = sectionRefs.current[sectionId];
    if (element) {
      const offsetTop = element.offsetTop - 140; 
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  }, []);

  // Intersection observer for active section tracking
  useEffect(() => {
    const observerOptions = {
      root: null as Element | null,
      rootMargin: '-140px 0px -60% 0px',
      threshold: 0.1
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    MENU_CATEGORIES.forEach((category) => {
      const element = sectionRefs.current[category.id];
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  // Compact Badge Component
  const Badge: React.FC<BadgeProps> = ({ text, className = '' }) => {
    const config = {
      'GF': { bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700', icon: <Wheat className="w-2.5 h-2.5" /> },
      'V': { bg: 'bg-green-50 border-green-200', text: 'text-green-700', icon: <Leaf className="w-2.5 h-2.5" /> }
    }[text] || { bg: 'bg-gray-50 border-gray-200', text: 'text-gray-700', icon: null };
    
    return (
      <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium border ${config.bg} ${config.text} ${className}`}>
        {config.icon}
        {text}
      </span>
    );
  };

  // Compact Menu Item Component
  const MenuItem: React.FC<MenuItemProps> = ({ name, description, price, badges = [] }) => {
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
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="group flex items-start justify-between py-2 sm:py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 transition-colors duration-200"
      >
        <div className="flex-1 min-w-0 pr-3">
          <div className="flex items-start gap-2 mb-1">
            <h3 className="font-medium text-gray-900 text-sm sm:text-base leading-tight group-hover:text-crown-gold transition-colors">
              {name}
            </h3>
            {badges.length > 0 && (
              <div className="flex gap-1 flex-shrink-0">
                {badges.map((badge, idx) => (
                  <Badge key={idx} text={badge} />
                ))}
              </div>
            )}
          </div>
          {description && (
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-2">
              {description}
            </p>
          )}
        </div>
        <div className="flex-shrink-0">
          <span className="font-semibold text-crown-gold text-sm sm:text-base group-hover:text-crown-gold-dark transition-colors">
            {price}
          </span>
        </div>
      </motion.div>
    );
  };

  // Section Title Component
  const SectionTitle: React.FC<SectionTitleProps> = ({ title, subtitle, className = "", icon }) => (
    <div className={`text-center mb-6 ${className}`}>
      <div className="flex items-center justify-center gap-2 mb-2">
        {icon && <div className="text-crown-gold">{icon}</div>}
        <h2 className="text-xl sm:text-2xl font-display font-bold text-gray-900">{title}</h2>
      </div>
      {subtitle && <p className="text-gray-600 text-sm">{subtitle}</p>}
      <div className="w-16 h-0.5 bg-crown-gold mx-auto mt-3 rounded-full" />
    </div>
  );

  // Filter Panel
  const FilterPanel = () => (
    <AnimatePresence>
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white border-b border-gray-200 overflow-hidden"
        >
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex flex-wrap gap-4">
              <h3 className="font-medium text-gray-900 w-full sm:w-auto">Filter by:</h3>
              {DIETARY_FILTERS.map((filter) => (
                <label key={filter.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.dietary.includes(filter.id)}
                    onChange={(e) => {
                      const newDietary = e.target.checked
                        ? [...filters.dietary, filter.id]
                        : filters.dietary.filter(d => d !== filter.id);
                      setFilters(prev => ({ ...prev, dietary: newDietary }));
                    }}
                    className="rounded border-gray-300 text-crown-gold focus:ring-crown-gold"
                  />
                  <span className="flex items-center gap-1 text-sm">
                    {filter.icon}
                    {filter.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Compact Header */}
      <div className="relative bg-gradient-to-r from-crown-gold/5 via-white to-crown-gold/5 border-b border-crown-gold/20">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ChefHat className="w-8 h-8 text-crown-gold" />
            <div>
              <h1 className="text-3xl sm:text-4xl font-display font-bold text-gray-900">
                {menuData.restaurant}
              </h1>
              <p className="text-crown-gold font-medium">Authentic Menu</p>
            </div>
          </div>
          
          {/* Restaurant Hours - Compact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-6">
            <div className="bg-white/80 rounded-lg p-4 border border-crown-gold/20">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-crown-gold" />
                <h3 className="font-medium text-gray-900">Kitchen</h3>
              </div>
              <div className="text-xs space-y-1 text-gray-700">
                <div>Mon-Fri: {menuData.hours.kitchen.monday_friday}</div>
                <div>Sat: {menuData.hours.kitchen.saturday}</div>
                <div>Sun: {menuData.hours.kitchen.sunday}</div>
              </div>
            </div>
            
            <div className="bg-white/80 rounded-lg p-4 border border-crown-gold/20">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-crown-gold" />
                <h3 className="font-medium text-gray-900">Bar</h3>
              </div>
              <div className="text-xs space-y-1 text-gray-700">
                <div>Mon-Thu: {menuData.hours.bar.monday_thursday}</div>
                <div>Fri-Sat: {menuData.hours.bar.friday_saturday}</div>
                <div>Sun: {menuData.hours.bar.sunday}</div>
              </div>
            </div>
          </div>

          <a
            href="tel:01223276027"
            className="inline-flex items-center gap-2 bg-crown-gold hover:bg-crown-gold-dark text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <Phone className="w-4 h-4" />
            Call: 01223 276027
          </a>
        </div>
      </div>

      {/* Compact Search Bar */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search menu items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-crown-gold focus:border-transparent transition-all text-sm"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                showFilters ? 'bg-crown-gold text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>
        <FilterPanel />
      </div>

      {/* Compact Category Navigation */}
      <div className="sticky top-16 z-40 bg-white/90 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          {/* Mobile Menu Toggle */}
          <div className="flex items-center justify-between py-2 sm:hidden">
            <span className="text-sm font-medium text-gray-900">Sections</span>
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-crown-gold hover:bg-crown-gold/10 rounded-lg transition-colors"
            >
              <MenuIcon className="w-4 h-4" />
              Menu
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden sm:flex gap-1 overflow-x-auto scrollbar-hide py-3">
            {MENU_CATEGORIES.map((category) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => scrollToSection(category.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    activeSection === category.id
                      ? 'bg-crown-gold text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <IconComponent className="w-3.5 h-3.5" />
                  {category.label}
                </button>
              );
            })}
          </nav>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {showMobileMenu && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="sm:hidden border-t border-gray-100"
              >
                <div className="py-3 grid grid-cols-2 gap-1">
                  {MENU_CATEGORIES.map((category) => {
                    const IconComponent = category.icon;
                    return (
                      <button
                        key={category.id}
                        onClick={() => scrollToSection(category.id)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          activeSection === category.id
                            ? 'bg-crown-gold text-white' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <IconComponent className="w-4 h-4" />
                        {category.label}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="space-y-12">
          
          {/* Starters */}
          <section 
            id="starters" 
            ref={(el) => { sectionRefs.current['starters'] = el; }}
            className="scroll-mt-32"
          >
            <SectionTitle 
              title="Starters"
              icon={<UtensilsCrossed className="w-5 h-5" />}
            />
            <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
              <div className="p-4 space-y-1">
                {menuData.menu.starters.map((item, index) => (
                  <MenuItem
                    key={`starter-${index}`}
                    name={item.name}
                    description={item.description}
                    price={item.price}
                    badges={[
                      ...(item.gluten_free ? ['GF'] : []),
                      ...(item.name.toLowerCase().includes('veg') ? ['V'] : [])
                    ]}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Mixed Grills */}
          <section 
            id="grills" 
            ref={(el) => { sectionRefs.current['grills'] = el; }}
            className="scroll-mt-32"
          >
            <SectionTitle 
              title="Mixed Grills"
              subtitle="Sharing platters"
              icon={<Fish className="w-5 h-5" />}
            />
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 space-y-1">
                {menuData.menu.mixed_grills.map((item, index) => (
                  <MenuItem
                    key={`grill-${index}`}
                    name={item.name}
                    description={item.description}
                    price={item.price}
                    badges={item.name.toLowerCase().includes('veg') ? ['V'] : []}
                  />
                ))}
              </div>
              <div className="px-4 pb-4">
                <p className="text-xs text-amber-700 bg-amber-50 p-2 rounded border border-amber-200">
                  <Info className="w-3 h-3 inline mr-1" />
                  Swap your chicken wings to crispy wings
                </p>
              </div>
            </div>
          </section>

          {/* Old Crown Specialties */}
          <section 
            id="specialties" 
            ref={(el) => { sectionRefs.current['specialties'] = el; }}
            className="scroll-mt-32"
          >
            <SectionTitle 
              title="Old Crown Speciality Dishes"
              icon={<Star className="w-5 h-5" />}
            />
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 space-y-1">
                {menuData.menu.old_crown_speciality_dishes.map((item, index) => (
                  <MenuItem
                    key={`specialty-${index}`}
                    name={item.name}
                    description={item.description}
                    price={item.price}
                    badges={[
                      ...(item.gluten_free ? ['GF'] : []),
                      ...(item.name.toLowerCase().includes('paneer') ? ['V'] : [])
                    ]}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Home Made Authentic Dishes */}
          <section 
            id="curries" 
            ref={(el) => { sectionRefs.current['curries'] = el; }}
            className="scroll-mt-32"
          >
            <SectionTitle 
              title="Home Made Authentic Dishes"
              icon={<ChefHat className="w-5 h-5" />}
            />
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 space-y-4">
                {/* Curry Section */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-2 text-sm border-l-3 border-crown-gold pl-2">CURRY</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between">
                      <span>Veg <Badge text="GF" /> <Badge text="V" /></span>
                      <span className="font-medium text-crown-gold">{menuData.menu.home_made_authentic_dishes.prices.veg.curry}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Chicken <Badge text="GF" /></span>
                      <span className="font-medium text-crown-gold">{menuData.menu.home_made_authentic_dishes.prices.chicken.curry}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Lamb <Badge text="GF" /></span>
                      <span className="font-medium text-crown-gold">{menuData.menu.home_made_authentic_dishes.prices.lamb.curry}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>King Prawn <Badge text="GF" /></span>
                      <span className="font-medium text-crown-gold">{menuData.menu.home_made_authentic_dishes.prices.king_prawn.curry}</span>
                    </div>
                  </div>
                </div>

                {/* Korma/Masala Section */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-2 text-sm border-l-3 border-crown-gold pl-2">KORMA / MASALA</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between">
                      <span>Veg <Badge text="GF" /> <Badge text="V" /></span>
                      <span className="font-medium text-crown-gold">{menuData.menu.home_made_authentic_dishes.prices.veg.other_curries}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Chicken <Badge text="GF" /></span>
                      <span className="font-medium text-crown-gold">{menuData.menu.home_made_authentic_dishes.prices.chicken.other_curries}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Lamb <Badge text="GF" /></span>
                      <span className="font-medium text-crown-gold">{menuData.menu.home_made_authentic_dishes.prices.lamb.other_curries}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>King Prawn <Badge text="GF" /></span>
                      <span className="font-medium text-crown-gold">{menuData.menu.home_made_authentic_dishes.prices.king_prawn.other_curries}</span>
                    </div>
                  </div>
                </div>

                {/* Other Curries Section */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-2 text-sm border-l-3 border-crown-gold pl-2">
                    BALTI / KARAHI / BHUNA / SAAG / DHANSAK / JALFREZI / MADRAS / VINDALOO / PHAAL
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between">
                      <span>Veg <Badge text="GF" /> <Badge text="V" /></span>
                      <span className="font-medium text-crown-gold">{menuData.menu.home_made_authentic_dishes.prices.veg.other_curries}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Chicken <Badge text="GF" /></span>
                      <span className="font-medium text-crown-gold">{menuData.menu.home_made_authentic_dishes.prices.chicken.other_curries}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Lamb <Badge text="GF" /></span>
                      <span className="font-medium text-crown-gold">{menuData.menu.home_made_authentic_dishes.prices.lamb.other_curries}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>King Prawn <Badge text="GF" /></span>
                      <span className="font-medium text-crown-gold">{menuData.menu.home_made_authentic_dishes.prices.king_prawn.other_curries}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Dum Biryani */}
          <section 
            id="biryani" 
            ref={(el) => { sectionRefs.current['biryani'] = el; }}
            className="scroll-mt-32"
          >
            <SectionTitle 
              title="Dum Biryani"
              subtitle="Well seasoned one pot dish, made by layering fragrant basmati rice"
              icon={<Leaf className="w-5 h-5" />}
            />
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 space-y-1">
                {menuData.menu.dum_biryani.map((item, index) => (
                  <MenuItem
                    key={`biryani-${index}`}
                    name={item.name}
                    description={item.description}
                    price={item.price}
                    badges={item.name.includes('Veggie') ? ['V'] : []}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Rice & Naans */}
          <section 
            id="rice" 
            ref={(el) => { sectionRefs.current['rice'] = el; }}
            className="scroll-mt-32"
          >
            <SectionTitle 
              title="Rice & Naans"
              icon={<Wheat className="w-5 h-5" />}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Rice */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-3 border-b border-gray-100">
                  <h3 className="font-medium text-gray-900">Rice</h3>
                </div>
                <div className="p-3 space-y-1">
                  {menuData.menu.rice.map((item, index) => (
                    <MenuItem
                      key={`rice-${index}`}
                      name={item.name}
                      price={item.price}
                    />
                  ))}
                </div>
              </div>

              {/* Naans */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-3 border-b border-gray-100">
                  <h3 className="font-medium text-gray-900">Naans</h3>
                </div>
                <div className="p-3 space-y-1">
                  {menuData.menu.naans.map((item, index) => (
                    <MenuItem
                      key={`naan-${index}`}
                      name={item.name}
                      price={item.price}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Sides */}
          <section 
            id="sides" 
            ref={(el) => { sectionRefs.current['sides'] = el; }}
            className="scroll-mt-32"
          >
            <SectionTitle 
              title="Sides & Fries"
              icon={<Milk className="w-5 h-5" />}
            />
            <div className="space-y-6">
              {/* Fries */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-3 border-b border-gray-100">
                  <h3 className="font-medium text-gray-900">Fries</h3>
                </div>
                <div className="p-3 space-y-1">
                  {menuData.menu.fries.map((item, index) => (
                    <MenuItem
                      key={`fries-${index}`}
                      name={item.name}
                      price={item.price}
                    />
                  ))}
                </div>
              </div>

              {/* Vegetarian Sides */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-3 border-b border-gray-100">
                  <h3 className="font-medium text-gray-900">Vegetarian Sides</h3>
                </div>
                <div className="p-3 space-y-1">
                  {menuData.menu.sides.map((item, index) => (
                    <MenuItem
                      key={`sides-${index}`}
                      name={item.name}
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
            </div>
          </section>

          {/* Pub Classics & More */}
          <section 
            id="classics" 
            ref={(el) => { sectionRefs.current['classics'] = el; }}
            className="scroll-mt-32"
          >
            <SectionTitle 
              title="Pub Classics & More"
              icon={<UtensilsCrossed className="w-5 h-5" />}
            />
            <div className="space-y-6">
              {/* Pub Classics */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-3 border-b border-gray-100">
                  <h3 className="font-medium text-gray-900">Pub Classics</h3>
                </div>
                <div className="p-3 space-y-1">
                  {menuData.menu.pub_classics.map((item, index) => (
                    <MenuItem
                      key={`pub-${index}`}
                      name={item.name}
                      description={item.description}
                      price={item.price}
                    />
                  ))}
                </div>
              </div>

              {/* Burgers */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-3 border-b border-gray-100">
                  <h3 className="font-medium text-gray-900">Burgers</h3>
                </div>
                <div className="p-3 space-y-1">
                  {menuData.menu.burgers.map((item, index) => (
                    <MenuItem
                      key={`burger-${index}`}
                      name={item.name}
                      description={item.description}
                      price={item.price}
                      badges={item.name.includes('Veg') ? ['V'] : []}
                    />
                  ))}
                </div>
              </div>

              {/* Wraps */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-3 border-b border-gray-100">
                  <h3 className="font-medium text-gray-900">Wraps</h3>
                  <p className="text-xs text-gray-600 mt-1">Served with chips, salad, mayo and sweet chilli sauce</p>
                </div>
                <div className="p-3 space-y-1">
                  {menuData.menu.wraps.map((item, index) => (
                    <MenuItem
                      key={`wrap-${index}`}
                      name={item.name}
                      price={item.price}
                      badges={item.name.includes('Cheesy') ? ['V'] : []}
                    />
                  ))}
                </div>
              </div>

              {/* Salads */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-3 border-b border-gray-100">
                  <h3 className="font-medium text-gray-900">Salads</h3>
                </div>
                <div className="p-3 space-y-1">
                  {menuData.menu.salads.map((item, index) => (
                    <MenuItem
                      key={`salad-${index}`}
                      name={item.name}
                      price={item.price}
                      badges={item.name.includes('Avocado') ? ['V'] : []}
                    />
                  ))}
                </div>
              </div>

              {/* Kids Menu */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-3 border-b border-gray-100">
                  <h3 className="font-medium text-gray-900">Kids Menu</h3>
                  <p className="text-xs text-gray-600 mt-1">Choose either chips or rice</p>
                </div>
                <div className="p-3 space-y-1">
                  {menuData.menu.kids_menu.map((item, index) => (
                    <MenuItem
                      key={`kids-${index}`}
                      name={item.name}
                      price={item.price}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Desserts */}
          <section 
            id="desserts" 
            ref={(el) => { sectionRefs.current['desserts'] = el; }}
            className="scroll-mt-32"
          >
            <SectionTitle 
              title="Desserts"
              icon={<Sparkles className="w-5 h-5" />}
            />
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 space-y-1">
                {menuData.menu.desserts.map((item, index) => (
                  <MenuItem
                    key={`dessert-${index}`}
                    name={item.name}
                    description={item.description}
                    price={item.price}
                  />
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-12 bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-center space-y-4">
            {/* Legend */}
            <div className="flex flex-wrap justify-center items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Badge text="GF" />
                <span className="text-gray-600">= Gluten Free</span>
              </div>
              <div className="flex items-center gap-1">
                <Badge text="V" />
                <span className="text-gray-600">= Vegetarian</span>
              </div>
            </div>
            
            {/* Important Notes */}
            <div className="space-y-3 pt-4 border-t border-gray-200">
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-700 flex items-start gap-2">
                  <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  {menuData.notes.allergen_warning}
                </p>
              </div>
              <div className="bg-crown-gold/10 border border-crown-gold/30 rounded-lg p-3">
                <p className="text-sm text-crown-gold-dark flex items-start gap-2">
                  <ChefHat className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  {menuData.notes.bespoke_orders}
                </p>
              </div>
            </div>
            
            {/* Contact CTA */}
            <div className="pt-4">
              <a
                href="tel:01223276027"
                className="inline-flex items-center gap-2 bg-crown-gold hover:bg-crown-gold-dark text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                <Phone className="w-4 h-4" />
                Call to Order: 01223 276027
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompactMenu;
