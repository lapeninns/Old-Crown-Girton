"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
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

const REQUIRED_SLIDE_IDS = new Set(['slide-christmas-2025', 'slide-curry-carols-2025']);
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

const CTA_BASE_CLASS =
  'inline-flex items-center justify-center gap-2 text-white font-semibold rounded-xl shadow-xl shadow-black/25 ring-1 ring-white/10 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black/40 min-h-[2.75rem] sm:min-h-[3rem] whitespace-normal';

const getCTAConfig = (slide: SlideType, slideIndex: number) => {
  const ctas = slide.ctas ?? {};
  const hasMenu = Boolean(ctas.menuUrl);
  const hasCall = Boolean(ctas.callTel);
  const hasBook = Boolean(ctas.bookUrl);

  if (hasMenu && hasCall) {
    return {
      primaryButton: {
        variant: 'menu' as const,
        href: ctas.menuUrl,
        className: `${CTA_BASE_CLASS} bg-accent hover:bg-accent/90`
      },
      secondaryButton: {
        variant: 'call-booking' as const,
        href: ctas.callTel,
        className: `${CTA_BASE_CLASS} bg-crimson-600 hover:bg-crimson-700`
      }
    };
  }

  const type = slideIndex % 3;

  switch (type) {
    case 0: // Book Online + Call for Takeaway
      return {
        primaryButton: {
          variant: 'book' as const,
          href: hasBook ? ctas.bookUrl : undefined,
          className: `${CTA_BASE_CLASS} bg-accent hover:bg-accent/90`
        },
        secondaryButton: {
          variant: 'call-takeaway' as const,
          href: hasCall ? ctas.callTel : undefined,
          className: `${CTA_BASE_CLASS} bg-crimson-600 hover:bg-crimson-700`
        }
      };
    case 1: // Call for Takeaway + Call for Booking
      return {
        primaryButton: {
          variant: 'call-takeaway' as const,
          href: hasCall ? ctas.callTel : undefined,
          className: `${CTA_BASE_CLASS} bg-crimson-600 hover:bg-crimson-700`
        },
        secondaryButton: {
          variant: 'call-booking' as const,
          href: hasCall ? ctas.callTel : undefined,
          className: `${CTA_BASE_CLASS} bg-accent hover:bg-accent/90`
        }
      };
    case 2: // Call for Booking + Book Online
      return {
        primaryButton: {
          variant: 'call-booking' as const,
          href: hasCall ? ctas.callTel : undefined,
          className: `${CTA_BASE_CLASS} bg-crimson-600 hover:bg-crimson-700`
        },
        secondaryButton: {
          variant: 'book' as const,
          href: hasBook ? ctas.bookUrl : undefined,
          className: `${CTA_BASE_CLASS} bg-accent hover:bg-accent/90`
        }
      };
    default:
      return {
        primaryButton: {
          variant: 'book' as const,
          href: hasBook ? ctas.bookUrl : undefined,
          className: `${CTA_BASE_CLASS} bg-accent hover:bg-accent/90`
        },
        secondaryButton: {
          variant: 'call-takeaway' as const,
          href: hasCall ? ctas.callTel : undefined,
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
  const pointerActiveRef = useRef(false);
  const activePointerIdRef = useRef<number | null>(null);
  const resumeAutoplayTimeoutRef = useRef<number | null>(null);
  const autoplayDirectionRef = useRef<1 | -1>(1);

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
    (index: number, behavior: ScrollBehaviorOption = 'smooth', directionHint?: 1 | -1 | null) => {
      if (!totalSlides) return;
      const normalized = ((index % totalSlides) + totalSlides) % totalSlides;
      setCurrentIndex((prev) => {
        if (prev === normalized) {
          scrollToSlide(normalized, behavior);
          return prev;
        }
        if (typeof directionHint === 'number') {
          autoplayDirectionRef.current = directionHint;
        } else if (normalized > prev) {
          autoplayDirectionRef.current = 1;
        } else if (normalized < prev) {
          autoplayDirectionRef.current = -1;
        }
        scrollToSlide(normalized, behavior);
        return normalized;
      });
    },
    [scrollToSlide, totalSlides]
  );

  const advanceSlide = useCallback(
    (direction?: 1 | -1) => {
      if (!totalSlides) return;
      setCurrentIndex((prev) => {
        const currentDirection = direction ?? autoplayDirectionRef.current;
        let nextDirection = currentDirection;
        let nextIndex = prev + currentDirection;

        if (nextIndex >= totalSlides) {
          nextDirection = -1;
          nextIndex = totalSlides > 1 ? totalSlides - 2 : 0;
        } else if (nextIndex < 0) {
          nextDirection = 1;
          nextIndex = totalSlides > 1 ? 1 : 0;
        }

        autoplayDirectionRef.current = nextDirection;
        scrollToSlide(nextIndex);
        return nextIndex;
      });
    },
    [scrollToSlide, totalSlides]
  );

  const clearResumeAutoplayTimeout = useCallback(() => {
    if (resumeAutoplayTimeoutRef.current) {
      window.clearTimeout(resumeAutoplayTimeoutRef.current);
      resumeAutoplayTimeoutRef.current = null;
    }
  }, []);

  const startAutoplay = useCallback(() => {
    stopAutoplay();
    if (!autoplay || totalSlides <= 1) {
      return;
    }
    if (pointerActiveRef.current) {
      return;
    }

    autoplayTimerRef.current = window.setInterval(() => {
      advanceSlide();
    }, interval);
  }, [advanceSlide, autoplay, interval, stopAutoplay, totalSlides]);

  const scheduleAutoplayResume = useCallback(() => {
    clearResumeAutoplayTimeout();
    if (!autoplay || totalSlides <= 1) {
      return;
    }

    resumeAutoplayTimeoutRef.current = window.setTimeout(() => {
      resumeAutoplayTimeoutRef.current = null;
      if (pointerActiveRef.current) {
        return;
      }
      startAutoplay();
    }, 500);
  }, [autoplay, clearResumeAutoplayTimeout, startAutoplay, totalSlides]);

  const syncCurrentIndexFromScroll = useCallback(() => {
    if (!totalSlides) {
      return;
    }
    const carousel = carouselRef.current;
    if (!carousel) {
      return;
    }

    const { clientWidth, scrollLeft } = carousel;
    if (!clientWidth) {
      return;
    }

    const rawIndex = scrollLeft / clientWidth;
    const clampedIndex = Math.min(totalSlides - 1, Math.max(0, Math.round(rawIndex)));

    setCurrentIndex((prev) => {
      if (prev === clampedIndex) {
        return prev;
      }
      if (clampedIndex > prev) {
        autoplayDirectionRef.current = 1;
      } else if (clampedIndex < prev) {
        autoplayDirectionRef.current = -1;
      }
      requestAnimationFrame(() => {
        scrollToSlide(clampedIndex, 'auto');
      });
      return clampedIndex;
    });
  }, [scrollToSlide, totalSlides]);

  const handlePointerRelease = useCallback(
    (event: PointerEvent) => {
      if (activePointerIdRef.current !== event.pointerId) {
        return;
      }
      pointerActiveRef.current = false;
      activePointerIdRef.current = null;
      window.removeEventListener('pointerup', handlePointerRelease);
      window.removeEventListener('pointercancel', handlePointerRelease);
      syncCurrentIndexFromScroll();
      scheduleAutoplayResume();
    },
    [scheduleAutoplayResume, syncCurrentIndexFromScroll]
  );

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (pointerActiveRef.current) {
        return;
      }

      pointerActiveRef.current = true;
      activePointerIdRef.current = event.pointerId;
      clearResumeAutoplayTimeout();
      stopAutoplay();

      window.addEventListener('pointerup', handlePointerRelease);
      window.addEventListener('pointercancel', handlePointerRelease);
    },
    [clearResumeAutoplayTimeout, handlePointerRelease, stopAutoplay]
  );

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
    autoplayDirectionRef.current = 1;
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

  useEffect(() => {
    return () => {
      stopAutoplay();
      clearResumeAutoplayTimeout();
      window.removeEventListener('pointerup', handlePointerRelease);
      window.removeEventListener('pointercancel', handlePointerRelease);
    };
  }, [clearResumeAutoplayTimeout, handlePointerRelease, stopAutoplay]);

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
      className="relative isolate w-full overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="region"
      aria-label="Featured experiences slideshow"
    >
      <div
        ref={carouselRef}
        onPointerDown={handlePointerDown}
        className="carousel w-full snap-x snap-mandatory overflow-x-auto scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {sessionSlides.map((slide, index) => {
          const imageSrc = resolveImageSrc(slide.image);
          const { primaryButton, secondaryButton } = getCTAConfig(slide, index);
          return (
            <div
              key={slide.id ?? index}
              className="carousel-item relative w-full snap-start"
            >
              {imageSrc && (
                <div className="absolute inset-0 h-full w-full">
                  <Image
                    src={imageSrc}
                    alt={slide.alt || `Slide ${index + 1}`}
                    fill
                    priority={index === 0}
                    sizes="100vw"
                    className="object-cover"
                    quality={90}
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/40 backdrop-blur-[2px]" aria-hidden="true" />
                </div>
              )}
              <div className="relative z-10 w-full px-[clamp(1.25rem,4vw,4rem)] py-[clamp(2.75rem,7vw,5.75rem)]">
                <div className="mx-auto flex w-full max-w-[min(70rem,94vw)] flex-col items-center gap-y-[clamp(0.875rem,2vw,2.25rem)] text-center text-white">
                  {slide.eyebrow && (
                    <p className="text-[clamp(0.75rem,1.8vw,1.0625rem)] font-semibold uppercase tracking-[0.32em] text-accent-300">
                      {slide.eyebrow}
                    </p>
                  )}
                  {slide.headline && (
                    <h2 className="text-balance font-display text-[clamp(2.15rem,5vw,3.65rem)] font-bold leading-[1.08]">
                      {slide.headline}
                    </h2>
                  )}
                  {slide.copy && (
                    <p className="mx-auto max-w-[65ch] text-pretty text-[clamp(1.05rem,2.4vw,1.45rem)] leading-relaxed text-white/90">
                      {slide.copy}
                    </p>
                  )}
                  {Array.isArray(slide.badges) && slide.badges.length > 0 && (
                    <div className="flex w-full flex-wrap items-center justify-center gap-2.5 sm:gap-3">
                      {slide.badges.map((badge) => (
                        <span
                          key={badge}
                          className="rounded-full border border-white/30 bg-white/15 px-3.5 py-1.5 text-[clamp(0.75rem,1.6vw,0.9375rem)] font-medium text-white/95 backdrop-blur-sm"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  )}
                  {slide.ctas && (
                    <div className="flex w-full flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4">
                      {primaryButton.href && (
                        <SlideCTAButton
                          variant={primaryButton.variant}
                          href={primaryButton.href}
                          className={`${primaryButton.className} w-full shrink-0 px-[clamp(1.5rem,3vw,3rem)] text-center text-sm xs:text-base sm:text-lg lg:text-xl sm:w-auto sm:max-w-[20rem]`}
                        />
                      )}
                      {secondaryButton.href && (
                        <SlideCTAButton
                          variant={secondaryButton.variant}
                          href={secondaryButton.href}
                          className={`${secondaryButton.className} w-full shrink-0 px-[clamp(1.5rem,3vw,3rem)] text-center text-sm xs:text-base sm:text-lg lg:text-xl sm:w-auto sm:max-w-[20rem]`}
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
                goToSlide(currentIndex - 1, 'smooth', -1);
                startAutoplay();
              }}
              className="btn btn-circle btn-ghost border-none bg-black/35 text-white hover:bg-black/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black/40"
              aria-label="Previous slide"
            >
              ❮
            </button>
            <button
              type="button"
              onClick={() => {
                stopAutoplay();
                goToSlide(currentIndex + 1, 'smooth', 1);
                startAutoplay();
              }}
              className="btn btn-circle btn-ghost border-none bg-black/35 text-white hover:bg-black/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black/40"
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
                  let direction: 1 | -1 | null = null;
                  if (index > currentIndex) {
                    direction = 1;
                  } else if (index < currentIndex) {
                    direction = -1;
                  }
                  goToSlide(index, 'smooth', direction);
                  startAutoplay();
                }}
                className={`h-3 rounded-full px-2 py-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black/40 ${
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
