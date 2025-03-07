#!/bin/bash

# Install dependencies including Swiper
echo "Installing dependencies..."
npm install
npm install swiper@11.0.5 --save

# Build the Next.js application
echo "Building Next.js application..."
npm run build

# Success message
echo "Build completed successfully! Your static site is in the 'out' directory." 