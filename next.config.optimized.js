/**
 * Optimized Next.js Configuration for Low-End Devices and Slow Networks
 * Specifically tuned for 2G/3G performance and limited memory devices
 */

/** @type {import('next').NextConfig} */
const path = require('path');
const crypto = require('crypto');

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Performance optimizations for low-end devices
  experimental: {
    turbo: {
      rules: {
        '*.svg': ['@svgr/webpack'],
      },
    },
    scrollRestoration: true,
    // Disable expensive optimizations on slow networks
    optimizeCss: process.env.NODE_ENV === 'production',
    // Reduce bundle analysis overhead
    bundlePagesExternals: true,
  },

  // Memory and CPU optimized webpack configuration
  webpack: (config, { isServer, dev }) => {
    // Suppress punycode deprecation warnings to reduce console noise
    config.ignoreWarnings = [
      { module: /node_modules/, message: /punycode/ },
    ];

    if (!isServer && !dev) {
      // Optimized code splitting for slow networks and low-end devices
      config.optimization.splitChunks = {
        chunks: 'all',
        
        // MORE conservative settings for 2G/3G networks and HTTP/1.1
        maxInitialRequests: 4,      // Increased slightly for better granularity
        maxAsyncRequests: 6,        // Conservative async loading
        minSize: 30000,            // 30KB minimum (good balance for HTTP/1.1)
        maxSize: 150000,           // 150KB maximum (faster downloads on slow networks)
        
        cacheGroups: {
          // Essential React framework - keep this separate as it rarely changes
          framework: {
            name: 'framework',
            test: /[\/]node_modules[\/](react|react-dom|scheduler)[\/]/,
            priority: 60,
            enforce: true,
            chunks: 'all', // Changed from 'initial' to allow better splitting
            reuseExistingChunk: true,
            minSize: 0 // Allow small chunks for framework code
          },
          
          // Next.js runtime - separate for caching benefits
          nextjs: {
            name: 'nextjs',
            test: /[\/]node_modules[\/](next)[\/]/,
            priority: 50,
            enforce: true,
            chunks: 'all', // Changed from 'initial'
            reuseExistingChunk: true,
            minSize: 0
          },
          
          // Essential vendor libraries that change infrequently
          vendor: {
            name: 'vendor',
            test: /[\/]node_modules[\/](?!(react|react-dom|scheduler|next)[\/])/,
            priority: 30,
            enforce: false,
            chunks: 'all',
            reuseExistingChunk: true,
            minChunks: 2, // Only split if used by 2+ chunks
            maxSize: 100000 // Smaller vendor chunks for better caching
          },
          
          // Common application code
          common: {
            name: 'common',
            minChunks: 3, // More conservative - must be used in 3+ places
            chunks: 'all',
            priority: 20,
            enforce: false,
            reuseExistingChunk: true,
            maxSize: 80000 // Keep common chunks small
          },
          
          // Default group with very conservative settings
          default: {
            minChunks: 2,
            priority: 10,
            reuseExistingChunk: true,
            maxSize: 60000 // Small default chunks
          },
        },
      };

      // Tree shaking optimization
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;
      config.optimization.concatenateModules = true;

      // Performance budgets for low-end devices
      config.performance = {
        maxAssetSize: 200000,      // 200KB max asset size
        maxEntrypointSize: 300000, // 300KB max entrypoint
        hints: 'warning',
        // Custom asset filter to exclude large assets from budget
        assetFilter: function(assetFilename) {
          return !/\.(map|txt|html)$/.test(assetFilename);
        }
      };

      // Memory optimization
      config.optimization.runtimeChunk = {
        name: 'runtime'
      };
    }

    // Alias optimizations for tree shaking
    config.resolve.alias = {
      ...config.resolve.alias,
      // Optimize imports for better tree shaking
      '@/components': path.resolve(__dirname, 'components'),
      '@/lib': path.resolve(__dirname, 'lib'),
      '@/hooks': path.resolve(__dirname, 'hooks'),
    };

    return config;
  },

  // Image optimization for slow networks
  images: {
    formats: ['image/webp', 'image/avif'],
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
    // Conservative device sizes for bandwidth savings
    deviceSizes: [640, 768, 1024, 1280], // Fewer sizes, more targeted
    imageSizes: [16, 32, 48, 64, 96, 128], // Smaller image sizes
    minimumCacheTTL: 31536000, // 1 year for aggressive caching
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Quality optimization for slow networks
    quality: 75, // Balanced quality/size ratio
    // Placeholder generation
    placeholder: 'blur',
    // Loader optimization
    loader: 'default',
    // Unoptimized images fallback
    unoptimized: process.env.NODE_ENV === 'development',
  },

  // Compression and caching optimizations
  compress: true,
  poweredByHeader: false,
  
  // Conservative transpilation for compatibility
  transpilePackages: [],

  // Production optimizations
  swcMinify: true,
  
  // Output optimization
  output: 'standalone',
  
  // Headers for caching and performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      // Static assets caching for slow networks
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // API response optimization
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=300, stale-while-revalidate=600',
          },
          {
            key: 'Accept-Encoding',
            value: 'gzip, deflate, br',
          },
        ],
      },
    ];
  },

  // Rewrites for performance optimization
  async rewrites() {
    return [
      // Optimize image delivery for slow networks
      {
        source: '/images/dishes/:path*',
        destination: '/api/images/optimized/:path*',
      },
      // Service worker for offline functionality
      {
        source: '/sw.js',
        destination: '/api/sw',
      },
    ];
  },

  // Bundle analysis for development
  ...(process.env.ANALYZE === 'true' && {
    webpack: (config, options) => {
      if (!options.isServer) {
        const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: 'server',
            analyzerPort: 8888,
            openAnalyzer: true,
            // Generate stats for low-end device optimization analysis
            generateStatsFile: true,
            statsFilename: 'bundle-stats.json',
          })
        );
      }
      return config;
    },
  }),

  // Environment-specific optimizations
  ...(process.env.NODE_ENV === 'production' && {
    // Production-only optimizations
    generateEtags: true,
    httpAgentOptions: {
      keepAlive: true,
    },
  }),
};

// Development-specific optimizations for testing on slow networks
if (process.env.NODE_ENV === 'development') {
  // Simulate slow network conditions for testing
  nextConfig.webpack = (config, options) => {
    if (process.env.SIMULATE_SLOW_NETWORK === 'true') {
      // Add artificial delays for testing slow network scenarios
      config.plugins.push({
        apply: (compiler) => {
          compiler.hooks.beforeCompile.tapAsync('SlowNetworkSimulator', (params, callback) => {
            setTimeout(callback, 100); // 100ms delay
          });
        },
      });
    }
    return config;
  };
}

module.exports = nextConfig;
