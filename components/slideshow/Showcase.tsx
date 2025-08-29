"use client";

import Slideshow from './Slideshow';

const Showcase = () => {
  // Disable autoplay to avoid motion on pages using this component
  return <Slideshow autoplay={false} />;
};

export default Showcase;
