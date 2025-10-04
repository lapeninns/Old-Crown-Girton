"use client";

import DaisyUISlideshow from './DaisyUISlideshow';
import ErrorBoundary from '../ErrorBoundary';
import SlideshowFallback from './SlideshowFallback';

const Showcase = () => {
  return (
    <ErrorBoundary fallback={<SlideshowFallback />}>
      <DaisyUISlideshow autoplay={true} interval={5000} />
    </ErrorBoundary>
  );
};

export default Showcase;
