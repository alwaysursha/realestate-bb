/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: '.next',
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

  // Exclude backup files and directories from the build
  webpack: (config, { isServer }) => {
    config.optimization = {
      ...config.optimization,
      minimize: true,
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: 25,
        minSize: 20000,
        maxSize: 15 * 1024 * 1024, // 15MB max chunk size
        cacheGroups: {
          vendor: {
            name: 'vendor',
            test: /[\\/]node_modules[\\/]/,
            chunks: 'all',
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            reuseExistingChunk: true,
            priority: -10
          }
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

  // Development configuration
  poweredByHeader: false,
  generateEtags: false
};

module.exports = nextConfig; 