"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { slides as defaultSlides } from './slides';

interface DaisyUISlideshowProps {
  autoplay?: boolean;
  interval?: number;
}

const DaisyUISlideshow: React.FC<DaisyUISlideshowProps> = ({ 
  autoplay = true, 
  interval = 5000 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const slides = defaultSlides || [];
  const totalSlides = slides.length;

  // Navigate to specific slide
  const goToSlide = useCallback((index: number) => {
    if (index < 0 || index >= totalSlides) return;
    setCurrentIndex(index);
    
    // Scroll to the slide
    const carousel = carouselRef.current;
    if (carousel) {
      const slideWidth = carousel.offsetWidth;
      carousel.scrollTo({
        left: slideWidth * index,
        behavior: 'smooth'
      });
    }
  }, [totalSlides]);

  // Next slide
  const nextSlide = useCallback(() => {
    const nextIndex = (currentIndex + 1) % totalSlides;
    goToSlide(nextIndex);
  }, [currentIndex, totalSlides, goToSlide]);

  // Previous slide
  const prevSlide = useCallback(() => {
    const prevIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    goToSlide(prevIndex);
  }, [currentIndex, totalSlides, goToSlide]);

  // Autoplay functionality
  useEffect(() => {
    if (!autoplay || totalSlides <= 1) return;

    autoplayTimerRef.current = setInterval(() => {
      nextSlide();
    }, interval);

    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };
  }, [autoplay, interval, nextSlide, totalSlides]);

  // Pause autoplay on hover
  const handleMouseEnter = () => {
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
    }
  };

  const handleMouseLeave = () => {
    if (autoplay && totalSlides > 1) {
      autoplayTimerRef.current = setInterval(() => {
        nextSlide();
      }, interval);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  if (slides.length === 0) {
    return null;
  }

  return (
    <div 
      className="relative w-full h-screen overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="region"
      aria-label="Featured experiences slideshow"
    >
      {/* Carousel Container */}
      <div 
        ref={carouselRef}
        className="carousel w-full h-full snap-x snap-mandatory overflow-x-auto scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {slides.map((slide, index) => {
          let imageSrc: any = slide.image;
          
          // Extract primary image if it's an object with primary/fallback
          if (typeof slide.image === 'object' && slide.image !== null && 'primary' in slide.image) {
            imageSrc = slide.image.primary;
          }
          
          return (
            <div
              key={slide.id || index}
              id={`slide-${index}`}
              className="carousel-item relative w-full h-full snap-start"
            >
              {/* Background Image */}
              <div className="absolute inset-0 w-full h-full">
                <Image
                  src={imageSrc}
                  alt={slide.alt || `Slide ${index + 1}`}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  quality={90}
                  sizes="100vw"
                />
                {/* Overlay for better text readability */}
                <div className="absolute inset-0 bg-black/30" />
              </div>

              {/* Content Overlay */}
              <div className="relative z-10 flex items-center justify-center w-full h-full">
                <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center text-white">
                  {slide.eyebrow && (
                    <p className="text-sm sm:text-base font-semibold uppercase tracking-wider text-accent-300 mb-2 sm:mb-4">
                      {slide.eyebrow}
                    </p>
                  )}
                  {slide.headline && (
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4 sm:mb-6 leading-tight">
                      {slide.headline}
                    </h2>
                  )}
                  {slide.copy && (
                    <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
                      {slide.copy}
                    </p>
                  )}
                  
                  {/* Badges */}
                  {slide.badges && slide.badges.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-2 mb-6 sm:mb-8">
                      {slide.badges.map((badge, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 text-xs sm:text-sm bg-white/20 backdrop-blur-sm rounded-full border border-white/30"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* CTAs */}
                  {slide.ctas && (
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                      {slide.ctas.bookUrl && (
                        <a
                          href={slide.ctas.bookUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-primary btn-lg bg-accent-500 hover:bg-accent-600 text-white border-none"
                        >
                          Book a Table
                        </a>
                      )}
                      {slide.ctas.callTel && (
                        <a
                          href={slide.ctas.callTel}
                          className="btn btn-outline btn-lg text-white border-white hover:bg-white hover:text-brand-800"
                        >
                          Call Now
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows */}
      <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 flex justify-between z-20">
        <button
          onClick={prevSlide}
          className="btn btn-circle btn-ghost bg-black/30 hover:bg-black/50 text-white border-none"
          aria-label="Previous slide"
        >
          ❮
        </button>
        <button
          onClick={nextSlide}
          className="btn btn-circle btn-ghost bg-black/30 hover:bg-black/50 text-white border-none"
          aria-label="Next slide"
        >
          ❯
        </button>
      </div>

      {/* Dot Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex
                ? 'bg-white w-8'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === currentIndex ? 'true' : 'false'}
          />
        ))}
      </div>

      {/* Screen Reader Announcements */}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        Slide {currentIndex + 1} of {totalSlides}: {slides[currentIndex]?.headline}
      </div>
    </div>
  );
};

export default DaisyUISlideshow;
