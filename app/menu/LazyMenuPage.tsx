import { lazy, Suspense } from 'react';

// Lazy load menu components for better performance
const MenuContentComplete = lazy(() => import('./menu-content-complete'));
const MenuContentCompact = lazy(() => import('./menu-content-compact'));
const MenuContentRedesigned = lazy(() => import('./menu-content-redesigned'));

// Loading fallback component
const MenuLoadingFallback = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-crown-cream/30 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-crown-gold mx-auto mb-4"></div>
      <p className="text-crown-slate font-medium">Loading menu...</p>
    </div>
  </div>
);

// Menu view types
type MenuView = 'complete' | 'compact' | 'redesigned';

interface LazyMenuPageProps {
  view?: MenuView;
}

export default function LazyMenuPage({ view = 'complete' }: LazyMenuPageProps) {
  const renderMenuContent = () => {
    switch (view) {
      case 'compact':
        return (
          <Suspense fallback={<MenuLoadingFallback />}>
            <MenuContentCompact />
          </Suspense>
        );
      case 'redesigned':
        return (
          <Suspense fallback={<MenuLoadingFallback />}>
            <MenuContentRedesigned />
          </Suspense>
        );
      case 'complete':
      default:
        return (
          <Suspense fallback={<MenuLoadingFallback />}>
            <MenuContentComplete />
          </Suspense>
        );
    }
  };

  return (
    <div className="min-h-screen">
      {renderMenuContent()}
    </div>
  );
}
