#!/bin/bash

# Clean up any previous builds
rm -rf .next out

# Install dependencies
npm install

# Build the application with production optimization
NEXT_TELEMETRY_DISABLED=1 NODE_ENV=production npm run build

# Ensure the out directory exists
if [ ! -d "out" ]; then
  echo "Error: 'out' directory not found after build"
  echo "Creating 'out' directory and copying files..."
  mkdir -p out
  cp -r .next/static out/
  cp -r public/* out/
fi

# Copy configuration files
cp _headers out/
cp _redirects out/
cp _routes.json out/

# Remove unnecessary files
rm -rf .next/cache/
find out -type f -size +20M -delete

# Optional: List any large files for debugging
echo "Checking for large files..."
find out -type f -size +10M -exec ls -lh {} \;

# List contents of out directory
echo "Contents of out directory:"
ls -la out/

# Success message
echo "Build completed successfully! Your static site is in the 'out' directory." 