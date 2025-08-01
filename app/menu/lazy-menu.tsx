import dynamic from 'next/dynamic';
import { memo } from 'react';

// Lazy load the heavy menu component
const LazyCompleteRedesignedMenu = dynamic(() => import('./menu-content-complete'), {
  loading: () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-crown-gold mx-auto mb-4"></div>
        <p className="text-gray-600">Loading menu...</p>
      </div>
    </div>
  ),
  ssr: false, // Disable SSR for this component to reduce initial bundle
});

// Memoized lazy component
const MemoizedLazyMenu = memo(LazyCompleteRedesignedMenu);
MemoizedLazyMenu.displayName = 'MemoizedLazyMenu';

export default MemoizedLazyMenu;
