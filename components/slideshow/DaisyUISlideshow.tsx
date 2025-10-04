"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import type { Slide as SlideType } from './types';
import { slides as defaultSlides } from './slides';
import SlideCTAButton from './SlideCTAButton';

interface DaisyUISlideshowProps {
  slides?: SlideType[];
  autoplay?: boolean;
  interval?: number;
}

type ScrollBehaviorOption = 'auto' | 'instant' | 'smooth';

const REQUIRED_SLIDE_IDS = new Set(['slide-ev-charging', 'slide-11']);
const SESSION_SLIDE_COUNT = 5;

type SlideBuckets = {
  required: SlideType[];
  optional: SlideType[];
};

const resolveImageSrc = (image: SlideType['image']) => {
  if (!image) return null;

  if (typeof image === 'string') {
    return image;
  }

  if (typeof image === 'object') {
    if ('primary' in image && image.primary) {
      return image.primary;
    }
    if ('src' in image && image.src) {
      return image.src;
    }
    if ('fallback' in image && image.fallback) {
      return image.fallback;
    }
  }

  return null;
};

const collectSlides = (allSlides: SlideType[]): SlideBuckets => {
  if (!Array.isArray(allSlides) || allSlides.length === 0) {
    return { required: [], optional: [] };
  }

  const seen = new Set<string>();
  const buckets: SlideBuckets = { required: [], optional: [] };

  allSlides.forEach((slide) => {
    if (!slide?.id || seen.has(slide.id)) return;
    seen.add(slide.id);
    if (REQUIRED_SLIDE_IDS.has(slide.id)) {
      buckets.required.push(slide);
    } else {
      buckets.optional.push(slide);
    }
  });

  return buckets;
};

const shuffleSlides = (slides: SlideType[]) => {
  const copy = [...slides];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const selectSessionSlides = (allSlides: SlideType[], targetCount = SESSION_SLIDE_COUNT) => {
  const { required, optional } = collectSlides(allSlides);
  if (!required.length && !optional.length) {
    return [];
  }

  const needed = Math.max(0, targetCount - required.length);
  const shuffledOptional = shuffleSlides(optional);
  const chosenOptional = shuffledOptional.slice(0, needed);
  const combined = [...required, ...chosenOptional];

  if (combined.length < targetCount) {
    for (const slide of shuffledOptional) {
      if (combined.length >= targetCount) break;
      if (!combined.includes(slide)) {
        combined.push(slide);
      }
    }
  }

  return shuffleSlides(combined).slice(0, targetCount);
};

const getDefaultSessionSlides = (allSlides: SlideType[], targetCount = SESSION_SLIDE_COUNT) => {
  const { required, optional } = collectSlides(allSlides);
  if (!required.length && !optional.length) {
    return [];
  }

  const combined = [...required];
  for (const slide of optional) {
    if (combined.length >= targetCount) break;
    combined.push(slide);
  }

  return combined.slice(0, targetCount);
};

const deriveSessionSlides = (allSlides: SlideType[], targetCount = SESSION_SLIDE_COUNT) => {
  const selected = selectSessionSlides(allSlides, targetCount);
  if (selected.length) {
    return selected;
  }
  return getDefaultSessionSlides(allSlides, targetCount);
};

const getInitialSessionSlides = (allSlides: SlideType[], targetCount = SESSION_SLIDE_COUNT) => {
  return getDefaultSessionSlides(allSlides, targetCount);
};

const CTA_BASE_CLASS = 'text-white font-bold rounded-xl shadow-xl shadow-black/25 ring-1 ring-white/10 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60';

const getCTAConfig = (slide: SlideType, slideIndex: number) => {
  const type = slideIndex % 3;

  switch (type) {
    case 0: // Book Online + Call for Takeaway
      return {
        primaryButton: {
          variant: 'book' as const,
          href: slide.ctas?.bookUrl,
          className: `${CTA_BASE_CLASS} bg-accent hover:bg-accent/90`
        },
        secondaryButton: {
          variant: 'call-takeaway' as const,
          href: slide.ctas?.callTel,
          className: `${CTA_BASE_CLASS} bg-crimson-600 hover:bg-crimson-700`
        }
      };
    case 1: // Call for Takeaway + Call for Booking
      return {
        primaryButton: {
          variant: 'call-takeaway' as const,
          href: slide.ctas?.callTel,
          className: `${CTA_BASE_CLASS} bg-crimson-600 hover:bg-crimson-700`
        },
        secondaryButton: {
          variant: 'call-booking' as const,
          href: slide.ctas?.callTel,
          className: `${CTA_BASE_CLASS} bg-accent hover:bg-accent/90`
        }
      };
    case 2: // Call for Booking + Book Online
      return {
        primaryButton: {
          variant: 'call-booking' as const,
          href: slide.ctas?.callTel,
          className: `${CTA_BASE_CLASS} bg-crimson-600 hover:bg-crimson-700`
        },
        secondaryButton: {
          variant: 'book' as const,
          href: slide.ctas?.bookUrl,
          className: `${CTA_BASE_CLASS} bg-accent hover:bg-accent/90`
        }
      };
    default:
      return {
        primaryButton: {
          variant: 'book' as const,
          href: slide.ctas?.bookUrl,
          className: `${CTA_BASE_CLASS} bg-accent hover:bg-accent/90`
        },
        secondaryButton: {
          variant: 'call-takeaway' as const,
          href: slide.ctas?.callTel,
          className: `${CTA_BASE_CLASS} bg-crimson-600 hover:bg-crimson-700`
        }
      };
  }
};

const DaisyUISlideshow = ({
  slides = defaultSlides,
  autoplay = true,
  interval = 5000
}: DaisyUISlideshowProps) => {
  const [sessionSlides, setSessionSlides] = useState<SlideType[]>(() => getInitialSessionSlides(slides, SESSION_SLIDE_COUNT));
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const autoplayTimerRef = useRef<number | null>(null);

  const totalSlides = sessionSlides.length;

  const scrollToSlide = useCallback((index: number, behavior: ScrollBehaviorOption = 'smooth') => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const slideWidth = carousel.clientWidth;
    carousel.scrollTo({ left: slideWidth * index, behavior });
  }, []);

  const stopAutoplay = useCallback(() => {
    if (autoplayTimerRef.current) {
      window.clearInterval(autoplayTimerRef.current);
      autoplayTimerRef.current = null;
    }
  }, []);

  const goToSlide = useCallback(
    (index: number, behavior: ScrollBehaviorOption = 'smooth') => {
      if (!totalSlides) return;
      const normalized = ((index % totalSlides) + totalSlides) % totalSlides;
      setCurrentIndex((prev) => {
        if (prev === normalized) {
          scrollToSlide(normalized, behavior);
          return prev;
        }
        scrollToSlide(normalized, behavior);
        return normalized;
      });
    },
    [scrollToSlide, totalSlides]
  );

  const advanceSlide = useCallback(
    (direction: 1 | -1) => {
      if (!totalSlides) return;
      setCurrentIndex((prev) => {
        const next = (prev + direction + totalSlides) % totalSlides;
        scrollToSlide(next);
        return next;
      });
    },
    [scrollToSlide, totalSlides]
  );

  const startAutoplay = useCallback(() => {
    stopAutoplay();
    if (!autoplay || totalSlides <= 1) {
      return;
    }

    autoplayTimerRef.current = window.setInterval(() => {
      advanceSlide(1);
    }, interval);
  }, [advanceSlide, autoplay, interval, stopAutoplay, totalSlides]);

  useEffect(() => {
    startAutoplay();
    return () => {
      stopAutoplay();
    };
  }, [startAutoplay, stopAutoplay]);

  useEffect(() => {
    if (!Array.isArray(slides)) {
      return;
    }
    if (typeof window === 'undefined') {
      return;
    }

    const nextSlides = deriveSessionSlides(slides, SESSION_SLIDE_COUNT);
    setSessionSlides((current) => {
      if (
        current.length === nextSlides.length &&
        current.every((slide, index) => slide?.id === nextSlides[index]?.id)
      ) {
        return current;
      }
      return nextSlides;
    });
    setCurrentIndex(0);
    requestAnimationFrame(() => {
      scrollToSlide(0, 'auto');
    });
  }, [slides, scrollToSlide]);

  useEffect(() => {
    // Ensure we are positioned correctly if slide count changes.
    requestAnimationFrame(() => {
      scrollToSlide(currentIndex, 'auto');
    });
  }, [currentIndex, scrollToSlide, totalSlides]);

  const handleMouseEnter = useCallback(() => {
    stopAutoplay();
  }, [stopAutoplay]);

  const handleMouseLeave = useCallback(() => {
    startAutoplay();
  }, [startAutoplay]);

  const headlineForIndex = useMemo(() => {
    if (!totalSlides) return '';
    return sessionSlides[currentIndex]?.headline ?? sessionSlides[currentIndex]?.alt ?? '';
  }, [currentIndex, sessionSlides, totalSlides]);

  if (!totalSlides) {
    return null;
  }

  return (
    <div
      className="relative w-full h-[60svh] md:h-[65svh] lg:h-[70svh] overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="region"
      aria-label="Featured experiences slideshow"
    >
      <div
        ref={carouselRef}
        className="carousel w-full h-full snap-x snap-mandatory overflow-x-auto scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {sessionSlides.map((slide, index) => {
          const imageSrc = resolveImageSrc(slide.image);
          const { primaryButton, secondaryButton } = getCTAConfig(slide, index);
          return (
            <div
              key={slide.id ?? index}
              className="carousel-item relative w-full h-full snap-start"
            >
              {imageSrc && (
                <div className="absolute inset-0 w-full h-full">
                  <Image
                    src={imageSrc}
                    alt={slide.alt || `Slide ${index + 1}`}
                    fill
                    priority={index === 0}
                    sizes="100vw"
                    className="object-cover"
                    quality={90}
                  />
                  <div className="absolute inset-0 bg-black/30" />
                </div>
              )}
              <div className="relative z-10 flex items-center justify-center w-full h-full px-6 sm:px-8">
                <div className="max-w-4xl mx-auto text-center text-white">
                  {slide.eyebrow && (
                    <p className="text-xs sm:text-sm md:text-base font-semibold uppercase tracking-[0.3em] text-accent-300 mb-3">
                      {slide.eyebrow}
                    </p>
                  )}
                  {slide.headline && (
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight mb-4">
                      {slide.headline}
                    </h2>
                  )}
                  {slide.copy && (
                    <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
                      {slide.copy}
                    </p>
                  )}
                  {Array.isArray(slide.badges) && slide.badges.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-2 mb-6 sm:mb-8">
                      {slide.badges.map((badge) => (
                        <span
                          key={badge}
                          className="px-3 py-1 text-xs sm:text-sm bg-white/20 backdrop-blur-sm rounded-full border border-white/30"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  )}
                  {slide.ctas && (
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 xl:gap-4 justify-center items-center max-w-full overflow-hidden px-2 sm:px-0">
                      {primaryButton.href && (
                        <SlideCTAButton
                          variant={primaryButton.variant}
                          href={primaryButton.href}
                          className={`${primaryButton.className} text-sm xs:text-base sm:text-lg md:text-xl py-2.5 px-4 sm:py-3 sm:px-6 md:py-4 md:px-8 w-full sm:w-auto max-w-full sm:max-w-xs truncate text-center`}
                        />
                      )}
                      {secondaryButton.href && (
                        <SlideCTAButton
                          variant={secondaryButton.variant}
                          href={secondaryButton.href}
                          className={`${secondaryButton.className} text-sm xs:text-base sm:text-lg md:text-xl py-2.5 px-4 sm:py-3 sm:px-6 md:py-4 md:px-8 w-full sm:w-auto max-w-full sm:max-w-xs truncate text-center`}
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {totalSlides > 1 && (
        <>
          <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 flex justify-between z-20">
            <button
              type="button"
              onClick={() => {
                stopAutoplay();
                advanceSlide(-1);
                startAutoplay();
              }}
              className="btn btn-circle btn-ghost bg-black/35 hover:bg-black/55 text-white border-none"
              aria-label="Previous slide"
            >
              ❮
            </button>
            <button
              type="button"
              onClick={() => {
                stopAutoplay();
                advanceSlide(1);
                startAutoplay();
              }}
              className="btn btn-circle btn-ghost bg-black/35 hover:bg-black/55 text-white border-none"
              aria-label="Next slide"
            >
              ❯
            </button>
          </div>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {sessionSlides.map((slide, index) => (
              <button
                key={slide.id ?? index}
                type="button"
                onClick={() => {
                  stopAutoplay();
                  goToSlide(index);
                  startAutoplay();
                }}
                className={`h-3 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                  index === currentIndex ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/80 w-3'
                }`}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index === currentIndex ? 'true' : 'false'}
              />
            ))}
          </div>
        </>
      )}

      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        Slide {currentIndex + 1} of {totalSlides}: {headlineForIndex}
      </div>
    </div>
  );
};

export default DaisyUISlideshow;
