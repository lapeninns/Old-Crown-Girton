// Centralized image import registry (extend as needed).
// Example structure, safe placeholder to guide usage.
export const componentImages = {
  Header: {
    logo: {
      // Example: add assets once placed
      // light: require('@images/components/Header/logo/logo-light.svg').default,
      // dark: require('@images/components/Header/logo/logo-dark.svg').default,
    },
    navigation: {
      // menuIcon: require('@images/components/Header/navigation/menu-icon.svg').default,
    },
  },
  Hero: {
    backgrounds: {
      // desktop: require('@images/pages/home/hero/hero-bg-desktop.webp').default,
    },
  },
} as const;

export type ComponentImageRegistry = typeof componentImages;

