"use client";

import React from "react";

const shimmer = "animate-pulse bg-neutral-200/80 dark:bg-neutral-700/50";

const SlideshowSkeleton: React.FC = () => {
  return (
    <section
      aria-label="Slideshow loading placeholder"
      className="relative w-full h-[52svh] sm:h-[58svh] md:h-[65svh] overflow-hidden bg-neutral-200"
      data-testid="slideshow-skeleton"
    >
      <div className={`absolute inset-0 ${shimmer}`}></div>
      <div className="absolute inset-0 bg-neutral-900/40" />
      <div className="relative z-10 h-full flex flex-col items-center justify-center gap-6 px-6">
        <div className="flex flex-col gap-3 items-center text-center">
          <span className={`h-3 w-40 rounded-full ${shimmer}`} aria-hidden="true" />
          <span className={`h-7 w-72 sm:w-96 rounded-full ${shimmer}`} aria-hidden="true" />
          <span className={`h-3 w-64 sm:w-[28rem] rounded-full ${shimmer}`} aria-hidden="true" />
        </div>
        <div className="flex flex-wrap gap-2 justify-center max-w-2xl">
          {Array.from({ length: 3 }).map((_, idx) => (
            <span key={idx} className={`h-8 w-24 rounded-full ${shimmer}`} aria-hidden="true" />
          ))}
        </div>
        <div className="flex gap-3 flex-wrap justify-center">
          <span className={`h-11 w-40 rounded-full ${shimmer}`} aria-hidden="true" />
          <span className={`h-11 w-40 rounded-full ${shimmer}`} aria-hidden="true" />
        </div>
      </div>
    </section>
  );
};

export default SlideshowSkeleton;
