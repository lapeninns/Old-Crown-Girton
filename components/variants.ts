import { motionTokens as t } from "./motionTokens";

export const v = {
  // Generic fades
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: t.durations.sm, ease: t.eases.standard } },
    exit: { opacity: 0, transition: { duration: t.durations.xs, ease: t.eases.standard } },
  },
  // Slight lift on enter (cards, list items)
  fadeUp: {
    initial: { opacity: 0, y: t.dist.sm },
    animate: { opacity: 1, y: 0, transition: t.springs.enter },
    exit: { opacity: 0, y: t.dist.xs, transition: t.springs.exit },
  },
  // Overlays/menus/modals
  scaleIn: {
    initial: { opacity: 0, scale: 0.98 },
    animate: { opacity: 1, scale: 1, transition: { duration: t.dur.base, ease: t.ease.out } },
    exit: { opacity: 0, scale: 0.98, transition: { duration: t.dur.short, ease: t.ease.in } },
  },
  // Slide from top (dropdowns, toasts)
  slideDown: {
    initial: { opacity: 0, y: -t.dist.md },
    animate: { opacity: 1, y: 0, transition: { duration: t.dur.base, ease: t.ease.out } },
    exit: { opacity: 0, y: -t.dist.sm, transition: { duration: t.dur.short, ease: t.ease.in } },
  },
  // List container stagger
  list: (stagger = t.stagger.sm) => ({
    animate: { transition: { staggerChildren: stagger, delayChildren: 0.02 } }
  }),
  // Button micro-interaction (use as props)
  button: {
    whileHover: { y: -2, scale: 1.02, transition: { duration: t.dur.micro } },
    whileTap: { y: 0, scale: 0.98, transition: { duration: t.dur.micro } },
  },
};
