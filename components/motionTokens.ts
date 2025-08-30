export const motionTokens = {
  dur: { micro: 0.18, short: 0.22, base: 0.26, long: 0.32, xlong: 0.4 },
  durations: { xs: 0.12, sm: 0.18, md: 0.24 },
  ease: {
    out: [0.2, 0, 0, 1] as [number, number, number, number],
    in: [0.4, 0, 1, 1] as [number, number, number, number],
    inOut: [0.4, 0, 0.2, 1] as [number, number, number, number],
  },
  eases: {
    standard: [0.2, 0.0, 0.0, 1.0] as [number, number, number, number],
  },
  dist: { xs: 6, sm: 10, md: 14 },
  stagger: { sm: 0.02, md: 0.04 },
  springs: {
    enter: { type: 'spring', stiffness: 280, damping: 30, mass: 0.7 } as const,
    exit: { type: 'spring', stiffness: 300, damping: 40, mass: 0.8 } as const,
  },
};
