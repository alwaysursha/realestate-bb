// Cloudflare Pages Configuration
module.exports = {
  // Specify the build output directory
  buildOutputDirectory: 'out',
  
  // Specify the build command
  buildCommand: 'npm run build',
  
  // Specify routes for SPA fallback
  routes: [
    {
      pattern: '**/*.html',
      target: '$1',
    },
    {
      pattern: '**/*',
      target: '/index.html',
    },
  ],
  
  // Specify headers
  headers: {
    '/*': {
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
    '/images/*': {
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
    '/static/*': {
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  },
}; 