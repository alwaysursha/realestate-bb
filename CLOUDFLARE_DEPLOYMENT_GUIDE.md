# Deploying Your Real Estate Project to Cloudflare Pages

This guide will walk you through the process of deploying your Next.js real estate project to Cloudflare Pages.

## Prerequisites

1. A [Cloudflare account](https://dash.cloudflare.com/sign-up)
2. Your project code pushed to a Git repository (GitHub, GitLab, or Bitbucket)
3. Node.js and npm installed on your local machine

## Step 1: Prepare Your Project for Deployment

Before deploying, make sure your project is ready:

1. Create a `.env` file in your project root with your Google Maps API key:

```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

2. Update your `next.config.js` file to optimize for Cloudflare Pages:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
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
};

module.exports = nextConfig;
```

3. Make sure your `package.json` has the correct build scripts (which it already does):

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint"
}
```

## Step 2: Push Your Code to a Git Repository

If you haven't already, push your code to a Git repository:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repository-url>
git push -u origin main
```

## Step 3: Connect Cloudflare Pages to Your Repository

1. Log in to your [Cloudflare dashboard](https://dash.cloudflare.com/)
2. Click on "Pages" in the sidebar
3. Click "Create a project"
4. Select "Connect to Git"
5. Choose your Git provider (GitHub, GitLab, or Bitbucket) and authenticate
6. Select your real estate project repository
7. Click "Begin setup"

## Step 4: Configure Your Build Settings

Configure the following build settings:

- **Project name**: `real-estate-project` (or your preferred name)
- **Production branch**: `main` (or your default branch)
- **Framework preset**: Select "Next.js"
- **Build command**: `npm run build`
- **Build output directory**: `.next`
- **Root directory**: `/` (leave as default)

## Step 5: Add Environment Variables

Add your environment variables:

1. Scroll down to the "Environment variables" section
2. Click "Add variable"
3. Add the following variable:
   - Variable name: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
   - Value: Your Google Maps API key

## Step 6: Deploy Your Site

1. Click "Save and Deploy"
2. Wait for the build and deployment process to complete
3. Once deployed, Cloudflare will provide you with a URL to access your site (e.g., `https://real-estate-project.pages.dev`)

## Step 7: Configure Custom Domain (Optional)

If you want to use a custom domain:

1. Go to your Pages project in the Cloudflare dashboard
2. Click on "Custom domains"
3. Click "Set up a custom domain"
4. Enter your domain name and follow the instructions

## Troubleshooting

If you encounter any issues during deployment:

1. **Build failures**: Check the build logs for errors
2. **Image loading issues**: Make sure your `next.config.js` has the correct image configuration
3. **API key issues**: Verify that your environment variables are set correctly
4. **Routing problems**: Ensure your Next.js routes are configured properly

## Updating Your Deployment

To update your site after making changes:

1. Push your changes to your Git repository
2. Cloudflare Pages will automatically detect the changes and start a new deployment
3. Once the build is complete, your site will be updated

## Additional Resources

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Cloudflare Pages with Next.js](https://developers.cloudflare.com/pages/framework-guides/deploy-a-nextjs-site/) 