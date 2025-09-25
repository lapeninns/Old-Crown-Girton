"use client";

import React from "react";

const SlideshowFallback: React.FC = () => {
  const handleRetry = () => {
    try {
      window.location.reload();
    } catch (error) {
      console.warn('Unable to reload page for slideshow retry', error);
    }
  };

  return (
    <section className="relative w-full h-[52svh] sm:h-[58svh] md:h-[65svh] flex flex-col items-center justify-center gap-4 bg-neutral-900 text-neutral-100 rounded-3xl border border-neutral-700 p-8 text-center">
      <h2 className="text-2xl font-semibold">Slideshow temporarily unavailable</h2>
      <p className="max-w-xl text-sm text-neutral-200">
        We ran into an unexpected error while loading the experience. You can retry or contact the team for assistance.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          type="button"
          onClick={handleRetry}
          className="px-4 py-2 rounded-lg bg-white text-neutral-900 font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          Retry
        </button>
        <a
          className="px-4 py-2 rounded-lg border border-white/40 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          href="mailto:hello@oldcrowngirton.co.uk?subject=Slideshow%20support"
        >
          Contact support
        </a>
      </div>
    </section>
  );
};

export default SlideshowFallback;
