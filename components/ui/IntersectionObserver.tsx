// Advanced Intersection Observer for optimal lazy loading
'use client';

import { useEffect, useRef, useState, ReactNode, memo } from 'react';

interface IntersectionObserverProps {
  children: ReactNode;
  fallback?: ReactNode;
  rootMargin?: string;
  threshold?: number | number[];
  className?: string;
  once?: boolean;
  onIntersect?: (isIntersecting: boolean) => void;
}

// Hook for intersection observer
const useIntersectionObserver = (
  options: {
    rootMargin?: string;
    threshold?: number | number[];
    once?: boolean;
  } = {}
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isCurrentlyIntersecting = entry.isIntersecting;
        setIsIntersecting(isCurrentlyIntersecting);
        
        if (isCurrentlyIntersecting && !hasIntersected) {
          setHasIntersected(true);
          if (options.once) {
            observer.disconnect();
          }
        }
      },
      {
        rootMargin: options.rootMargin || '50px',
        threshold: options.threshold || 0.1,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  // loadImage is stable in this scope; intentionally omit from deps to avoid repeated observers
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.rootMargin, options.threshold, options.once, hasIntersected]);

  return { ref, isIntersecting, hasIntersected };
};

// Lazy loader component with intersection observer
const LazyLoader = memo<IntersectionObserverProps>(({
  children,
  fallback = null,
  rootMargin = '50px',
  threshold = 0.1,
  className = '',
  once = true,
  onIntersect
}) => {
  const { ref, isIntersecting, hasIntersected } = useIntersectionObserver({
    rootMargin,
    threshold,
    once
  });

  useEffect(() => {
    if (onIntersect) {
      onIntersect(isIntersecting);
    }
  }, [isIntersecting, onIntersect]);

  const shouldRender = hasIntersected || isIntersecting;

  return (
    <div ref={ref} className={className}>
      {shouldRender ? children : fallback}
    </div>
  );
});

LazyLoader.displayName = 'LazyLoader';

// Progressive image loading component
interface ProgressiveImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholderSrc?: string;
  lowQualitySrc?: string;
  onLoad?: () => void;
  priority?: boolean;
}

const ProgressiveImage = memo<ProgressiveImageProps>(({
  src,
  alt,
  className = '',
  placeholderSrc,
  lowQualitySrc,
  onLoad,
  priority = false
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLowQualityLoaded, setIsLowQualityLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(placeholderSrc || lowQualitySrc || src);

  useEffect(() => {
    if (priority) {
      // Load immediately if priority
      loadImage();
    }
  }, [priority]);

  const loadImage = () => {
    // Load low quality first if available
    if (lowQualitySrc && !isLowQualityLoaded) {
      const lowQualityImg = new Image();
      lowQualityImg.onload = () => {
        setCurrentSrc(lowQualitySrc);
        setIsLowQualityLoaded(true);
        loadHighQuality();
      };
      lowQualityImg.src = lowQualitySrc;
    } else {
      loadHighQuality();
    }
  };

  const loadHighQuality = () => {
    const img = new Image();
    img.onload = () => {
      setCurrentSrc(src);
      setIsLoaded(true);
      onLoad?.();
    };
    img.src = src;
  };

  return (
    <LazyLoader
      once={true}
      rootMargin="100px"
      onIntersect={(isIntersecting) => {
        if (isIntersecting && !priority) {
          loadImage();
        }
      }}
      fallback={
        <div className={`bg-transparent ${className}`}>
        </div>
      }
    >
      <div className="relative overflow-hidden">
        <img
          src={currentSrc}
          alt={alt}
          className={`
            ${className}
            transition-all duration-500 ease-out
            ${isLoaded 
              ? 'opacity-100 scale-100' 
              : isLowQualityLoaded 
                ? 'opacity-75 scale-105 blur-sm' 
                : 'opacity-0 scale-110'
            }
          `}
          loading={priority ? 'eager' : 'lazy'}
        />
        
        {/* Loading overlay */}
        {!isLoaded && (
          <div className="absolute inset-0 bg-transparent">
          </div>
        )}
      </div>
    </LazyLoader>
  );
});

ProgressiveImage.displayName = 'ProgressiveImage';

// Animated section with intersection observer
interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  animation?: 'fade-up' | 'fade-in' | 'slide-left' | 'slide-right' | 'scale';
  delay?: number;
  threshold?: number;
}

const AnimatedSection = memo<AnimatedSectionProps>(({
  children,
  className = '',
  animation = 'fade-up',
  delay = 0,
  threshold = 0.1
}) => {
  const { ref, hasIntersected } = useIntersectionObserver({
    threshold,
    once: true
  });

  const animationClasses = {
    'fade-up': hasIntersected 
      ? 'opacity-100 translate-y-0' 
      : 'opacity-0 translate-y-8',
    'fade-in': hasIntersected 
      ? 'opacity-100' 
      : 'opacity-0',
    'slide-left': hasIntersected 
      ? 'opacity-100 translate-x-0' 
      : 'opacity-0 translate-x-8',
    'slide-right': hasIntersected 
      ? 'opacity-100 translate-x-0' 
      : 'opacity-0 -translate-x-8',
    'scale': hasIntersected 
      ? 'opacity-100 scale-100' 
      : 'opacity-0 scale-95'
  };

  return (
    <div
      ref={ref}
      className={`
        transition-all duration-700 ease-out
        ${animationClasses[animation]}
        ${className}
      `}
      style={{
        transitionDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  );
});

AnimatedSection.displayName = 'AnimatedSection';

// Staggered animation container
interface StaggeredAnimationProps {
  children: ReactNode[];
  staggerDelay?: number;
  className?: string;
  animation?: 'fade-up' | 'fade-in' | 'slide-left' | 'slide-right' | 'scale';
}

const StaggeredAnimation = memo<StaggeredAnimationProps>(({
  children,
  staggerDelay = 100,
  className = '',
  animation = 'fade-up'
}) => {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <AnimatedSection
          key={index}
          animation={animation}
          delay={index * staggerDelay}
          threshold={0.1}
        >
          {child}
        </AnimatedSection>
      ))}
    </div>
  );
});

StaggeredAnimation.displayName = 'StaggeredAnimation';

export {
  LazyLoader,
  ProgressiveImage,
  AnimatedSection,
  StaggeredAnimation,
  useIntersectionObserver
};
