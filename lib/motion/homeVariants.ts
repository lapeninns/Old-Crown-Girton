/**
 * Home page specific animation variants
 * Extends the core variants system with restaurant-specific animations
 * Follows project's performance and accessibility standards
 */

import { motionTokens as t } from './tokens';

// Type definitions for consistency with existing variants
type VariantTarget = any;

export interface HomeVariantLibrary {
  // Hero section animations
  heroContainer: { hidden: VariantTarget; visible: VariantTarget };
  heroTitle: { hidden: VariantTarget; visible: VariantTarget };
  heroSubtitle: { hidden: VariantTarget; visible: VariantTarget };
  heroButton: { hidden: VariantTarget; visible: VariantTarget; hover: VariantTarget; tap: VariantTarget };
  
  // Menu section animations
  menuContainer: { hidden: VariantTarget; visible: VariantTarget };
  menuCard: { hidden: VariantTarget; visible: VariantTarget; hover: VariantTarget };
  menuMarquee: { hidden: VariantTarget; visible: VariantTarget };
  
  // About section animations
  aboutText: { hidden: VariantTarget; visible: VariantTarget };
  aboutImage: { hidden: VariantTarget; visible: VariantTarget };
  aboutFeatures: { hidden: VariantTarget; visible: VariantTarget };
  
  // Section headers
  sectionHeader: { hidden: VariantTarget; visible: VariantTarget };
  sectionSubheader: { hidden: VariantTarget; visible: VariantTarget };
  
  // Page-level animations
  pageContainer: { hidden: VariantTarget; visible: VariantTarget };
  
  // Restaurant-specific animations
  testimonialCard: { hidden: VariantTarget; visible: VariantTarget; hover: VariantTarget };
  ctaSection: { hidden: VariantTarget; visible: VariantTarget };
  locationCard: { hidden: VariantTarget; visible: VariantTarget };
}

export const homeVariants: HomeVariantLibrary = {
  // Hero Section - Staggered entrance for maximum impact
  heroContainer: {
    hidden: { opacity: t.transforms.opacity.hidden },
    visible: {
      opacity: t.transforms.opacity.visible,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
        duration: t.duration.base,
        ease: t.easing.easeOut,
      },
    },
  },
  
  heroTitle: {
    hidden: { 
      opacity: t.transforms.opacity.hidden, 
      y: 30,
      scale: 0.98 
    },
    visible: {
      opacity: t.transforms.opacity.visible,
      y: 0,
      scale: 1,
      transition: { 
        duration: t.duration.slow, 
        ease: t.easing.easeOut,
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  },
  
  heroSubtitle: {
    hidden: { 
      opacity: t.transforms.opacity.hidden, 
      y: 20 
    },
    visible: {
      opacity: t.transforms.opacity.visible,
      y: 0,
      transition: { 
        duration: t.duration.base, 
        ease: t.easing.easeOut,
        delay: 0.1,
      },
    },
  },
  
  heroButton: {
    hidden: { 
      opacity: t.transforms.opacity.hidden, 
      scale: 0.9,
      y: 10,
    },
    visible: {
      opacity: t.transforms.opacity.visible,
      scale: 1,
      y: 0,
      transition: { 
        duration: t.duration.base, 
        ease: t.easing.easeOut,
        delay: 0.2,
      },
    },
    hover: {
      scale: t.transforms.scale.grow,
      y: -2,
      transition: { duration: t.duration.fast },
    },
    tap: { 
      scale: t.transforms.scale.shrink,
      transition: { duration: t.duration.fast },
    },
  },

  // Featured Menu Section - Smooth reveal with stagger
  menuContainer: {
    hidden: { opacity: t.transforms.opacity.hidden },
    visible: {
      opacity: t.transforms.opacity.visible,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
        duration: t.duration.base,
      },
    },
  },
  
  menuCard: {
    hidden: { 
      opacity: t.transforms.opacity.hidden, 
      y: 20, 
      scale: 0.95 
    },
    visible: {
      opacity: t.transforms.opacity.visible,
      y: 0,
      scale: 1,
      transition: { 
        duration: t.duration.base, 
        ease: t.easing.easeOut,
      },
    },
    hover: {
      y: -4,
      scale: 1.02,
      boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
      transition: { 
        duration: t.duration.fast,
        ease: t.easing.easeOut,
      },
    },
  },

  menuMarquee: {
    hidden: { 
      opacity: t.transforms.opacity.hidden,
      y: 15,
    },
    visible: {
      opacity: t.transforms.opacity.visible,
      y: 0,
      transition: { 
        duration: t.duration.slow, 
        ease: t.easing.easeOut,
        delay: 0.2,
      },
    },
  },

  // About Section - Split content animation
  aboutText: {
    hidden: { 
      opacity: t.transforms.opacity.hidden, 
      x: -30,
      y: 10,
    },
    visible: {
      opacity: t.transforms.opacity.visible,
      x: 0,
      y: 0,
      transition: { 
        duration: t.duration.slow, 
        ease: t.easing.easeOut,
        type: "spring",
        stiffness: 80,
        damping: 20,
      },
    },
  },
  
  aboutImage: {
    hidden: { 
      opacity: t.transforms.opacity.hidden, 
      x: 30,
      scale: 0.98,
    },
    visible: {
      opacity: t.transforms.opacity.visible,
      x: 0,
      scale: 1,
      transition: { 
        duration: t.duration.slow, 
        ease: t.easing.easeOut,
        delay: 0.1,
      },
    },
  },

  aboutFeatures: {
    hidden: { 
      opacity: t.transforms.opacity.hidden, 
      y: 15,
    },
    visible: {
      opacity: t.transforms.opacity.visible,
      y: 0,
      transition: { 
        duration: t.duration.base, 
        ease: t.easing.easeOut,
        delay: 0.3,
      },
    },
  },

  // Section Headers - Consistent reveal pattern
  sectionHeader: {
    hidden: { 
      opacity: t.transforms.opacity.hidden, 
      y: 20,
      scale: 0.98,
    },
    visible: {
      opacity: t.transforms.opacity.visible,
      y: 0,
      scale: 1,
      transition: { 
        duration: t.duration.base, 
        ease: t.easing.easeOut,
      },
    },
  },

  sectionSubheader: {
    hidden: { 
      opacity: t.transforms.opacity.hidden, 
      y: 15,
    },
    visible: {
      opacity: t.transforms.opacity.visible,
      y: 0,
      transition: { 
        duration: t.duration.base, 
        ease: t.easing.easeOut,
        delay: 0.1,
      },
    },
  },

  // Page Container - Smooth page entrance
  pageContainer: {
    hidden: { opacity: t.transforms.opacity.hidden },
    visible: {
      opacity: t.transforms.opacity.visible,
      transition: {
        duration: t.duration.fast,
        when: "beforeChildren",
        ease: t.easing.easeOut,
      },
    },
  },

  // Restaurant-specific components
  testimonialCard: {
    hidden: { 
      opacity: t.transforms.opacity.hidden, 
      y: 25, 
      scale: 0.95,
    },
    visible: {
      opacity: t.transforms.opacity.visible,
      y: 0,
      scale: 1,
      transition: { 
        duration: t.duration.base, 
        ease: t.easing.easeOut,
      },
    },
    hover: {
      y: -3,
      scale: 1.01,
      transition: { duration: t.duration.fast },
    },
  },

  ctaSection: {
    hidden: { 
      opacity: t.transforms.opacity.hidden,
      y: 20,
    },
    visible: {
      opacity: t.transforms.opacity.visible,
      y: 0,
      transition: { 
        duration: t.duration.slow, 
        ease: t.easing.easeOut,
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  },

  locationCard: {
    hidden: { 
      opacity: t.transforms.opacity.hidden, 
      y: 20,
      scale: 0.98,
    },
    visible: {
      opacity: t.transforms.opacity.visible,
      y: 0,
      scale: 1,
      transition: { 
        duration: t.duration.base, 
        ease: t.easing.easeOut,
      },
    },
  },
};

// Optimized viewport settings for restaurant website
export const homeViewportConfig = {
  // Standard settings for most sections
  default: { 
    once: true, 
    amount: 0.2,
    margin: '0px 0px -10% 0px' 
  },
  
  // Early trigger for above-fold content
  hero: { 
    once: true, 
    amount: 0.1,
    margin: '0px 0px -5% 0px' 
  },
  
  // Optimized for menu cards (many elements)
  menu: { 
    once: true, 
    amount: 0.15,
    margin: '0px 0px -15% 0px' 
  },
  
  // Slower trigger for below-fold sections
  footer: { 
    once: true, 
    amount: 0.3,
    margin: '0px 0px -20% 0px' 
  },
};

export default homeVariants;