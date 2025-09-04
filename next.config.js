/** @type {import('next').NextConfig} */
const path = require('path');
const crypto = require('crypto');

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // ESLint warnings are mostly design token standardization and unused imports
    // Kept disabled for production builds to ensure deployment stability
    ignoreDuringBuilds: true,
  },
  // Performance optimizations
  experimental: {
    turbo: {
      rules: {
        '*.svg': ['@svgr/webpack'],
      },
    },
    scrollRestoration: true,
  },
  
  // Advanced webpack configuration for maximum optimization
  webpack: (config, { isServer, dev }) => {
    // Suppress punycode deprecation warnings
    config.ignoreWarnings = [
      { module: /node_modules/, message: /punycode/ },
    ];
    // Enhanced code splitting configuration
    if (!isServer && !dev) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          // Framework code (React, Next.js) - higher priority
          framework: {
            name: 'framework',
            test: /[\/]node_modules[\/](react|react-dom|next)[\/]/,
            priority: 50,
            enforce: true,
            reuseExistingChunk: true,
          },
          // Heavy animation libraries - separate chunk
          animations: {
            name: 'animations',
            test: /[\/]node_modules[\/](framer-motion|react-spring|lottie-react)[\/]/,
            priority: 45,
            enforce: true,
            reuseExistingChunk: true,
          },
          // UI component libraries
          ui: {
            name: 'ui-libs',
            test: /[\/]node_modules[\/](@headlessui|lucide-react|react-hot-toast)[\/]/,
            priority: 40,
            enforce: true,
            reuseExistingChunk: true,
          },
          // Utility libraries
          libs: {
            name: 'libs',
            test: /[\/]node_modules[\/](axios|form-data|zod)[\/]/,
            priority: 35,
            enforce: true,
            reuseExistingChunk: true,
          },
          // Restaurant-specific components (large chunks identified)
          restaurant: {
            name: 'restaurant',
            test: /[\/]components[\/]restaurant[\/]/,
            priority: 30,
            minChunks: 2,
            enforce: true,
            reuseExistingChunk: true,
          },
          // Slideshow components (189KB chunk identified)
          slideshow: {
            name: 'slideshow', 
            test: /[\/]components[\/]slideshow[\/]/,
            priority: 28,
            enforce: true,
            reuseExistingChunk: true,
          },
          // Common code between pages
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 25,
            enforce: true,
            reuseExistingChunk: true,
          },
          // Default group for other vendors
          default: {
            minChunks: 1,
            priority: 20,
            reuseExistingChunk: true,
          },
        },
        // Optimize chunk size limits for mobile
        maxInitialRequests: 3,    // Reduced for mobile performance
        maxAsyncRequests: 6,      // Reduced for mobile
        minSize: 15000,           // 15KB minimum chunk size (reduced for mobile)
        maxSize: 80000,           // 80KB maximum chunk size (reduced for mobile)
      };

      // Tree shaking optimization
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;
      
      // Enable aggressive module concatenation
      config.optimization.concatenateModules = true;
    }

    // Optimize imports for tree shaking
    config.resolve.alias = {
      ...config.resolve.alias,
    };

    return config;
  },

  // Image optimization with mobile-first approach
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pbs.twimg.com',
      },
      {
        protocol: 'https',
        hostname: 'd1wkquwg5s1b04.cloudfront.net',
      },
    ],
    // Mobile-optimized device sizes - smaller sizes first for mobile-first loading
    deviceSizes: [480, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512],
    minimumCacheTTL: 31536000, // 1 year
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Mobile performance optimizations
    loader: 'default',
    unoptimized: false,
  },

  // Compression and caching
  compress: true,
  poweredByHeader: false,
  
  // Enhanced package import optimization
  transpilePackages: [],

  // Advanced performance optimizations
  swcMinify: true,
  output: 'standalone',
  async rewrites() {
    return [
      // Backward-compatible virtual path for legacy content -> new semantic folder
      { source: '/images/dishes/:path*', destination: '/images/food/:path*' },
    ];
  },
  
  // Bundle analysis environment variable
  ...(process.env.ANALYZE === 'true' && {
    webpack: (config, options) => {
      if (!options.isServer) {
        const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: 'server',
            analyzerPort: 8888,
            openAnalyzer: true,
          })
        );
      }
      return config;
    },
  }),
};

module.exports = nextConfig;
