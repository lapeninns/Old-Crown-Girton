/**
 * Centralized color tokens for the project.
 * Exported as a JS object so it can be used in both runtime (React) and build-time (Node) code.
 * Structure supports semantic tokens, grouped palettes, and light/dark themes.
 */
const base = {
  // Brand
  brand: {
    gold: '#D4941E', // original crown gold (light)
    goldDark: '#674C0A', // darker CTA gold (better contrast)
    red: '#7A1A1A',
    slate: '#334155',
    cream: '#FEF7ED',
  },

  // Neutral scale (from light to dark)
  neutral: {
    50: '#ffffff',
    100: '#f8fafc',
    200: '#f1f5f9',
    300: '#e2e8f0',
    400: '#cbd5e1',
    500: '#94a3b8',
    600: '#64748b',
    700: '#475569',
    800: '#334155',
    900: '#0f172a',
  },

  // State colors
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
      background: base.neutral[50],
      surface: base.neutral[100],
      text: '#111827', // dark text
      textMuted: base.neutral[500],
      border: base.neutral[300],

      // Brand semantic
      primary: base.brand.goldDark,
      primaryAccent: base.brand.gold,
      secondary: base.brand.slate,
      accent: base.brand.red,

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
      background: '#0b1220',
      surface: '#0f1724',
      text: '#f8fafc',
      textMuted: base.neutral[300],
      border: '#1f2937',

      // Brand semantic (adjusted for dark backgrounds)
      primary: '#E9C46A', // lighter gold for dark mode
      primaryAccent: base.brand.goldDark,
      secondary: base.brand.slate,
      accent: '#ff6b6b',

      // States
      success: '#4ade80',
      warning: '#f59e0b',
      error: '#ff6b6b',
      info: '#60a5fa',
    },
  },
};

// Helper to get a theme's CSS variables string for injecting into :root or a theme wrapper
function cssVariablesForTheme(themeName = 'light') {
  const t = themes[themeName] || themes.light;
  const lines = [];
  Object.entries(t.colors).forEach(([k, v]) => {
    lines.push(`--color-${k}: ${v};`);
  });
  // include neutral scale as well
  Object.entries(base.neutral).forEach(([k, v]) => {
    lines.push(`--color-neutral-${k}: ${v};`);
  });
  return lines.join('\n');
}

module.exports = {
  base,
  themes,
  cssVariablesForTheme,
};
