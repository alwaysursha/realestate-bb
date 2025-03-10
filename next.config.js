/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove static export to enable server-side features
  images: {
    domains: ['images.unsplash.com', 'plus.unsplash.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  reactStrictMode: true,
  swcMinify: true,
  
  // Vercel specific optimizations
  poweredByHeader: false,
  compress: true,
  
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }
    return config;
  },
}

module.exports = nextConfig 