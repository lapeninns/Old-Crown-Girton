// Centralized motion tokens for consistent animation behavior
// Keep values aligned with existing components/motionTokens for continuity

export interface MotionTokens {
  duration: {
    instant: number; // 0ms – for reduced motion fallbacks
    fast: number; // 150ms – micro-interactions
    base: number; // 300ms – standard transitions
    slow: number; // 500ms – complex animations
    glacial: number; // 800ms – hero/showcase moments
  };
  easing: {
    linear: [number, number, number, number];
    easeOut: [number, number, number, number];
    easeIn: [number, number, number, number];
    easeInOut: [number, number, number, number];
    spring: { type: 'spring'; stiffness: number; damping: number };
    bounce: { type: 'spring'; bounce: number };
  };
  transforms: {
    scale: {
      grow: number; // 1.05 – hover grows
      shrink: number; // 0.95 – press shrinks
      hidden: number; // 0 – completely hidden
    };
    translate: {
      slideUp: string; // '-100%'
      slideDown: string; // '100%'
      slideLeft: string; // '-100%'
      slideRight: string; // '100%'
    };
    opacity: {
      visible: number; // 1
      hidden: number; // 0
      subtle: number; // 0.6 – disabled/placeholder states
    };
  };
}

export const motionTokens: MotionTokens = {
  duration: {
    instant: 0,
    fast: 0.15,
    base: 0.3,
    slow: 0.5,
    glacial: 0.8,
  },
  easing: {
    linear: [0, 0, 1, 1],
    easeOut: [0.2, 0, 0, 1],
    easeIn: [0.4, 0, 1, 1],
    easeInOut: [0.4, 0, 0.2, 1],
    spring: { type: 'spring', stiffness: 280, damping: 30 },
    bounce: { type: 'spring', bounce: 0.3 },
  },
  transforms: {
    scale: {
      grow: 1.05,
      shrink: 0.95,
      hidden: 0,
    },
    translate: {
      slideUp: '-100%',
      slideDown: '100%',
      slideLeft: '-100%',
      slideRight: '100%',
    },
    opacity: {
      visible: 1,
      hidden: 0,
      subtle: 0.6,
    },
  },
};

export default motionTokens;

