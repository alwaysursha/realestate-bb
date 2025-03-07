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
  trailingSlash: true,

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
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            chunks: 'all',
            priority: 10,
          },
          common: {
            minChunks: 2,
            priority: 1,
            reuseExistingChunk: true,
            name: 'common',
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
  poweredByHeader: false,
  generateEtags: false,
};

module.exports = nextConfig; 