const { themes, base } = require('./theme/colors');
const LIGHT = themes.light.colors;

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./styles/globals.css",
  ],
  theme: {
    // Custom container to align with requested breakpoint sizes
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1rem',
        md: '1.25rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '2.5rem',
      },
      screens: {
        sm: '576px',   // Small tablets portrait
        md: '768px',   // Tablets portrait, small laptops
        lg: '992px',   // Tablets landscape, desktop
        xl: '1200px',  // Desktop
        '2xl': '1400px',
      },
    },
    extend: {
      // Additional fine‑grained breakpoints (preserve Tailwind defaults)
      screens: {
        xxs: '320px',   // Smallest phones
        xs: '375px',    // iPhone SE, small phones
        sm480: '480px', // Large phones landscape
        sm576: '576px', // Small tablets portrait
        lg992: '992px',
        xl1200: '1200px',
        xl1400: '1400px',
        fhd: '1920px',  // Full HD+
        uw2k: '2560px', // 2K/4K ultra-wide
        uw3440: '3440px',
      },
      colors: {
        // Himalayan Spice Brand Colors (50-950 scales)
        brand: {
          50: 'var(--color-brand-50)',
          100: 'var(--color-brand-100)',
          200: 'var(--color-brand-200)',
          300: 'var(--color-brand-300)',
          400: 'var(--color-brand-400)',
          500: 'var(--color-brand-500)', // Terracotta anchor
          600: 'var(--color-brand-600)',
          700: 'var(--color-brand-700)',
          800: 'var(--color-brand-800)',
          900: 'var(--color-brand-900)',
          950: 'var(--color-brand-950)',
        },
        accent: {
          50: 'var(--color-accent-50)',
          100: 'var(--color-accent-100)',
          200: 'var(--color-accent-200)',
          300: 'var(--color-accent-300)',
          400: 'var(--color-accent-400)',
          500: 'var(--color-accent-500)', // Saffron anchor
          600: 'var(--color-accent-600)',
          700: 'var(--color-accent-700)',
          800: 'var(--color-accent-800)',
          900: 'var(--color-accent-900)',
          950: 'var(--color-accent-950)',
        },
        secondary: {
          50: 'var(--color-secondary-50)',
          100: 'var(--color-secondary-100)',
          200: 'var(--color-secondary-200)',
          300: 'var(--color-secondary-300)',
          400: 'var(--color-secondary-400)',
          500: 'var(--color-secondary-500)', // Peacock Teal anchor
          600: 'var(--color-secondary-600)',
          700: 'var(--color-secondary-700)',
          800: 'var(--color-secondary-800)',
          900: 'var(--color-secondary-900)',
          950: 'var(--color-secondary-950)',
        },
        crimson: {
          50: 'var(--color-crimson-50)',
          100: 'var(--color-crimson-100)',
          200: 'var(--color-crimson-200)',
          300: 'var(--color-crimson-300)',
          400: 'var(--color-crimson-400)',
          500: 'var(--color-crimson-500)', // Nepal Crimson anchor
          600: 'var(--color-crimson-600)',
          700: 'var(--color-crimson-700)',
          800: 'var(--color-crimson-800)',
          900: 'var(--color-crimson-900)',
          950: 'var(--color-crimson-950)',
        },
        chakra: {
          50: 'var(--color-chakra-50)',
          100: 'var(--color-chakra-100)',
          200: 'var(--color-chakra-200)',
          300: 'var(--color-chakra-300)',
          400: 'var(--color-chakra-400)',
          500: 'var(--color-chakra-500)', // Chakra Navy anchor
          600: 'var(--color-chakra-600)',
          700: 'var(--color-chakra-700)',
          800: 'var(--color-chakra-800)',
          900: 'var(--color-chakra-900)',
          950: 'var(--color-chakra-950)',
        },
        indiagreen: {
          50: 'var(--color-indiagreen-50)',
          100: 'var(--color-indiagreen-100)',
          200: 'var(--color-indiagreen-200)',
          300: 'var(--color-indiagreen-300)',
          400: 'var(--color-indiagreen-400)',
          500: 'var(--color-indiagreen-500)', // India Green anchor
          600: 'var(--color-indiagreen-600)',
          700: 'var(--color-indiagreen-700)',
          800: 'var(--color-indiagreen-800)',
          900: 'var(--color-indiagreen-900)',
          950: 'var(--color-indiagreen-950)',
        },
        marigold: {
          50: 'var(--color-marigold-50)',
          100: 'var(--color-marigold-100)',
          200: 'var(--color-marigold-200)',
          300: 'var(--color-marigold-300)',
          400: 'var(--color-marigold-400)',
          500: 'var(--color-marigold-500)', // Marigold anchor
          600: 'var(--color-marigold-600)',
          700: 'var(--color-marigold-700)',
          800: 'var(--color-marigold-800)',
          900: 'var(--color-marigold-900)',
          950: 'var(--color-marigold-950)',
        },
        masala: {
          50: 'var(--color-masala-50)',
          100: 'var(--color-masala-100)',
          200: 'var(--color-masala-200)',
          300: 'var(--color-masala-300)',
          400: 'var(--color-masala-400)',
          500: 'var(--color-masala-500)', // Masala anchor
          600: 'var(--color-masala-600)',
          700: 'var(--color-masala-700)',
          800: 'var(--color-masala-800)',
          900: 'var(--color-masala-900)',
          950: 'var(--color-masala-950)',
        },
        brass: {
          50: 'var(--color-brass-50)',
          100: 'var(--color-brass-100)',
          200: 'var(--color-brass-200)',
          300: 'var(--color-brass-300)',
          400: 'var(--color-brass-400)',
          500: 'var(--color-brass-500)', // Brass anchor
          600: 'var(--color-brass-600)',
          700: 'var(--color-brass-700)',
          800: 'var(--color-brass-800)',
          900: 'var(--color-brass-900)',
          950: 'var(--color-brass-950)',
        },
        amberbeer: {
          50: 'var(--color-amberbeer-50)',
          100: 'var(--color-amberbeer-100)',
          200: 'var(--color-amberbeer-200)',
          300: 'var(--color-amberbeer-300)',
          400: 'var(--color-amberbeer-400)',
          500: 'var(--color-amberbeer-500)', // Amber Beer anchor
          600: 'var(--color-amberbeer-600)',
          700: 'var(--color-amberbeer-700)',
          800: 'var(--color-amberbeer-800)',
          900: 'var(--color-amberbeer-900)',
          950: 'var(--color-amberbeer-950)',
        },
        stout: {
          50: 'var(--color-stout-50)',
          100: 'var(--color-stout-100)',
          200: 'var(--color-stout-200)',
          300: 'var(--color-stout-300)',
          400: 'var(--color-stout-400)',
          500: 'var(--color-stout-500)', // Stout anchor
          600: 'var(--color-stout-600)',
          700: 'var(--color-stout-700)',
          800: 'var(--color-stout-800)',
          900: 'var(--color-stout-900)',
          950: 'var(--color-stout-950)',
        },
        cardamom: {
          50: 'var(--color-cardamom-50)',
          100: 'var(--color-cardamom-100)',
          200: 'var(--color-cardamom-200)',
          300: 'var(--color-cardamom-300)',
          400: 'var(--color-cardamom-400)',
          500: 'var(--color-cardamom-500)', // Cardamom anchor
          600: 'var(--color-cardamom-600)',
          700: 'var(--color-cardamom-700)',
          800: 'var(--color-cardamom-800)',
          900: 'var(--color-cardamom-900)',
          950: 'var(--color-cardamom-950)',
        },
        
        // Legacy Crown mappings for backward compatibility
        crown: {
          gold: 'var(--color-accent-500)', // Map to saffron
          'gold-light': 'var(--color-accent-400)',
          'gold-dark': 'var(--color-accent-600)',
          dark: 'var(--color-text)',
          ochre: 'var(--color-accent-600)',
          slate: 'var(--color-neutral-700)',
          'slate-light': 'var(--color-neutral-600)',
          'slate-dark': 'var(--color-neutral-800)',
          red: 'var(--color-crimson-600)',
          'red-light': 'var(--color-crimson-500)',
          'red-dark': 'var(--color-crimson-800)',
          cream: 'var(--color-neutral-50)',
          'cream-dark': 'var(--color-neutral-100)',
        },
        
        // Semantic colors for restaurant
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        neutral: 'var(--color-neutral-100)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        error: 'var(--color-error)',
      },
      fontFamily: {
        'display': ['var(--font-playfair)', 'Playfair Display', 'serif'], // For headings
        'body': ['var(--font-inter)', 'Inter', 'sans-serif'], // For body text
        'sans': ['var(--font-inter)', 'Inter', 'sans-serif'],
        'serif': ['var(--font-playfair)', 'Playfair Display', 'serif'],
      },
      backgroundImage: {
        'hero-pattern': "linear-gradient(135deg, rgba(212, 148, 30, 0.9), rgba(71, 85, 105, 0.8))",
        gradient:
          "linear-gradient(60deg, #f79533, #f37055, #ef4e7b, #a166ab, #5073b8, #1098ad, #07b39b, #6fba82)",
      },
      animation: {
        opacity: "opacity 0.25s ease-in-out",
        appearFromRight: "appearFromRight 300ms ease-in-out",
        wiggle: "wiggle 1.5s ease-in-out infinite",
        popup: "popup 0.25s ease-in-out",
        shimmer: "shimmer 3s ease-out infinite alternate",
        "scroll-left": "scroll-left 30s linear infinite",
      },
      keyframes: {
        opacity: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        appearFromRight: {
          "0%": { opacity: 0.3, transform: "translate(15%, 0px);" },
          "100%": { opacity: 1, transform: "translate(0);" },
        },
        wiggle: {
          "0%, 20%, 80%, 100%": {
            transform: "rotate(0deg)",
          },
          "30%, 60%": {
            transform: "rotate(-2deg)",
          },
          "40%, 70%": {
            transform: "rotate(2deg)",
          },
          "45%": {
            transform: "rotate(-4deg)",
          },
          "55%": {
            transform: "rotate(4deg)",
          },
        },
        popup: {
          "0%": { transform: "scale(0.8)", opacity: 0.8 },
          "50%": { transform: "scale(1.1)", opacity: 1 },
          "100%": { transform: "scale(1)", opacity: 1 },
        },
        shimmer: {
          "0%": { backgroundPosition: "0 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "scroll-left": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(calc(-320px * 6 - 1.5rem * 5))" },
        },
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    // Light & dark themes are added by default (it switches automatically based on OS settings)
    // You can add another theme among the list of 30+
    // Add "data-theme='theme_name" to any HTML tag to enable the 'theme_name' theme.
    // https://daisyui.com/
    themes: ["light", "dark"],
  },
};
