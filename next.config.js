/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    domains: ['images.unsplash.com', 'plus.unsplash.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  trailingSlash: true,

  // Exclude backup files and directories from the build
  webpack: (config, { isServer }) => {
    // Optimize chunk sizes
    config.optimization = {
      ...config.optimization,
      minimize: true,
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: 25,
        minSize: 20000,
        maxSize: 20 * 1024 * 1024, // 20MB max chunk size
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
              return `vendor.${packageName.replace('@', '')}`;
            },
            priority: -10,
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
        },
      },
    };

    // Exclude backup files
    config.module.rules.push({
      test: /\.(js|jsx|ts|tsx)$/,
      exclude: [/backups/, /temp_restore/],
    });

    return config;
  },

  // Cloudflare Pages specific configuration
  output: 'standalone',
  poweredByHeader: false,
  generateEtags: false,
};

module.exports = nextConfig; 