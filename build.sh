#!/bin/bash

# Clean up any previous builds
rm -rf .next out

# Install dependencies
npm install

# Build the application with production optimization
NEXT_TELEMETRY_DISABLED=1 NODE_ENV=production npm run build

# Remove unnecessary files
rm -rf .next/cache/
find out -type f -size +20M -delete

# Optional: List any large files for debugging
echo "Checking for large files..."
find out -type f -size +10M -exec ls -lh {} \;

# Success message
echo "Build completed successfully! Your static site is in the 'out' directory." 