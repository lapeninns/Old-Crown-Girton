import { useEffect, useRef, useState } from 'react';

/**
 * Performance-optimized hook for mount animations
 * 
 * Defers animation trigger using requestAnimationFrame to prevent
 * scroll jank during initial page load. Use this for any mount
 * animations that might interfere with scroll performance.
 * 
 * @param deps - Optional dependency array to re-trigger animation
 * @returns isMounted - Boolean indicating if component should show mounted state
 * 
 * @example
 * ```tsx
 * const isMounted = usePerformantMountAnimation();
 * return <div data-mounted={isMounted} className="animate-on-mount">Content</div>;
 * ```
 */
export function usePerformantMountAnimation(deps: React.DependencyList = []): boolean {
  const isMountedRef = useRef(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Reset mounted state if dependencies change
    if (deps.length > 0) {
      isMountedRef.current = false;
      setIsMounted(false);
    }

    // Use requestAnimationFrame to defer until after initial render
    // This prevents animation conflicts with initial scroll performance
    const animationFrameId = requestAnimationFrame(() => {
      isMountedRef.current = true;
      setIsMounted(true);
    });

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, deps);

  return isMounted;
}

/**
 * Alternative hook that returns a ref instead of state
 * Use this for lighter weight scenarios where you don't need re-renders
 */
export function usePerformantMountRef(deps: React.DependencyList = []): React.RefObject<boolean> {
  const isMountedRef = useRef(false);

  useEffect(() => {
    // Reset if dependencies change
    if (deps.length > 0) {
      isMountedRef.current = false;
    }

    // Use requestAnimationFrame to defer until after initial render
    const animationFrameId = requestAnimationFrame(() => {
      isMountedRef.current = true;
    });

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, deps);

  return isMountedRef;
}

export default usePerformantMountAnimation;