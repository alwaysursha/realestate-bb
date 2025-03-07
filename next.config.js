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
    config.module.rules.push({
      test: /\.(js|jsx|ts|tsx)$/,
      exclude: [/backups/, /temp_restore/],
    });
    return config;
  },
};

module.exports = nextConfig; 