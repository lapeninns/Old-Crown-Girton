module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./styles/globals.css",
  ],
  theme: {
    extend: {
      colors: {
        // Old Crown Brand Colors
        crown: {
          gold: '#D4941E',
          'gold-light': '#E6A532',
          'gold-dark': '#B8800F',
          ochre: '#CC8400',
          slate: '#475569',
          'slate-light': '#64748B',
          'slate-dark': '#334155',
          red: '#DC2626',
          'red-light': '#EF4444',
          'red-dark': '#B91C1C',
          cream: '#FEF7ED',
          'cream-dark': '#FED7AA',
        },
        // Semantic colors for restaurant
        primary: '#D4941E', // Gold for main CTAs
        secondary: '#475569', // Slate for secondary actions
        accent: '#DC2626', // Red for urgency/special offers
        neutral: '#F8FAFC',
        success: '#059669',
        warning: '#D97706',
        error: '#DC2626',
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
