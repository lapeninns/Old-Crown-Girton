// Advanced skeleton loading system with shimmer effects
'use client';

import { memo, ReactNode } from 'react';

// Simple className utility
const cn = (...classes: (string | undefined | false)[]) => {
  return classes.filter(Boolean).join(' ');
};

// Base shimmer skeleton component
interface SkeletonProps {
  className?: string;
  variant?: 'default' | 'text' | 'circular' | 'rectangular';
  animation?: 'pulse' | 'wave' | 'none';
  children?: ReactNode;
}

const Skeleton = memo<SkeletonProps>(({ 
  className, 
  variant = 'default',
  animation = 'wave',
  children,
  ...props 
}) => {
  const baseClasses = 'bg-gray-200 dark:bg-gray-700';
  
  const variantClasses = {
    default: 'rounded',
    text: 'rounded-sm h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-none'
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%]',
    none: ''
  };

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Skeleton.displayName = 'Skeleton';

// Menu item skeleton with advanced shimmer
const MenuItemSkeleton = memo(() => (
  <div className="bg-white rounded-lg border border-gray-100 p-6 space-y-4 relative overflow-hidden">
    <div className="flex justify-between items-start">
      <div className="space-y-2 flex-1">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton variant="text" className="w-full" />
        <Skeleton variant="text" className="w-4/5" />
      </div>
      <Skeleton variant="circular" className="w-12 h-12 ml-4" />
    </div>
    
    <div className="flex justify-between items-center pt-2">
      <div className="space-y-1">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-3 w-20" />
      </div>
      <Skeleton className="h-10 w-24 rounded-full" />
    </div>
  </div>
));

MenuItemSkeleton.displayName = 'MenuItemSkeleton';

// Advanced menu loading skeleton with realistic layout
const AdvancedMenuSkeleton = memo(() => (
  <div className="min-h-screen bg-gray-50/50">
    {/* Header skeleton */}
    <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <div className="flex space-x-4">
            <Skeleton className="h-10 w-32 rounded-full" />
            <Skeleton variant="circular" className="w-10 h-10" />
          </div>
        </div>
        
        {/* Search and filters skeleton */}
        <div className="mt-6 flex flex-col md:flex-row gap-4">
          <Skeleton className="h-12 flex-1 rounded-full" />
          <div className="flex gap-2">
            <Skeleton className="h-12 w-24 rounded-full" />
            <Skeleton className="h-12 w-28 rounded-full" />
            <Skeleton className="h-12 w-20 rounded-full" />
          </div>
        </div>
      </div>
    </div>

    {/* Menu content skeleton */}
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Categories skeleton */}
      <div className="mb-8">
        <Skeleton className="h-7 w-40 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(9)].map((_, i) => (
            <MenuItemSkeleton key={i} />
          ))}
        </div>
      </div>

      {/* Second category skeleton */}
      <div className="mb-8">
        <Skeleton className="h-7 w-32 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <MenuItemSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  </div>
));

AdvancedMenuSkeleton.displayName = 'AdvancedMenuSkeleton';

// Hero section skeleton with gradient shimmer
const HeroSkeleton = memo(() => (
  <div className="relative h-screen bg-gradient-to-r from-gray-100 to-gray-200 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer bg-[length:200%_100%]" />
    
    <div className="relative h-full flex items-center justify-center">
      <div className="text-center space-y-6 px-4">
        <Skeleton className="h-16 w-96 mx-auto" />
        <Skeleton className="h-6 w-80 mx-auto" />
        <Skeleton className="h-6 w-72 mx-auto" />
        
        <div className="flex justify-center gap-4 pt-4">
          <Skeleton className="h-14 w-40 rounded-full" />
          <Skeleton className="h-14 w-36 rounded-full" />
        </div>
      </div>
    </div>
    
    {/* Decorative elements skeleton */}
    <div className="absolute top-1/4 left-1/4">
      <Skeleton variant="circular" className="w-16 h-16 opacity-30" />
    </div>
    <div className="absolute bottom-1/3 right-1/4">
      <Skeleton variant="circular" className="w-12 h-12 opacity-20" />
    </div>
  </div>
));

HeroSkeleton.displayName = 'HeroSkeleton';

// Card skeleton for testimonials and highlights
const CardSkeleton = memo(() => (
  <div className="bg-white rounded-xl p-6 space-y-4 shadow-sm border border-gray-100 relative overflow-hidden">
    <div className="flex items-start space-x-4">
      <Skeleton variant="circular" className="w-12 h-12 flex-shrink-0" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton variant="text" className="w-1/2" />
      </div>
    </div>
    
    <div className="space-y-2">
      <Skeleton variant="text" className="w-full" />
      <Skeleton variant="text" className="w-5/6" />
      <Skeleton variant="text" className="w-4/5" />
    </div>
    
    <div className="flex justify-between items-center pt-2">
      <div className="flex space-x-1">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} variant="circular" className="w-4 h-4" />
        ))}
      </div>
      <Skeleton className="h-3 w-16" />
    </div>
  </div>
));

CardSkeleton.displayName = 'CardSkeleton';

// Grid skeleton for testimonials/highlights sections
const GridSkeleton = memo(({ title = "Section", count = 4 }: { title?: string; count?: number }) => (
  <div className="py-16 bg-gray-50/30">
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-12">
        <Skeleton className="h-10 w-64 mx-auto mb-4" />
        <Skeleton className="h-5 w-96 mx-auto" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(count)].map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  </div>
));

GridSkeleton.displayName = 'GridSkeleton';

// Loading state component with progressive enhancement
interface LoadingStateProps {
  type: 'menu' | 'hero' | 'testimonials' | 'highlights' | 'card';
  count?: number;
  className?: string;
}

const LoadingState = memo<LoadingStateProps>(({ type, count = 4, className }) => {
  const components = {
    menu: AdvancedMenuSkeleton,
    hero: HeroSkeleton,
    testimonials: () => <GridSkeleton title="Testimonials" count={count} />,
    highlights: () => <GridSkeleton title="Menu Highlights" count={count} />,
    card: CardSkeleton
  };

  const Component = components[type];
  
  return (
    <div className={cn("animate-in fade-in-0 duration-500", className)}>
      <Component />
    </div>
  );
});

LoadingState.displayName = 'LoadingState';

export {
  Skeleton,
  MenuItemSkeleton,
  AdvancedMenuSkeleton,
  HeroSkeleton,
  CardSkeleton,
  GridSkeleton,
  LoadingState
};
