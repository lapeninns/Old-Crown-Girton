// Using 'any' for variant target objects to keep flexibility across FM versions
type VariantTarget = any;
import { motionTokens as t } from './tokens';

export interface VariantLibrary {
  pageTransition: {
    initial: VariantTarget;
    animate: VariantTarget;
    exit: VariantTarget;
  };
  fadeUp: { hidden: VariantTarget; visible: VariantTarget };
  fadeIn: { hidden: VariantTarget; visible: VariantTarget };
  slideIn: { hidden: VariantTarget; visible: VariantTarget };
  scaleIn: { hidden: VariantTarget; visible: VariantTarget };
  button: { rest: VariantTarget; hover: VariantTarget; tap: VariantTarget };
  card: { rest: VariantTarget; hover: VariantTarget };
  expand: { collapsed: VariantTarget; expanded: VariantTarget };
  accordion: { closed: VariantTarget; open: VariantTarget };
  list: { hidden: VariantTarget; visible: VariantTarget };
  listItem: { hidden: VariantTarget; visible: VariantTarget };
  staggerContainer: { hidden: VariantTarget; visible: VariantTarget };
}

export const variants: VariantLibrary = {
  pageTransition: {
    initial: { opacity: t.transforms.opacity.hidden, y: 8 },
    animate: {
      opacity: t.transforms.opacity.visible,
      y: 0,
      transition: { duration: t.duration.base, ease: t.easing.easeOut },
    },
    exit: {
      opacity: t.transforms.opacity.hidden,
      y: -6,
      transition: { duration: t.duration.fast, ease: t.easing.easeIn },
    },
  },
  fadeUp: {
    hidden: { opacity: t.transforms.opacity.hidden, y: 12 },
    visible: {
      opacity: t.transforms.opacity.visible,
      y: 0,
      transition: t.easing.spring,
    },
  },
  fadeIn: {
    hidden: { opacity: t.transforms.opacity.hidden },
    visible: {
      opacity: t.transforms.opacity.visible,
      transition: { duration: t.duration.base, ease: t.easing.easeOut },
    },
  },
  slideIn: {
    hidden: { opacity: t.transforms.opacity.hidden, x: -16 },
    visible: {
      opacity: t.transforms.opacity.visible,
      x: 0,
      transition: { duration: t.duration.base, ease: t.easing.easeOut },
    },
  },
  scaleIn: {
    hidden: { opacity: t.transforms.opacity.hidden, scale: 0.98 },
    visible: {
      opacity: t.transforms.opacity.visible,
      scale: 1,
      transition: { duration: t.duration.base, ease: t.easing.easeOut },
    },
  },
  button: {
    rest: { scale: 1 },
    hover: { scale: t.transforms.scale.grow, transition: { duration: t.duration.fast } },
    tap: { scale: t.transforms.scale.shrink, transition: { duration: t.duration.fast } },
  },
  card: {
    rest: { y: 0, boxShadow: 'var(--tw-shadow)' },
    hover: { y: -2, transition: { duration: t.duration.fast } },
  },
  expand: {
    collapsed: { height: 0, opacity: t.transforms.opacity.hidden },
    expanded: {
      height: 'auto',
      opacity: t.transforms.opacity.visible,
      transition: { duration: t.duration.base, ease: t.easing.easeInOut },
    },
  },
  accordion: {
    closed: { height: 0, opacity: t.transforms.opacity.hidden },
    open: { height: 'auto', opacity: t.transforms.opacity.visible },
  },
  list: {
    hidden: { opacity: t.transforms.opacity.hidden },
    visible: {
      opacity: t.transforms.opacity.visible,
      transition: { staggerChildren: 0.06, delayChildren: 0.02 },
    },
  },
  listItem: {
    hidden: { opacity: t.transforms.opacity.hidden, y: 8 },
    visible: { opacity: t.transforms.opacity.visible, y: 0 },
  },
  staggerContainer: {
    hidden: { opacity: t.transforms.opacity.hidden },
    visible: {
      opacity: t.transforms.opacity.visible,
      transition: { staggerChildren: 0.07 },
    },
  },
};

// Navigation motion system
export interface NavMotionConfig {
  activeIndicator: {
    layoutId: string;
    variants: VariantTarget;
  };
  mobileDrawer: {
    backdrop: VariantTarget;
    panel: VariantTarget;
    stagger: VariantTarget;
  };
  stickyBehavior: {
    variants: VariantTarget;
    scrollTrigger: IntersectionObserverInit;
  };
}

export const navMotion: NavMotionConfig = {
  activeIndicator: {
    layoutId: 'nav:active-underline',
    variants: {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: { duration: t.duration.fast } },
      exit: { opacity: 0, transition: { duration: t.duration.fast } },
      layout: true,
    },
  },
  mobileDrawer: {
    backdrop: {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: { duration: t.duration.base } },
      exit: { opacity: 0, transition: { duration: t.duration.fast } },
    },
    panel: {
      initial: { opacity: 0, x: 24, scale: 0.98 },
      animate: { opacity: 1, x: 0, scale: 1, transition: { duration: t.duration.base, ease: t.easing.easeOut } },
      exit: { opacity: 0, x: 24, scale: 0.98, transition: { duration: t.duration.fast, ease: t.easing.easeIn } },
    },
    stagger: {
      animate: { transition: { staggerChildren: 0.05, delayChildren: 0.02 } },
    },
  },
  stickyBehavior: {
    variants: {
      initial: { y: 0, boxShadow: 'var(--tw-shadow)' },
      animate: { y: 0 },
      scrolled: { y: 0, backdropFilter: 'blur(8px)', backgroundColor: 'rgba(255,255,255,0.95)' },
    },
    scrollTrigger: { rootMargin: '-10% 0px -90% 0px', threshold: 0 },
  },
};

export default variants;
