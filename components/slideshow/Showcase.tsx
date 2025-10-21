"use client";

import DaisyUISlideshow from './DaisyUISlideshow';
import ErrorBoundary from '../ErrorBoundary';
import SlideshowFallback from './SlideshowFallback';
import type { Slide } from './types';

interface ShowcaseProps {
  slides: Slide[];
  settings?: {
    autoplay?: boolean;
    intervalMs?: number;
    sessionSize?: number;
    regionLabel?: string;
    sectionLabel?: string;
  };
  regionLabel?: string;
  sectionLabel?: string;
}

const DEFAULT_SECTION_LABEL = 'Restaurant showcase';

const Showcase = ({ slides, settings, regionLabel, sectionLabel }: ShowcaseProps) => {
  if (!Array.isArray(slides) || slides.length === 0) {
    return <SlideshowFallback />;
  }

  const interval = settings?.intervalMs ?? 5000;
  const autoplay = settings?.autoplay ?? true;
  const sessionSize = settings?.sessionSize;
  const effectiveRegionLabel = regionLabel ?? settings?.regionLabel;
  const effectiveSectionLabel = sectionLabel ?? settings?.sectionLabel ?? DEFAULT_SECTION_LABEL;

  return (
    <ErrorBoundary fallback={<SlideshowFallback />}>
      <DaisyUISlideshow
        slides={slides}
        autoplay={autoplay}
        interval={interval}
        sessionSize={sessionSize}
        regionLabel={effectiveRegionLabel}
      />
    </ErrorBoundary>
  );
};

export default Showcase;
