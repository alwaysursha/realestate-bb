#!/bin/bash

# Deploy to Cloudflare Pages Script
# This script helps prepare and deploy your Next.js real estate project to Cloudflare Pages

echo "🚀 Preparing to deploy to Cloudflare Pages..."

# Step 1: Check if Git is initialized
if [ ! -d .git ]; then
  echo "📁 Initializing Git repository..."
  git init
  git add .
  git commit -m "Initial commit for Cloudflare Pages deployment"
else
  echo "✅ Git repository already initialized"
fi

# Step 2: Build the project
echo "🔨 Building the project..."
npm run build

# Check if build was successful
if [ $? -ne 0 ]; then
  echo "❌ Build failed. Please fix the errors and try again."
  exit 1
fi

echo "✅ Build successful!"

# Step 3: Check for environment variables
if [ ! -f .env ]; then
  echo "⚠️ No .env file found. Creating one..."
  echo "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here" > .env
  echo "⚠️ Please update the .env file with your actual Google Maps API key."
else
  echo "✅ .env file exists"
fi

# Step 4: Remind about Cloudflare Pages setup
echo "
🌐 Next steps for Cloudflare Pages deployment:

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket):
   git remote add origin <your-repository-url>
   git push -u origin main

2. Go to Cloudflare Dashboard: https://dash.cloudflare.com/
   - Click on 'Pages'
   - Click 'Create a project'
   - Connect to your Git repository
   - Configure build settings:
     - Project name: real-estate-project
     - Production branch: main
     - Framework preset: Next.js
     - Build command: npm run build
     - Build output directory: .next
   - Add environment variables:
     - NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: your_google_maps_api_key_here

3. Click 'Save and Deploy'

For more detailed instructions, see CLOUDFLARE_DEPLOYMENT_GUIDE.md
"

echo "🎉 Deployment preparation complete!" 