"use client";

import Slideshow from './Slideshow';

const Showcase = () => {
  // Enable autoplay for slideshow per request
  return <Slideshow autoplay={true} interval={5000} />;
};

export default Showcase;
