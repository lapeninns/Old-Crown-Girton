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
          // Framework code (React, Next.js)
          framework: {
            name: 'framework',
            test: /[\/]node_modules[\/](react|react-dom|next)[\/]/,
            priority: 40,
            enforce: true,
            reuseExistingChunk: true,
          },
          // Heavy animation libraries
          animations: {
            name: 'animations',
            test: /[\/]node_modules[\/](framer-motion|react-spring|lottie-react)[\/]/,
            priority: 35,
            enforce: true,
            reuseExistingChunk: true,
          },
          // UI component libraries
          ui: {
            name: 'ui-libs',
            test: /[\/]node_modules[\/](@headlessui|lucide-react|react-hot-toast)[\/]/,
            priority: 30,
            enforce: true,
            reuseExistingChunk: true,
          },
          // Utility libraries
          libs: {
            name: 'libs',
            test: /[\/]node_modules[\/](axios|form-data|zod)[\/]/,
            priority: 25,
            enforce: true,
            reuseExistingChunk: true,
          },
          // Common code between pages
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 20,
            enforce: true,
            reuseExistingChunk: true,
          },
          // Default group for other vendors
          default: {
            minChunks: 1,
            priority: 10,
            reuseExistingChunk: true,
          },
        },
        // Optimize chunk size limits
        maxInitialRequests: 4,    // Reduced from default 5
        maxAsyncRequests: 8,      // Increased for better splitting
        minSize: 20000,           // 20KB minimum chunk size
        maxSize: 100000,          // 100KB maximum chunk size
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

  // Image optimization
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
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
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
