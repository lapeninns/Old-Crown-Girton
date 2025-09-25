"use client";

import { useMemo } from "react";
import { useFeatureFlags } from '@/hooks/data/useConfig';

type IndicatorStyle = 'dots' | 'thumbnails';

type ControlLayout = 'expanded' | 'compact';

type VariantName = 'classic' | 'enhanced';

export interface SlideshowVariantConfig {
  variant: VariantName;
  indicatorStyle: IndicatorStyle;
  controlLayout: ControlLayout;
  autoplayResumeDelayMs: number;
  enableMomentumSkip: boolean;
  analyticsSamplingRate: number;
}

const DEFAULT_CONFIG: SlideshowVariantConfig = {
  variant: 'classic',
  indicatorStyle: 'dots',
  controlLayout: 'expanded',
  autoplayResumeDelayMs: 3500,
  enableMomentumSkip: true,
  analyticsSamplingRate: 1,
};

/**
 * Lightweight hook to expose slideshow variant + feature toggle configuration.
 * Taps the shared feature flag infrastructure to keep experiments consistent.
 */
export function useSlideshowVariant(): SlideshowVariantConfig {
  const { featureFlags } = useFeatureFlags();

  return useMemo(() => {
    if (!featureFlags) return DEFAULT_CONFIG;

    const variant: VariantName = featureFlags['slideshow.enhanced-ui'] ? 'enhanced' : 'classic';
    const indicatorStyle: IndicatorStyle = featureFlags['slideshow.indicators.thumbnails'] ? 'thumbnails' : 'dots';
    const controlLayout: ControlLayout = featureFlags['slideshow.controls.compact'] ? 'compact' : 'expanded';
    const autoplayResumeDelayMs = featureFlags['slideshow.autoplay.resumeFast'] ? 2000 : DEFAULT_CONFIG.autoplayResumeDelayMs;
    const enableMomentumSkip = featureFlags['slideshow.momentum.skip'] !== false;
    const analyticsSamplingRate = typeof featureFlags['slideshow.analytics.sample'] === 'number'
      ? Math.max(0, Math.min(1, featureFlags['slideshow.analytics.sample']))
      : DEFAULT_CONFIG.analyticsSamplingRate;

    return {
      variant,
      indicatorStyle,
      controlLayout,
      autoplayResumeDelayMs,
      enableMomentumSkip,
      analyticsSamplingRate,
    };
  }, [featureFlags]);
}

export default useSlideshowVariant;
