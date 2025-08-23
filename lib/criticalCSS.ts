// Critical CSS for above-the-fold content
// This CSS will be inlined in the HTML head for fastest loading

const { themes } = require('../theme/colors');

// Use CSS custom properties (defined in app/globals.css) so critical CSS matches runtime variables
export const criticalCSS = `
/* Essential layout and typography */
.font-display { font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif; }
.font-sans { font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif; }

/* Himalayan Spice brand colors - most critical (use CSS variables) */
.text-brand-terracotta { color: var(--color-primary); }
.bg-brand-terracotta { background-color: var(--color-primary); }
.text-accent-saffron { color: var(--color-accent); }
.bg-accent-saffron { background-color: var(--color-accent); }
.text-neutral-cream { color: var(--color-surface-base); }
.bg-neutral-cream { background-color: var(--color-surface-base); }
.text-secondary-teal { color: var(--color-secondary); }
.bg-secondary-teal { background-color: var(--color-secondary); }

.text-accent-500 { color: var(--color-accent); }
.bg-accent-500 { background-color: var(--color-accent); }
.text-accent-600 { color: var(--color-primary); }
.bg-accent-600 { background-color: var(--color-primary); }
.text-brand-50 { color: var(--color-surface-base); }
.bg-brand-50 { background-color: var(--color-surface-base); }
.text-stout-700 { color: var(--color-secondary); }
.bg-stout-700 { background-color: var(--color-secondary); }

/* Critical layout utilities */
.min-h-screen { min-height: 100vh; }
.h-screen { height: 100vh; }
.w-full { width: 100%; }
.max-w-7xl { max-width: 80rem; }
.mx-auto { margin-left: auto; margin-right: auto; }
.px-4 { padding-left: 1rem; padding-right: 1rem; }
.py-8 { padding-top: 2rem; padding-bottom: 2rem; }
.py-16 { padding-top: 4rem; padding-bottom: 4rem; }

/* Critical flexbox and grid */
.flex { display: flex; }
.grid { display: grid; }
.items-center { align-items: center; }
.justify-center { justify-content: center; }
.text-center { text-align: center; }
.space-y-4 > * + * { margin-top: 1rem; }
.gap-4 { gap: 1rem; }
.gap-6 { gap: 1.5rem; }

/* Typography essentials */
.text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
.text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
.text-5xl { font-size: 3rem; line-height: 1; }
.text-xl { font-size: 1.25rem; line-height: 1.75rem; }
.text-lg { font-size: 1.125rem; line-height: 1.75rem; }
.font-bold { font-weight: 700; }
.font-semibold { font-weight: 600; }
.font-medium { font-weight: 500; }

/* Hero section critical styles */
.hero-gradient { 
  background: linear-gradient(135deg, var(--color-surface-base) 0%, var(--color-accent-500/10) 100%);
}
.himalayan-gradient {
  background: linear-gradient(135deg, var(--color-surface-base) 0%, var(--color-accent-500/10) 100%);
}

/* Button essentials */
.btn-primary {
  background-color: var(--color-primary);
  color: var(--color-text);
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: background-color 0.2s;
}
.btn-primary:hover {
  background-color: var(--color-accent);
}

/* Loading states */
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: .5; }
}

/* Mobile-first responsive utilities */
@media (min-width: 640px) {
  .sm\\:px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
  .sm\\:text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
}
@media (min-width: 768px) {
  .md\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .md\\:text-5xl { font-size: 3rem; line-height: 1; }
}
@media (min-width: 1024px) {
  .lg\\:px-8 { padding-left: 2rem; padding-right: 2rem; }
  .lg\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .lg\\:text-6xl { font-size: 3.75rem; line-height: 1; }
}
`;

// Function to inject critical CSS
export const injectCriticalCSS = () => {
  if (typeof document !== 'undefined') {
    const existingStyle = document.getElementById('critical-css');
    if (!existingStyle) {
      const style = document.createElement('style');
      style.id = 'critical-css';
      style.innerHTML = criticalCSS;
      document.head.appendChild(style);
    }
  }
};

// Preload critical fonts
export const preloadCriticalFonts = () => {
  if (typeof document !== 'undefined') {
    const fontPreloads = [
      '/fonts/display-font.woff2', // Add your actual font paths
      '/fonts/body-font.woff2'
    ];
    
    fontPreloads.forEach(fontPath => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = fontPath;
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  }
};
