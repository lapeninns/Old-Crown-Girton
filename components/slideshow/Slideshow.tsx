"use client";

import DaisyUISlideshow from './DaisyUISlideshow';
import SlideshowFallback from './SlideshowFallback';
import type { Slide } from './types';

interface SlideshowProps {
  slides: Slide[];
  interval?: number;
  autoplay?: boolean;
  sessionSize?: number;
}

const Slideshow: React.FC<SlideshowProps> = ({
  slides,
  interval = 5000,
  autoplay = true,
  sessionSize,
}) => {
  if (!Array.isArray(slides) || slides.length === 0) {
    return <SlideshowFallback />;
  }

  return (
    <DaisyUISlideshow
      slides={slides}
      interval={interval}
      autoplay={autoplay}
      sessionSize={sessionSize}
    />
  );
};

export default Slideshow;
