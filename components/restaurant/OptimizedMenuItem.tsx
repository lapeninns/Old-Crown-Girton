import React, { memo, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Heart, Plus, Info, Leaf, Wheat, Milk, Sparkles, MapPin } from 'lucide-react';

// Performance-optimized Badge component
const Badge = memo<{ 
  label: string; 
  className?: string; 
  variant?: 'default' | 'dietary';
  children?: React.ReactNode;
}>(({ 
  label, 
  className = '', 
  variant = 'default',
  children
}) => {
  const baseClasses = 'badge-touch inline-flex items-center text-xs font-medium rounded-full transition-colors';
  const variantClasses = variant === 'dietary' 
    ? 'bg-cardamom-100 text-cardamom-800 border border-cardamom-200'
    : 'bg-neutral-100 text-brand-800';
  
  return (
    <span className={`${baseClasses} ${variantClasses} ${className}`}>
      {children || label}
    </span>
  );
});

Badge.displayName = 'Badge';

// Optimized dietary badge icons mapping
const DIETARY_ICONS = {
  'Vegetarian': Leaf,
  'Vegan': Leaf, 
  'Gluten Free': Wheat,
  'Dairy Free': Milk,
  'Organic': Sparkles,
  'Local': MapPin,
  'Sustainable': Leaf,
} as const;

// Performance-optimized MenuItem component
interface MenuItemProps {
  id: string;
  name: string;
  description?: string;
  price: string;
  image?: string;
  category: string;
  badges?: string[];
  allergens?: string[];
  isSpicy?: boolean;
  isNew?: boolean;
  isSignature?: boolean;
  isFavorite?: boolean;
  isVisible?: boolean;
  onToggleFavorite?: (id: string) => void;
  onAddToCart?: (id: string) => void;
  onViewDetails?: (id: string) => void;
}

const OptimizedMenuItem = memo<MenuItemProps>(({ 
  id,
  name, 
  description, 
  price, 
  image,
  category,
  badges = [],
  allergens = [],
  isSpicy = false,
  isNew = false,
  isSignature = false,
  isFavorite = false,
  isVisible = true,
  onToggleFavorite,
  onAddToCart,
  onViewDetails 
}) => {
  // Memoized event handlers to prevent unnecessary re-renders
  const handleToggleFavorite = useCallback(() => {
    onToggleFavorite?.(id);
  }, [id, onToggleFavorite]);

  const handleAddToCart = useCallback(() => {
    onAddToCart?.(id);
  }, [id, onAddToCart]);

  const handleViewDetails = useCallback(() => {
    onViewDetails?.(id);
  }, [id, onViewDetails]);

  // Memoized dietary badges with icons
  const dietaryBadges = useMemo(() => {
    return badges.map((badge) => {
      const IconComponent = DIETARY_ICONS[badge as keyof typeof DIETARY_ICONS];
      return (
        <Badge
          key={badge}
          label=""
          variant="dietary"
          className="flex items-center gap-1"
        >
          {IconComponent && <IconComponent className="w-3 h-3" />}
          {badge}
        </Badge>
      );
    });
  }, [badges]);

  // Memoized price formatting
  const formattedPrice = useMemo(() => {
    return price.startsWith('£') ? price : `£${price}`;
  }, [price]);

  // Early return for hidden items (performance optimization)
  if (!isVisible) return null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-neutral-50 rounded-xl border border-neutral-200 hover:border-accent-500/30 hover:shadow-lg transition-all duration-300 overflow-hidden group"
    >
      {/* Image Section */}
      {image && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            decoding="async"
          />
          
          {/* Overlay badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                {isNew && (
                  <Badge label="NEW" className="bg-accent text-white font-bold" />
                )}
            {isSignature && (
              <Badge label="SIGNATURE" className="bg-crimson-600 text-white font-bold" />
            )}
            {isSpicy && (
              <Badge label="🌶️ SPICY" className="bg-crimson-100 text-crimson-800" />
            )}
          </div>

          {/* Favorite button */}
          <button
            onClick={handleToggleFavorite}
            className="touch-target absolute top-3 right-3 bg-white/90 hover:bg-white rounded-full p-2 transition-colors"
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart 
              className={`w-5 h-5 transition-colors ${
                isFavorite ? 'fill-crimson-500 text-crimson-500' : 'text-brand-600 hover:text-crimson-500'
              }`} 
            />
          </button>
        </div>
      )}

      {/* Content Section */}
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-3 gap-4">
          <h3 className="text-xl font-display font-bold text-stout-700 group-hover:text-foreground-strong transition-colors flex-1 min-w-0">
            <span className="break-words hyphens-auto" lang="en">
              {name}
            </span>
          </h3>
          <span className="text-xl font-bold text-foreground-strong flex-shrink-0">
            {formattedPrice}
          </span>
        </div>

        {/* Description */}
        {description && (
          <p className="text-brand-600 text-sm mb-4 line-clamp-2">
            {description}
          </p>
        )}

        {/* Dietary badges */}
        {dietaryBadges.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {dietaryBadges}
          </div>
        )}

        {/* Allergen information */}
        {allergens.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-neutral-500">
              <strong>Allergens:</strong> {allergens.join(', ')}
            </p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2 pt-4 border-t border-neutral-200">
          <button
            onClick={handleViewDetails}
            className="touch-target flex-1 bg-neutral-100 hover:bg-neutral-200 text-brand-800 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Info className="w-4 h-4" />
            Details
          </button>
          
          <button
            onClick={handleAddToCart}
            className="touch-target flex-1 bg-accent hover:bg-accent-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add to Order
          </button>
        </div>
      </div>
    </motion.div>
  );
});

OptimizedMenuItem.displayName = 'OptimizedMenuItem';

export default OptimizedMenuItem;
