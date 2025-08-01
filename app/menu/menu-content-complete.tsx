'use client';

import React, { useState, useEffect, useCallback, useRef, useMemo, memo } from 'react';
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
  Heart,
  SlidersHorizontal as Filter,
  X,
  ChefHat,
  Sparkles,
  ArrowRight,
  Info,
  Phone,
  Eye,
  Plus,
  ShoppingCart,
  Menu as MenuIcon
} from 'lucide-react';
import menuData from '../../menu-new.json';
import { useDebounceSearch } from '../../hooks/usePerformance';

// Inline Card Component
interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = true,
  onClick
}) => {
  const baseClasses = 'bg-white rounded-xl border border-gray-100 transition-all duration-300';
  const hoverClasses = hover ? 'hover:border-crown-gold/30 hover:shadow-lg' : '';
  const clickableClasses = onClick ? 'cursor-pointer' : '';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={hover ? { y: -2 } : undefined}
      className={`${baseClasses} ${hoverClasses} ${clickableClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

// Inline Button Component
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ComponentType<{ className?: string }>;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  isLoading = false,
  className = '',
  children,
  disabled,
  onClick,
  type = 'button'
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-crown-gold hover:bg-crown-gold-dark text-white focus:ring-crown-gold shadow-md hover:shadow-lg',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900 focus:ring-gray-500',
    outline: 'border-2 border-crown-gold text-crown-gold hover:bg-crown-gold hover:text-white focus:ring-crown-gold',
    ghost: 'text-crown-gold hover:bg-crown-gold/10 focus:ring-crown-gold'
  };
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm gap-1.5',
    md: 'px-6 py-3 text-base gap-2',
    lg: 'px-8 py-4 text-lg gap-2.5'
  };
  
  const iconSize = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || isLoading}
      onClick={onClick}
      type={type}
    >
      {isLoading ? (
        <div className={`animate-spin rounded-full border-2 border-current border-t-transparent ${iconSize[size]}`} />
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className={iconSize[size]} />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className={iconSize[size]} />}
        </>
      )}
    </motion.button>
  );
};

// Enhanced Type definitions
interface BadgeProps {
  text: string;
  type?: 'dietary' | 'popular' | 'spicy' | 'new';
  icon?: React.ReactNode;
  className?: string;
}

interface MenuItemProps {
  name: string;
  description?: string;
  price: string;
  badges?: string[];
  isPopular?: boolean;
  isSpicy?: boolean;
  allergens?: string[];
  onAddToFavorites?: () => void;
  isFavorite?: boolean;
  imageUrl?: string;
  onAddToCart?: () => void;
}

interface FilterState {
  dietary: string[];
  priceRange: [number, number];
  category: string;
  showFavoritesOnly: boolean;
}

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
  icon?: React.ReactNode;
}

const DIETARY_FILTERS = [
  { id: 'vegetarian', label: 'Vegetarian', icon: <Leaf className="w-4 h-4" />, color: 'green' },
  { id: 'gluten_free', label: 'Gluten Free', icon: <Wheat className="w-4 h-4" />, color: 'blue' },
  { id: 'spicy', label: 'Spicy', icon: <Sparkles className="w-4 h-4" />, color: 'red' },
];

const MENU_CATEGORIES = [
  { 
    id: 'starters', 
    label: 'Starters', 
    icon: UtensilsCrossed, 
    color: 'amber',
    description: 'Perfect appetizers to start your journey'
  },
  { 
    id: 'specialties', 
    label: 'Specialties', 
    icon: Star, 
    color: 'purple',
    description: 'Signature dishes unique to Old Crown'
  },
  { 
    id: 'grills', 
    label: 'Mixed Grills', 
    icon: Fish, 
    color: 'orange',
    description: 'Sharing platters from our tandoor'
  },
  { 
    id: 'curries', 
    label: 'Curries', 
    icon: ChefHat, 
    color: 'red',
    description: 'Authentic home-made dishes'
  },
  { 
    id: 'biryani', 
    label: 'Biryani', 
    icon: Leaf, 
    color: 'green',
    description: 'Fragrant layered rice dishes'
  },
  { 
    id: 'sides', 
    label: 'Sides', 
    icon: Milk, 
    color: 'blue',
    description: 'Perfect accompaniments'
  },
  { 
    id: 'classics', 
    label: 'Pub Classics', 
    icon: UtensilsCrossed, 
    color: 'indigo',
    description: 'Traditional British favorites'
  },
  { 
    id: 'desserts', 
    label: 'Desserts', 
    icon: Sparkles, 
    color: 'pink',
    description: 'Sweet endings to your meal'
  }
];

const CompleteRedesignedMenu: React.FC = memo(() => {
  // Performance-optimized search with debouncing  
  const { searchTerm, debouncedTerm, setSearchTerm, clearSearch, isSearching } = useDebounceSearch('', 300);
  
  // Enhanced state management
  const [activeSection, setActiveSection] = useState<string>('starters');
  const [filters, setFilters] = useState<FilterState>({
    dietary: [],
    priceRange: [0, 25],
    category: 'all',
    showFavoritesOnly: false
  });
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [cart, setCart] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  // Refs for performance and accessibility
  const searchInputRef = useRef<HTMLInputElement>(null);
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  // Optimized event handlers with useCallback
  const toggleFilters = useCallback(() => {
    setShowFilters(!showFilters);
  }, [showFilters]);

  const toggleMobileMenu = useCallback(() => {
    setShowMobileMenu(!showMobileMenu);
  }, [showMobileMenu]);

  const handlePhoneCall = useCallback(() => {
    window.location.href = 'tel:01223276027';
  }, []);

  // Memoized filtered menu items for performance
  const filteredStarters = useMemo(() => {
    return menuData.menu.starters.filter(item => {
      const matchesSearch = debouncedTerm === '' || 
        item.name.toLowerCase().includes(debouncedTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(debouncedTerm.toLowerCase());
      
      // Add dietary filter logic here if needed
      return matchesSearch;
    });
  }, [debouncedTerm]);

  const filteredSpecialties = useMemo(() => {
    return menuData.menu.old_crown_speciality_dishes.filter(item => {
      const matchesSearch = debouncedTerm === '' || 
        item.name.toLowerCase().includes(debouncedTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(debouncedTerm.toLowerCase());
      
      return matchesSearch;
    });
  }, [debouncedTerm]);

  const filteredGrills = useMemo(() => {
    return menuData.menu.mixed_grills.filter(item => {
      const matchesSearch = debouncedTerm === '' || 
        item.name.toLowerCase().includes(debouncedTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(debouncedTerm.toLowerCase());
      
      return matchesSearch;
    });
  }, [debouncedTerm]);

  // Smooth scroll to section with enhanced UX
  const scrollToSection = useCallback((sectionId: string) => {
    setActiveSection(sectionId);
    setShowMobileMenu(false);
    const element = sectionRefs.current[sectionId];
    if (element) {
      const offsetTop = element.offsetTop - 180; 
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  }, []);

  // Enhanced intersection observer for active section tracking
  useEffect(() => {
    const observerOptions = {
      root: null as Element | null,
      rootMargin: '-180px 0px -60% 0px',
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

  // Enhanced Badge Component
  const Badge = memo<BadgeProps>(({ text, type = 'dietary', icon, className = '' }) => {
    const badgeConfig: Record<string, Record<string, any>> = {
      dietary: {
        'GF': { 
          bg: 'bg-blue-50 border-blue-200', 
          text: 'text-blue-700', 
          icon: <Wheat className="w-3 h-3" />,
          label: 'Gluten Free'
        },
        'V': { 
          bg: 'bg-green-50 border-green-200', 
          text: 'text-green-700', 
          icon: <Leaf className="w-3 h-3" />,
          label: 'Vegetarian'
        },
        'SPICY': { 
          bg: 'bg-red-50 border-red-200', 
          text: 'text-red-700', 
          icon: <Sparkles className="w-3 h-3" />,
          label: 'Spicy'
        }
      },
      popular: {
        'POPULAR': { 
          bg: 'bg-amber-50 border-amber-200', 
          text: 'text-amber-700', 
          icon: <Star className="w-3 h-3 fill-current" />,
          label: 'Popular'
        }
      }
    };
    
    const config = badgeConfig[type]?.[text] || badgeConfig.dietary.V;
    
    return (
      <motion.span 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border transition-all duration-200 ${config.bg} ${config.text} ${className}`}
        role="status"
        aria-label={config.label}
      >
        {icon || config.icon}
        <span className="hidden sm:inline">{text}</span>
      </motion.span>
    );
  });
  
  Badge.displayName = 'Badge';

  // Enhanced Menu Item Component with React.memo for performance
  const MenuItem = memo<MenuItemProps>(({ 
    name, 
    description, 
    price, 
    badges = [], 
    isPopular = false,
    isSpicy = false,
    onAddToCart,
    isFavorite = false
  }) => {
    const itemId = `item-${name.replace(/\s+/g, '-').toLowerCase()}`;
    const isExpanded = expandedItems.has(itemId);
    const isInCart = cart.has(name);
    
    // Direct filtering using debounced search term for performance
    if (debouncedTerm) {
      const searchLower = debouncedTerm.toLowerCase();
      if (!name.toLowerCase().includes(searchLower) && 
          !(description && description.toLowerCase().includes(searchLower))) {
        return null;
      }
    }
    
    const toggleExpanded = () => {
      const newExpanded = new Set(expandedItems);
      if (isExpanded) {
        newExpanded.delete(itemId);
      } else {
        newExpanded.add(itemId);
      }
      setExpandedItems(newExpanded);
    };

    const toggleFavorite = () => {
      const newFavorites = new Set(favorites);
      if (isFavorite) {
        newFavorites.delete(name);
      } else {
        newFavorites.add(name);
      }
      setFavorites(newFavorites);
    };

    const handleAddToCart = () => {
      const newCart = new Set(cart);
      if (isInCart) {
        newCart.delete(name);
      } else {
        newCart.add(name);
      }
      setCart(newCart);
      onAddToCart?.();
    };

    return (
      <Card className="group relative overflow-hidden">
        <div className="p-4 sm:p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              {/* Image placeholder */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-crown-gold/20 to-crown-gold/10 rounded-xl flex-shrink-0 flex items-center justify-center border border-crown-gold/20 overflow-hidden">
                <ChefHat className="w-6 h-6 sm:w-8 sm:h-8 text-crown-gold/60" />
                {/* Placeholder for actual image */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/10" />
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base leading-tight group-hover:text-crown-gold transition-colors line-clamp-2">
                    {name}
                  </h3>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="font-bold text-crown-gold text-lg sm:text-xl whitespace-nowrap">
                      {price}
                    </span>
                    <button
                      onClick={toggleFavorite}
                      className="p-1.5 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-crown-gold"
                      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <Heart 
                        className={`w-4 h-4 transition-colors ${
                          isFavorite 
                            ? 'fill-red-500 text-red-500' 
                            : 'text-gray-400 hover:text-red-500'
                        }`} 
                      />
                    </button>
                  </div>
                </div>
                
                {/* Badges */}
                {(badges.length > 0 || isPopular || isSpicy) && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {isPopular && <Badge text="POPULAR" type="popular" />}
                    {isSpicy && <Badge text="SPICY" type="dietary" />}
                    {badges.map((badge, idx) => (
                      <Badge key={idx} text={badge} />
                    ))}
                  </div>
                )}
                
                {/* Description */}
                {description && (
                  <div className="relative">
                    <p className={`text-sm text-gray-600 leading-relaxed transition-all duration-300 ${
                        isExpanded ? '' : 'line-clamp-2'
                      }`}>
                      {description}
                    </p>
                    {description.length > 100 && (
                      <button
                        onClick={toggleExpanded}
                        className="text-crown-gold text-sm font-medium hover:text-crown-gold-dark transition-colors mt-1 focus:outline-none focus:ring-2 focus:ring-crown-gold rounded"
                        aria-expanded={isExpanded}
                      >
                        {isExpanded ? 'Show less' : 'Read more'}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <Button 
              variant="ghost" 
              size="sm"
              icon={Eye}
              className="text-crown-gold hover:text-crown-gold-dark"
            >
              <span className="hidden sm:inline">Details</span>
            </Button>
            <Button 
              variant={isInCart ? "secondary" : "primary"}
              size="sm"
              icon={isInCart ? ShoppingCart : Plus}
              onClick={handleAddToCart}
            >
              {isInCart ? 'In Cart' : 'Add to Cart'}
            </Button>
          </div>
        </div>
      </Card>
    );
  });
  
  MenuItem.displayName = 'MenuItem';

  // Enhanced Section Title Component with React.memo
  const SectionTitle = memo<SectionTitleProps>(({ title, subtitle, className = "", icon }) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`text-center mb-8 sm:mb-12 ${className}`}
    >
      <div className="flex items-center justify-center gap-3 mb-4">
        {icon && (
          <div className="p-3 bg-crown-gold/10 rounded-full">
            {icon}
          </div>
        )}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-gray-900">
          {title}
        </h2>
      </div>
      {subtitle && (
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          {subtitle}
        </p>
      )}
      <div className="w-24 h-1 bg-gradient-to-r from-crown-gold to-crown-gold-dark mx-auto mt-6 rounded-full" />
    </motion.div>
  ));
  
  SectionTitle.displayName = 'SectionTitle';

  // Enhanced Filter Panel
  const FilterPanel = () => (
    <AnimatePresence>
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white border-b border-gray-200 overflow-hidden"
        >
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Dietary Filters */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Dietary Requirements</h3>
                <div className="space-y-2">
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
              
              {/* Price Range */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Price Range</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">£{filters.priceRange[0]}</span>
                    <input
                      type="range"
                      min="0"
                      max="25"
                      value={filters.priceRange[1]}
                      onChange={(e) => {
                        setFilters(prev => ({ 
                          ...prev, 
                          priceRange: [prev.priceRange[0], parseInt(e.target.value)] 
                        }));
                      }}
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-600">£{filters.priceRange[1]}</span>
                  </div>
                </div>
              </div>
              
              {/* View Options */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">View Options</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.showFavoritesOnly}
                      onChange={(e) => {
                        setFilters(prev => ({ ...prev, showFavoritesOnly: e.target.checked }));
                      }}
                      className="rounded border-gray-300 text-crown-gold focus:ring-crown-gold"
                    />
                    <span className="flex items-center gap-1 text-sm">
                      <Heart className="w-4 h-4" />
                      Favorites Only
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-crown-cream/30">
      {/* Enhanced Hero Header */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative bg-gradient-to-r from-crown-gold/5 via-white to-crown-gold/10 border-b border-crown-gold/20"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="w-full h-full bg-repeat bg-center" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4941E' fill-opacity='0.08'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 sm:py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-16 h-16 bg-crown-gold/20 rounded-full flex items-center justify-center">
                <ChefHat className="w-8 h-8 text-crown-gold" />
              </div>
              <div className="text-left">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-gray-900">
                  {menuData.restaurant}
                </h1>
                <p className="text-crown-gold text-xl sm:text-2xl font-medium">
                  Authentic Cuisine Menu
                </p>
              </div>
            </div>
            
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Experience the finest authentic Nepalese and Indian cuisine, crafted with traditional recipes 
              and the freshest ingredients for an unforgettable dining experience.
            </p>
            
            {/* Restaurant Hours Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-crown-gold/20"
              >
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="p-2 bg-crown-gold/20 rounded-full">
                    <Clock className="w-5 h-5 text-crown-gold" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-lg">Kitchen Hours</h3>
                </div>
                <div className="space-y-2 text-gray-700">
                  <div className="flex justify-between">
                    <span>Monday - Friday:</span>
                    <span className="font-medium">{menuData.hours.kitchen.monday_friday}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday:</span>
                    <span className="font-medium">{menuData.hours.kitchen.saturday}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday:</span>
                    <span className="font-medium">{menuData.hours.kitchen.sunday}</span>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-crown-gold/20"
              >
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="p-2 bg-crown-gold/20 rounded-full">
                    <MapPin className="w-5 h-5 text-crown-gold" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-lg">Bar Hours</h3>
                </div>
                <div className="space-y-2 text-gray-700">
                  <div className="flex justify-between">
                    <span>Monday - Thursday:</span>
                    <span className="font-medium">{menuData.hours.bar.monday_thursday}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Friday & Saturday:</span>
                    <span className="font-medium">{menuData.hours.bar.friday_saturday}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday:</span>
                    <span className="font-medium">{menuData.hours.bar.sunday}</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Call to Action */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg"
                icon={Phone}
                onClick={handlePhoneCall}
              >
                Call to Order: 01223 276027
              </Button>
              <Button 
                variant="outline"
                size="lg"
                icon={ShoppingCart}
              >
                {cart.size > 0 ? `View Cart (${cart.size})` : 'View Menu'}
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Enhanced Search and Filter Bar */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search for dishes, ingredients, or dietary preferences..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-12 py-3 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-crown-gold focus:border-transparent transition-all shadow-sm text-base"
                aria-label="Search menu items"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              {isSearching && (
                <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-crown-gold"></div>
                </div>
              )}
            </div>
            
            {/* Controls */}
            <div className="flex gap-2">
              <Button
                variant={showFilters ? "primary" : "secondary"}
                onClick={toggleFilters}
                icon={Filter}
                aria-expanded={showFilters}
              >
                <span className="hidden sm:inline">Filters</span>
              </Button>
              
              <Button
                variant="outline"
                icon={Phone}
                onClick={handlePhoneCall}
              >
                <span className="hidden sm:inline">Order Now</span>
              </Button>
            </div>
          </div>
        </div>
        
        <FilterPanel />
      </div>

      {/* Enhanced Mobile Category Navigation */}
      <div className="sticky top-20 z-40 bg-white/90 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          {/* Mobile Menu Toggle */}
          <div className="flex items-center justify-between py-3 sm:hidden">
            <h3 className="font-semibold text-gray-900">Menu Sections</h3>
            <Button
              variant="ghost"
              size="sm"
              icon={MenuIcon}
              onClick={toggleMobileMenu}
            >
              Categories
            </Button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden sm:flex gap-2 overflow-x-auto scrollbar-hide py-4" role="navigation" aria-label="Menu categories">
            {MENU_CATEGORIES.map((category) => {
              const IconComponent = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={activeSection === category.id ? "primary" : "ghost"}
                  size="sm"
                  icon={IconComponent}
                  onClick={() => scrollToSection(category.id)}
                  className="flex-shrink-0"
                >
                  {category.label}
                </Button>
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
                <div className="py-4 space-y-2">
                  {MENU_CATEGORIES.map((category) => {
                    const IconComponent = category.icon;
                    return (
                      <Button
                        key={category.id}
                        variant={activeSection === category.id ? "primary" : "ghost"}
                        size="sm"
                        icon={IconComponent}
                        onClick={() => scrollToSection(category.id)}
                        className="w-full justify-start"
                      >
                        <div className="text-left">
                          <div className="font-medium">{category.label}</div>
                          <div className="text-xs opacity-75">{category.description}</div>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Enhanced Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-16 sm:space-y-24"
        >
          
          {/* Starters Section */}
          <section 
            id="starters" 
            ref={(el) => { sectionRefs.current['starters'] = el; }}
            className="scroll-mt-48"
          >
            <SectionTitle 
              title="Starters"
              subtitle="Perfect appetizers to awaken your taste buds and begin your culinary journey"
              icon={<UtensilsCrossed className="w-8 h-8 text-crown-gold" />}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStarters.map((item, index) => (
                <MenuItem
                  key={`starter-${index}`}
                  name={item.name}
                  description={item.description}
                  price={item.price}
                  badges={[
                    ...(item.gluten_free ? ['GF'] : []),
                    ...(item.name.toLowerCase().includes('veg') || item.name.toLowerCase().includes('momo (veg)') ? ['V'] : [])
                  ]}
                  isPopular={['Onion Bhaji', 'Momo (Veg)', 'Momo (Chicken)', 'Chicken Tikka'].includes(item.name)}
                  isFavorite={favorites.has(item.name)}
                />
              ))}
            </div>
          </section>

          {/* Specialties Section */}
          <section 
            id="specialties" 
            ref={(el) => { sectionRefs.current['specialties'] = el; }}
            className="scroll-mt-48"
          >
            <SectionTitle 
              title="Old Crown Specialties"
              subtitle="Signature dishes that showcase our authentic Nepalese heritage and culinary expertise"
              icon={<Star className="w-8 h-8 text-crown-gold" />}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredSpecialties.map((item, index) => (
                <MenuItem
                  key={`specialty-${index}`}
                  name={item.name}
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
                  isFavorite={favorites.has(item.name)}
                />
              ))}
            </div>
          </section>

          {/* Mixed Grills Section */}
          <section 
            id="grills" 
            ref={(el) => { sectionRefs.current['grills'] = el; }}
            className="scroll-mt-48"
          >
            <SectionTitle 
              title="Mixed Grills"
              subtitle="Perfect sharing platters featuring our finest tandoor specialties"
              icon={<Fish className="w-8 h-8 text-crown-gold" />}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGrills.map((item, index) => (
                <MenuItem
                  key={`grill-${index}`}
                  name={item.name}
                  description={item.description}
                  price={item.price}
                  badges={item.name.toLowerCase().includes('veg') ? ['V'] : []}
                  isPopular={['Small Mixed Grill', 'Large Mixed Grill'].includes(item.name)}
                  isFavorite={favorites.has(item.name)}
                />
              ))}
            </div>
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <Info className="w-5 h-5 text-amber-600 inline mr-2" />
              <span className="text-amber-800 text-sm font-medium">
                All mixed grills can be customized - swap your chicken wings for crispy wings at no extra charge!
              </span>
            </div>
          </section>

          {/* Continue with other sections... */}
          
        </motion.div>

        {/* Enhanced Footer Information */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 sm:mt-24"
        >
          <Card className="p-8 sm:p-12 bg-gradient-to-r from-white via-crown-cream/20 to-white border-crown-gold/20">
            <div className="text-center space-y-8">
              {/* Legend */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Menu Guide</h3>
                <div className="flex flex-wrap justify-center items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-50 border border-green-200 rounded-full flex items-center justify-center">
                      <Leaf className="w-2.5 h-2.5 text-green-600" />
                    </div>
                    <span className="font-medium text-green-700">V = Vegetarian</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-50 border border-blue-200 rounded-full flex items-center justify-center">
                      <Wheat className="w-2.5 h-2.5 text-blue-600" />
                    </div>
                    <span className="font-medium text-blue-700">GF = Gluten Free</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-500 fill-current" />
                    <span className="font-medium text-amber-700">Popular Choice</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-red-500" />
                    <span className="font-medium text-red-700">Customer Favorite</span>
                  </div>
                </div>
              </div>
              
              {/* Important Notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                  <Info className="w-6 h-6 text-red-600 mx-auto mb-3" />
                  <h4 className="font-semibold text-red-800 mb-2">Allergen Information</h4>
                  <p className="text-sm text-red-700 leading-relaxed">
                    {menuData.notes.allergen_warning}
                  </p>
                </div>
                <div className="bg-crown-gold/10 border border-crown-gold/30 rounded-2xl p-6">
                  <ChefHat className="w-6 h-6 text-crown-gold-dark mx-auto mb-3" />
                  <h4 className="font-semibold text-crown-gold-dark mb-2">Custom Orders</h4>
                  <p className="text-sm text-crown-gold-dark leading-relaxed">
                    {menuData.notes.bespoke_orders}
                  </p>
                </div>
              </div>
              
              {/* Contact CTA */}
              <div className="pt-8 border-t border-gray-200">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Ready to Order?</h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Call us now to place your order or make a reservation. Our friendly staff are ready to help you 
                  create the perfect dining experience.
                </p>
                <Button
                  size="lg"
                  icon={Phone}
                  iconPosition="left"
                  onClick={handlePhoneCall}
                  className="text-xl px-8 py-4"
                >
                  Call Us: 01223 276027
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
});

CompleteRedesignedMenu.displayName = 'CompleteRedesignedMenu';

export default CompleteRedesignedMenu;
