#!/bin/bash

# Clean up any previous builds
rm -rf .next

# Install dependencies
npm install

# Build the application with production optimization
NEXT_TELEMETRY_DISABLED=1 npm run build

# Remove unnecessary files from .next
rm -rf .next/cache/
find .next -type f -size +20M -delete

# Optional: List any large files for debugging
echo "Checking for large files..."
find .next -type f -size +10M -exec ls -lh {} \;

# Success message
echo "Build completed successfully! Your static site is in the 'out' directory." 