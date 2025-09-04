/**
 * Centralized color tokens for the project - Himalayan Spice Brand Palette
 * Exported as a JS object so it can be used in both runtime (React) and build-time (Node) code.
 * Structure supports semantic tokens, grouped palettes, and light/dark themes.
 * 
 * Brand Colors: Terracotta (#B86B5E), Saffron (#F4C430), Peacock Teal (#008080)
 * Heritage Colors: Nepal Crimson (#DC143C), India Green (#046A38)
 * Spice & Tavern: Marigold (#FFB000), Stout (#4C3A2D), Cardamom (#7A8F49)
 * Neutrals: Cream base (#F5F0E6), Dark base (#2B251F)
 */
const base = {
  // Core Brand Colors (50-950 scales)
  brand: {
    50: '#FDF8F7',
    100: '#F9EFEC',
    200: '#F1DDD8',
    300: '#E5C3B9',
    400: '#D49D8C',
    500: '#B86B5E', // Terracotta anchor
    600: '#A15548',
    700: '#87453B',
    800: '#703A32',
    900: '#5D332D',
    950: '#321B17',
  },

  accent: {
    50: '#FEFDF7',
    100: '#FEFAEB',
    200: '#FDF2C8',
    300: '#FCE7A1',
    400: '#F9D669',
    500: '#F4C430', // Saffron anchor
    600: '#E8A511',
    700: '#C37F0F',
    800: '#9F6314',
    900: '#825217',
    950: '#4A2E08',
  },

  secondary: {
    300: '#5CFFFE',
    500: '#008080', // Peacock Teal anchor
    600: '#006666',
    700: '#005252',
  },

  // Heritage Colors
  crimson: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#DC143C', // Nepal Crimson anchor
    600: '#C41E3A',
    700: '#A61E3A',
    800: '#881C37',
  },



  indiagreen: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0',
    300: '#86EFAC',
    400: '#4ADE80',
    500: '#046A38', // India Green anchor
    600: '#16A34A',
    700: '#15803D',
    800: '#166534',
    900: '#14532D',
    950: '#052E16',
  },

  // Spice & Tavern Colors
  marigold: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#FFB000', // Marigold anchor
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
    950: '#451A03',
  },







  stout: {
    50: '#F8F7F4',
    100: '#EFEDE6',
    200: '#DDD9CD',
    300: '#C5BFAB',
    400: '#A89F85',
    500: '#4C3A2D', // Stout anchor
    600: '#6B5D4F',
    700: '#584C41',
    800: '#4A4037',
    900: '#3F3730',
    950: '#221E19',
  },

  cardamom: {
    50: '#F7F8F3',
    100: '#ECEFE3',
    200: '#DAE0C8',
    300: '#C0CBA4',
    400: '#A4B380',
    500: '#7A8F49', // Cardamom anchor
    600: '#6B7F3F',
    700: '#566435',
    800: '#46522E',
    900: '#3C4629',
    950: '#1F2513',
  },

  // Enhanced Neutrals (Cream & Dark based)
  neutral: {
    50: '#F5F0E6', // Cream base for day mode
    100: '#EDE6D9',
    200: '#DDD4C5',
    300: '#C8BBA8',
    400: '#B3A08A',
    500: '#94A3B8', // Mid-tone for accessibility
    600: '#64748b',
    700: '#475569',
    800: '#334155',
    900: '#2B251F', // Dark base for night mode
    950: '#1A1611',
  },

  // State colors (enhanced for accessibility)
  state: {
    success: '#059669',
    warning: '#D97706',
    error: '#DC2626',
    info: '#0284c7',
  },
};

const themes = {
  light: {
    name: 'light',
    colors: {
      // Day Mode: Light cream surfaces, warm accents
      background: base.neutral[50], // Cream base
      surface: base.neutral[100],
      text: base.neutral[900], // Dark base text
      textMuted: base.neutral[600],
      border: base.neutral[300],

      // Brand semantic - Day mode (Restaurant)
      primary: base.brand[700], // Deeper terracotta for headings
      primaryAccent: base.accent[600], // Saffron for CTAs
      secondary: base.secondary[600], // Teal for links
      accent: base.crimson[600], // Nepal crimson for emphasis

      // States
      success: base.state.success,
      warning: base.state.warning,
      error: base.state.error,
      info: base.state.info,
    },
  },

  dark: {
    name: 'dark',
    colors: {
      // Night Mode: Stout/charcoal surfaces, marigold accents
      background: base.stout[900], // Dark stout for night pub mode
      surface: base.stout[800],
      text: base.neutral[50], // Light cream text
      textMuted: base.neutral[400], // Neutral muted text
      border: base.stout[700],

      // Brand semantic - Night mode (Pub)
      primary: base.accent[400], // Accent typography on dark
      primaryAccent: base.marigold[500], // Marigold accents
      secondary: base.crimson[400], // Crimson for links
      accent: base.crimson[400], // Lighter crimson for night

      // States (night-adjusted)
      success: '#4ade80',
      warning: base.marigold[400], // Marigold for warnings
      error: base.crimson[400],
      info: base.secondary[400],
    },
  },
};

// Helper to get a theme's CSS variables string for injecting into :root or a theme wrapper
function cssVariablesForTheme(themeName = 'light') {
  const t = themes[themeName] || themes.light;
  const lines = [];
  
  // Add theme-specific semantic colors
  Object.entries(t.colors).forEach(([k, v]) => {
    lines.push(`--color-${k}: ${v};`);
  });
  
  // Add all color families with full 50-950 scales
  const colorFamilies = [
    'brand', 'accent', 'secondary', 'crimson', 'indiagreen',
    'marigold', 'stout', 'cardamom', 'neutral'
  ];
  
  colorFamilies.forEach(family => {
    Object.entries(base[family]).forEach(([step, value]) => {
      lines.push(`--color-${family}-${step}: ${value};`);
    });
  });
  
  // Add gradient tokens
  lines.push(`--grad-saffron-brand: linear-gradient(135deg, var(--color-accent-300), var(--color-brand-600));`);
  lines.push(`--grad-heritage: linear-gradient(135deg, var(--color-crimson-500), var(--color-indiagreen-500));`);
  
  return lines.join('\n');
}

module.exports = {
  base,
  themes,
  cssVariablesForTheme,
};
