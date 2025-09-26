"use client";

import Slideshow from './Slideshow';
import ErrorBoundary from '../ErrorBoundary';
import SlideshowFallback from './SlideshowFallback';

const Showcase = () => {
  return (
    <ErrorBoundary fallback={<SlideshowFallback />}>
      <Slideshow autoplay={true} interval={5000} />
    </ErrorBoundary>
  );
};

export default Showcase;
