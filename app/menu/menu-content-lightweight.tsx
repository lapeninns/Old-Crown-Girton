// Lightweight menu component without heavy animations for faster initial load
'use client';

import React, { useState, useCallback, useMemo, memo } from 'react';
import { 
  Search, 
  UtensilsCrossed, 
  Star,
  Heart,
  SlidersHorizontal as Filter,
  X,
  Phone,
  Plus,
  ShoppingCart,
  Menu as MenuIcon
} from 'lucide-react';
import menuData from '../../menu-new.json';
import { useDebounceSearch } from '../../hooks/usePerformance';

// Lightweight Card component without animations
const LightCard = memo<{ children: React.ReactNode; className?: string }>(({ children, className = '' }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-shadow hover:shadow-md ${className}`}>
    {children}
  </div>
));
LightCard.displayName = 'LightCard';

// Lightweight Button component
const LightButton = memo<{ 
  children: React.ReactNode; 
  onClick?: () => void; 
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ComponentType<any>;
  className?: string;
}>(({ children, onClick, variant = 'primary', size = 'md', icon: Icon, className = '' }) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variants = {
    primary: 'bg-crown-gold text-white hover:bg-crown-gold-dark focus:ring-crown-gold',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
    outline: 'border border-crown-gold text-crown-gold hover:bg-crown-gold hover:text-white focus:ring-crown-gold'
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-base gap-2',
    lg: 'px-6 py-3 text-lg gap-2'
  };
  
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
});
LightButton.displayName = 'LightButton';

// Lightweight MenuItem component
const LightMenuItem = memo<{
  name: string;
  description: string;
  price: string;
  badges?: string[];
  isPopular?: boolean;
  isFavorite?: boolean;
}>(({ name, description, price, badges = [], isPopular = false, isFavorite = false }) => (
  <LightCard className="p-4 hover:shadow-lg transition-shadow">
    <div className="space-y-3">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900">{name}</h3>
            {isPopular && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
        </div>
        <div className="text-right ml-4">
          <p className="text-lg font-bold text-crown-gold">{price}</p>
        </div>
      </div>
      
      {badges.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {badges.map((badge, idx) => (
            <span key={idx} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              {badge}
            </span>
          ))}
        </div>
      )}
      
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <LightButton variant="ghost" size="sm">
          <Heart className={`w-4 h-4 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
        </LightButton>
        <LightButton size="sm" icon={Plus}>
          Add to Cart
        </LightButton>
      </div>
    </div>
  </LightCard>
));
LightMenuItem.displayName = 'LightMenuItem';

// Main lightweight menu component
const LightweightMenu = memo(() => {
  const { searchTerm, debouncedTerm, setSearchTerm, clearSearch } = useDebounceSearch('', 300);
  const [showFilters, setShowFilters] = useState(false);
  const [favorites] = useState(new Set<string>());

  // Memoized filtered items
  const filteredStarters = useMemo(() => {
    return menuData.menu.starters.filter(item => {
      return debouncedTerm === '' || 
        item.name.toLowerCase().includes(debouncedTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(debouncedTerm.toLowerCase());
    });
  }, [debouncedTerm]);

  const toggleFilters = useCallback(() => {
    setShowFilters(!showFilters);
  }, [showFilters]);

  const handlePhoneCall = useCallback(() => {
    window.location.href = 'tel:01223276027';
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <UtensilsCrossed className="w-8 h-8 text-crown-gold" />
              <h1 className="text-xl font-bold text-gray-900">Old Crown Menu</h1>
            </div>
            <LightButton variant="outline" icon={Phone} onClick={handlePhoneCall}>
              Call Us
            </LightButton>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search menu items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crown-gold focus:border-transparent"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            <LightButton
              variant={showFilters ? "primary" : "secondary"}
              onClick={toggleFilters}
              icon={Filter}
            >
              Filters
            </LightButton>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Starters Section */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Starters</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Perfect appetizers to awaken your taste buds and begin your culinary journey
            </p>
            <div className="w-24 h-1 bg-crown-gold mx-auto mt-4 rounded-full" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStarters.map((item, index) => (
              <LightMenuItem
                key={`starter-${index}`}
                name={item.name}
                description={item.description}
                price={item.price}
                badges={[
                  ...(item.gluten_free ? ['GF'] : []),
                  ...(item.name.toLowerCase().includes('veg') ? ['V'] : [])
                ]}
                isPopular={['Onion Bhaji', 'Momo (Veg)', 'Momo (Chicken)'].includes(item.name)}
                isFavorite={favorites.has(item.name)}
              />
            ))}
          </div>
        </section>

        {/* Load Full Menu Button */}
        <div className="text-center py-8">
          <LightButton 
            size="lg"
            onClick={() => window.location.reload()} // This would load the full menu
          >
            Load Full Menu with Animations
          </LightButton>
        </div>
      </div>
    </div>
  );
});

LightweightMenu.displayName = 'LightweightMenu';

export default LightweightMenu;
